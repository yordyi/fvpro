// fingerprint.worker.js - Web Worker for fingerprint calculations

// Canvas fingerprint generation
function generateCanvasFingerprint() {
  try {
    const canvas = new OffscreenCanvas(200, 50)
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      return ''
    }

    // Draw complex graphics
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.font = '14px Arial'
    ctx.textBaseline = 'top'
    ctx.fillText('Privacy Guardian 🔒', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('Security Check', 4, 35)

    // Add shadows and gradients
    ctx.shadowColor = 'red'
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 2
    ctx.fillStyle = 'blue'
    ctx.fillRect(150, 10, 10, 10)

    // Draw bezier curve
    ctx.beginPath()
    ctx.moveTo(20, 20)
    ctx.bezierCurveTo(20, 30, 40, 30, 40, 20)
    ctx.stroke()

    // Convert to data URL equivalent
    return canvas.convertToBlob().then(blob => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    })
  } catch (error) {
    return ''
  }
}

// Calculate uniqueness score
function calculateUniquenessScore(data) {
  let score = 0
  
  // Canvas fingerprint weight
  if (data.canvas) score += 25
  
  // WebGL fingerprint weight
  if (data.webgl) score += 25
  
  // Audio fingerprint weight
  if (data.audio) score += 20
  
  // Font fingerprint weight
  if (data.fonts && data.fonts.length > 10) score += 20
  else if (data.fonts && data.fonts.length > 5) score += 15
  else if (data.fonts && data.fonts.length > 0) score += 10
  
  // Screen fingerprint weight
  if (data.screen) score += 10
  
  return Math.min(100, score)
}

// Message handler
self.addEventListener('message', async (event) => {
  const { type, data, id } = event.data
  
  try {
    let result
    
    switch (type) {
      case 'generateCanvas':
        result = await generateCanvasFingerprint()
        self.postMessage({
          type: 'canvasResult',
          data: result,
          id
        })
        break
        
      case 'calculateScore':
        result = calculateUniquenessScore(data)
        self.postMessage({
          type: 'scoreResult',
          data: result,
          id
        })
        break
        
      default:
        self.postMessage({
          type: 'error',
          error: 'Unknown message type',
          id
        })
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message || 'Worker error',
      id
    })
  }
})