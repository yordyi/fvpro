import { analyzeIPPrivacy } from '../ip-detection'

describe('analyzeIPPrivacy', () => {
  it('should give perfect score for consistent single public IP', () => {
    const result = analyzeIPPrivacy([
      { ip: '8.8.8.8', source: 'test1' },
      { ip: '8.8.8.8', source: 'test2' }
    ])
    
    expect(result.score).toBe(100)
    expect(result.issues).toHaveLength(0)
  })

  it('should detect inconsistent IPs', () => {
    const result = analyzeIPPrivacy([
      { ip: '192.168.1.1', source: 'test1' },
      { ip: '10.0.0.1', source: 'test2' }
    ])
    
    expect(result.score).toBeLessThan(100)
    expect(result.issues).toContain('检测到多个不同的IP地址，可能存在泄露')
  })

  it('should detect local IP leak', () => {
    const result = analyzeIPPrivacy([
      { ip: '192.168.1.1', source: 'test' }
    ])
    
    expect(result.score).toBeLessThan(100)
    expect(result.issues).toContain('检测到本地IP地址泄露')
  })

  it('should handle empty IP array', () => {
    const result = analyzeIPPrivacy([])
    
    expect(result.score).toBe(100)
    expect(result.issues).toHaveLength(0)
  })

  it('should handle IPs with different formats', () => {
    const result = analyzeIPPrivacy([
      { ip: '8.8.8.8', source: 'test1' },
      { origin: '8.8.8.8' }
    ])
    
    expect(result.score).toBe(100)
    expect(result.issues).toHaveLength(0)
  })

  it('should detect multiple local IP patterns', () => {
    const result = analyzeIPPrivacy([
      { ip: '192.168.1.1', source: 'test1' },
      { ip: '10.0.0.1', source: 'test2' },
      { ip: '172.16.0.1', source: 'test3' }
    ])
    
    expect(result.issues).toContain('检测到本地IP地址泄露')
    expect(result.issues).toContain('检测到多个不同的IP地址，可能存在泄露')
  })
})