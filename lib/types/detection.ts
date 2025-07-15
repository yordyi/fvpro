export interface IPDetectionResult {
  clientIP: string
  detectedIPs: Array<{ ip?: string; origin?: string }>
  isConsistent: boolean
  isVPN: boolean
  location?: {
    country: string
    city: string
    region: string
  }
}

export interface WebRTCResult {
  hasLeak: boolean
  localIPs: string[]
  publicIPs: string[]
  error?: string
}

export interface FingerprintResult {
  canvasFingerprint: string
  webglFingerprint: string
  audioFingerprint: string
  fontFingerprint: string[]
  screenFingerprint: string
  uniquenessScore: number
}

export interface BrowserResult {
  userAgent: string
  platform: string
  vendor: string
  language: string
  cookiesEnabled: boolean
  doNotTrack: boolean
  hardwareConcurrency: number
  deviceMemory: number
  screenResolution: string
  colorDepth: number
  timezone: string
  plugins: string[]
}

export interface DNSResult {
  hasDNSLeak: boolean
  dnsServers: string[]
  isUsingVPNDNS: boolean
  dnsLocation?: {
    country: string
    city: string
    isp: string
  }
  error?: string
}

export interface IPv6Result {
  hasIPv6: boolean
  hasIPv6Leak: boolean
  ipv6Addresses: string[]
  ipv4Addresses: string[]
  isIPv6Disabled: boolean
  error?: string
}

export interface DetectionResults {
  ip: IPDetectionResult
  webrtc: WebRTCResult
  fingerprint: FingerprintResult
  browser: BrowserResult
  dns: DNSResult
  ipv6: IPv6Result
  score: SecurityScore
  timestamp: string
}

export interface SecurityScore {
  total: number
  breakdown: {
    ipPrivacy: number
    webrtcProtection: number
    fingerprintResistance: number
    browserHardening: number
    dnsPrivacy: number
    ipv6Protection: number
  }
  level: 'low' | 'medium' | 'high'
}

export interface DetectionState {
  isDetecting: boolean
  progress: number
  currentStep: string
  error?: string
}