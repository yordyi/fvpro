import { calculateSecurityScore } from '../scoring'
import { IPDetectionResult, WebRTCResult, FingerprintResult, BrowserResult } from '@/lib/types/detection'

describe('calculateSecurityScore', () => {
  const mockIPResult: IPDetectionResult = {
    clientIP: '192.168.1.1',
    detectedIPs: [{ ip: '192.168.1.1', source: 'test' }],
    isConsistent: true,
    isVPN: false,
  }

  const mockWebRTCResult: WebRTCResult = {
    hasLeak: false,
    localIPs: [],
    publicIPs: [],
  }

  const mockFingerprintResult: FingerprintResult = {
    canvasFingerprint: 'test-canvas',
    webglFingerprint: 'test-webgl',
    audioFingerprint: 'test-audio',
    fontFingerprint: ['Arial', 'Helvetica'],
    screenFingerprint: 'test-screen',
    uniquenessScore: 50,
  }

  const mockBrowserResult: BrowserResult = {
    userAgent: 'Mozilla/5.0',
    platform: 'MacIntel',
    vendor: 'Apple',
    language: 'en-US',
    cookiesEnabled: false,
    doNotTrack: true,
    hardwareConcurrency: 8,
    deviceMemory: 8,
    screenResolution: '1920x1080',
    colorDepth: 24,
    timezone: 'America/New_York',
    plugins: [],
  }

  it('should calculate perfect score for ideal privacy settings', () => {
    const result = calculateSecurityScore({
      ipResult: mockIPResult,
      webrtcResult: mockWebRTCResult,
      fingerprintResult: { ...mockFingerprintResult, uniquenessScore: 0 },
      browserResult: mockBrowserResult,
    })

    expect(result.total).toBeGreaterThan(80)
    expect(result.level).toBe('high')
  })

  it('should calculate low score for poor privacy settings', () => {
    const poorIPResult: IPDetectionResult = {
      ...mockIPResult,
      detectedIPs: [
        { ip: '192.168.1.1', source: 'test1' },
        { ip: '10.0.0.1', source: 'test2' }
      ],
      isConsistent: false,
    }

    const poorWebRTCResult: WebRTCResult = {
      hasLeak: true,
      localIPs: ['192.168.1.1'],
      publicIPs: ['8.8.8.8'],
    }

    const poorFingerprintResult: FingerprintResult = {
      ...mockFingerprintResult,
      uniquenessScore: 90,
    }

    const poorBrowserResult: BrowserResult = {
      ...mockBrowserResult,
      cookiesEnabled: true,
      doNotTrack: false,
      plugins: ['Flash', 'Java', 'Silverlight'],
    }

    const result = calculateSecurityScore({
      ipResult: poorIPResult,
      webrtcResult: poorWebRTCResult,
      fingerprintResult: poorFingerprintResult,
      browserResult: poorBrowserResult,
    })

    expect(result.total).toBeLessThan(50)
    expect(result.level).toBe('low')
  })

  it('should calculate medium score for average privacy settings', () => {
    const avgWebRTCResult: WebRTCResult = {
      hasLeak: true,
      localIPs: ['192.168.1.1'],
      publicIPs: [],
    }

    const result = calculateSecurityScore({
      ipResult: mockIPResult,
      webrtcResult: avgWebRTCResult,
      fingerprintResult: mockFingerprintResult,
      browserResult: mockBrowserResult,
    })

    expect(result.total).toBeGreaterThanOrEqual(50)
    expect(result.total).toBeLessThan(80)
    expect(result.level).toBe('medium')
  })

  it('should have correct breakdown scores', () => {
    const result = calculateSecurityScore({
      ipResult: mockIPResult,
      webrtcResult: mockWebRTCResult,
      fingerprintResult: mockFingerprintResult,
      browserResult: mockBrowserResult,
    })

    expect(result.breakdown).toHaveProperty('ipPrivacy')
    expect(result.breakdown).toHaveProperty('webrtcProtection')
    expect(result.breakdown).toHaveProperty('fingerprintResistance')
    expect(result.breakdown).toHaveProperty('browserHardening')
    
    // All scores should be between 0 and 100
    Object.values(result.breakdown).forEach(score => {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })
  })
})