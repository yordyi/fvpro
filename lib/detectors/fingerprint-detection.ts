export interface FingerprintResult {
  canvasFingerprint: string
  webglFingerprint: string
  audioFingerprint: string
  fontFingerprint: string[]
  screenFingerprint: string
  uniquenessScore: number
}

export async function detectFingerprint(): Promise<FingerprintResult> {
  const canvas = await generateCanvasFingerprint()
  const webgl = await generateWebGLFingerprint()
  const audio = await generateAudioFingerprint()
  const fonts = await detectFonts()
  const screen = generateScreenFingerprint()

  return {
    canvasFingerprint: canvas,
    webglFingerprint: webgl,
    audioFingerprint: audio,
    fontFingerprint: fonts,
    screenFingerprint: screen,
    uniquenessScore: calculateUniquenessScore({
      canvas, webgl, audio, fonts, screen
    })
  }
}

async function generateCanvasFingerprint(): Promise<string> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        resolve('')
        return
      }

      canvas.width = 200
      canvas.height = 50

      // 绘制复杂图形
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('Privacy Guardian 🔒', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('Security Check', 4, 35)

      // 添加阴影和渐变
      ctx.shadowColor = 'red'
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.shadowBlur = 2
      ctx.fillStyle = 'blue'
      ctx.fillRect(150, 10, 10, 10)

      // 绘制贝塞尔曲线
      ctx.beginPath()
      ctx.moveTo(20, 20)
      ctx.bezierCurveTo(20, 30, 40, 30, 40, 20)
      ctx.stroke()

      resolve(canvas.toDataURL())
    } catch (error) {
      resolve('')
    }
  })
}

async function generateWebGLFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) return ''

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)

    const info = {
      vendor,
      renderer,
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      maxVertexTextureImageUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
      maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      redBits: gl.getParameter(gl.RED_BITS),
      greenBits: gl.getParameter(gl.GREEN_BITS),
      blueBits: gl.getParameter(gl.BLUE_BITS),
      alphaBits: gl.getParameter(gl.ALPHA_BITS),
      depthBits: gl.getParameter(gl.DEPTH_BITS),
      stencilBits: gl.getParameter(gl.STENCIL_BITS),
      extensions: gl.getSupportedExtensions()
    }

    return btoa(JSON.stringify(info))
  } catch (error) {
    return ''
  }
}

async function generateAudioFingerprint(): Promise<string> {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return ''

    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const analyser = context.createAnalyser()
    const gainNode = context.createGain()
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1)

    oscillator.type = 'triangle'
    oscillator.frequency.value = 10000
    gainNode.gain.value = 0

    oscillator.connect(analyser)
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(gainNode)
    gainNode.connect(context.destination)

    return new Promise((resolve) => {
      let fingerprint = ''
      
      scriptProcessor.onaudioprocess = (event) => {
        const output = event.outputBuffer.getChannelData(0)
        let sum = 0
        for (let i = 0; i < output.length; i++) {
          sum += Math.abs(output[i])
        }
        fingerprint = sum.toString()
        
        oscillator.disconnect()
        analyser.disconnect()
        scriptProcessor.disconnect()
        gainNode.disconnect()
        context.close()
        
        resolve(fingerprint)
      }

      oscillator.start(0)
    })
  } catch (error) {
    return ''
  }
}

async function detectFonts(): Promise<string[]> {
  const baseFonts = ['monospace', 'sans-serif', 'serif']
  const testString = 'mmmmmmmmmmlli'
  const testSize = '72px'
  const h = document.getElementsByTagName('body')[0]
  
  const s = document.createElement('span')
  s.style.position = 'absolute'
  s.style.left = '-9999px'
  s.style.fontSize = testSize
  s.style.fontStyle = 'normal'
  s.style.fontWeight = 'normal'
  s.style.letterSpacing = 'normal'
  s.style.lineBreak = 'auto'
  s.style.lineHeight = 'normal'
  s.style.textTransform = 'none'
  s.style.textAlign = 'left'
  s.style.textDecoration = 'none'
  s.style.textShadow = 'none'
  s.style.whiteSpace = 'normal'
  s.style.wordBreak = 'normal'
  s.style.wordSpacing = 'normal'
  s.innerHTML = testString
  
  const defaultWidth: { [key: string]: number } = {}
  const defaultHeight: { [key: string]: number } = {}
  
  // 获取基础字体的宽高
  for (const baseFont of baseFonts) {
    s.style.fontFamily = baseFont
    h.appendChild(s)
    defaultWidth[baseFont] = s.offsetWidth
    defaultHeight[baseFont] = s.offsetHeight
    h.removeChild(s)
  }
  
  const testFonts = [
    'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Georgia',
    'Courier New', 'Comic Sans MS', 'Impact', 'Lucida Console',
    'Tahoma', 'Trebuchet MS', 'Arial Black', 'Arial Narrow', 'Book Antiqua'
  ]
  
  const detectedFonts: string[] = []
  
  for (const font of testFonts) {
    let detected = false
    
    for (const baseFont of baseFonts) {
      s.style.fontFamily = `'${font}',${baseFont}`
      h.appendChild(s)
      
      const matched = (s.offsetWidth !== defaultWidth[baseFont] || 
                      s.offsetHeight !== defaultHeight[baseFont])
      
      h.removeChild(s)
      
      if (matched) {
        detected = true
        break
      }
    }
    
    if (detected) {
      detectedFonts.push(font)
    }
  }
  
  return detectedFonts
}

function generateScreenFingerprint(): string {
  const screen = window.screen
  const data = {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    devicePixelRatio: window.devicePixelRatio,
    orientation: screen.orientation?.type || 'unknown'
  }
  
  return btoa(JSON.stringify(data))
}

function calculateUniquenessScore(data: {
  canvas: string
  webgl: string
  audio: string
  fonts: string[]
  screen: string
}): number {
  let score = 0
  
  // Canvas指纹权重
  if (data.canvas) score += 25
  
  // WebGL指纹权重
  if (data.webgl) score += 25
  
  // 音频指纹权重
  if (data.audio) score += 20
  
  // 字体指纹权重
  if (data.fonts.length > 10) score += 20
  else if (data.fonts.length > 5) score += 15
  else if (data.fonts.length > 0) score += 10
  
  // 屏幕指纹权重
  if (data.screen) score += 10
  
  return Math.min(100, score)
}