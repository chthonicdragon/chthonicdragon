/**
 * Umbra spirit: code rain is drawn into a dense spirit figure with slit-pupil eyes.
 * Condensed port of the production UmbraAscendantScene (default form, "speaking" palette,
 * without the orbit ring, ripples, or outer rings). Free of React; the component owns the loop.
 */
import { drawEyes, type RGB } from '@/lib/umbraEyes'

const BODY: RGB = [75, 18, 145]
const EYE: RGB = [255, 205, 90]
const GLYPH: RGB = [200, 105, 255]
const EYE_SPEED = 0.8
const EYE_SQUINT = 0.92
const LOOK_RANGE = 0.1
const LOOK_SPEED = 0.09
const BLINK_MIN = 2
const BLINK_MAX = 5

// The production "spirit" form: six overlapping blobs plus a radial falloff.
const BLOBS = [
  { dx: 0, dy: 0, rx: 1, ry: 1, w: 1 },
  { dx: 0, dy: -0.38, rx: 0.55, ry: 0.5, w: 0.65 },
  { dx: -0.32, dy: 0.08, rx: 0.52, ry: 0.55, w: 0.48 },
  { dx: 0.28, dy: -0.12, rx: 0.48, ry: 0.52, w: 0.42 },
  { dx: 0.08, dy: 0.42, rx: 0.38, ry: 0.4, w: 0.3 },
  { dx: -0.18, dy: -0.28, rx: 0.32, ry: 0.35, w: 0.32 },
] as const

const RUNES = 'ᛟᛞᚾᛗᛚᛇᛈᛉᛋᛏᛒᛖᚦᚱᚨ'
const SYMBOLS = '☉☽☿♀♂♃♄♅♆⚚'
const EYE_GLYPHS = '◎◉◐◑⊚'
const RAIN_GLYPHS = '01☉☽☿♄/\\-+=#%'
const BINARY = '01010110011010010100101100110101'

const T_BODY = 0
const T_EYE = 1
const T_GLYPH = 3
const T_RAIN = 4
const S_FALL = 0
const S_SPIRAL = 1
const S_SETTLED = 2
const S_SCATTER = 3

const pick = (s: string) => s[Math.floor(Math.random() * s.length)] ?? '0'
const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

export interface Scene {
  W: number
  H: number
  CX: number
  CY: number
  R: number
  N: number
  nBody: number
  nEye: number
  nGlyph: number
  px: Float32Array
  py: Float32Array
  vx: Float32Array
  vy: Float32Array
  hx: Float32Array
  hy: Float32Array
  phase: Float32Array
  speed: Float32Array
  alpha: Float32Array
  size: Float32Array
  density: Float32Array
  sAngle: Float32Array
  sRadius: Float32Array
  eox: Float32Array
  eoy: Float32Array
  state: Uint8Array
  type: Uint8Array
  chars: (string | null)[]
  r: Float32Array
  g: Float32Array
  b: Float32Array
  t: number
  settledFrac: number
  look: { x: number; y: number; tx: number; ty: number; timer: number }
  blink: { state: number; scale: number; nextAt: number; pause: number }
  eyePulse: number
  cooldown: number
  nextFlushAt: number
  flushFrames: number
}

export interface Input {
  x: number | null
  y: number | null
}

const leftEye = (s: Scene) => ({ x: s.CX - s.R * 0.28, y: s.CY - s.R * 0.22 })
const rightEye = (s: Scene) => ({ x: s.CX + s.R * 0.28, y: s.CY - s.R * 0.22 })

function sampleBody(s: Scene) {
  const { R, CX, CY } = s
  for (let a = 0; a < 400; a++) {
    const x = (Math.random() * 2 - 1) * R * 1.03
    const y = (Math.random() * 2 - 1) * R * 1.08
    let value = 0
    for (const b of BLOBS) {
      const nx = (x - b.dx * R) / (R * b.rx)
      const ny = (y - b.dy * R) / (R * b.ry)
      value += b.w * Math.exp(-(nx * nx + ny * ny) * 2.8)
    }
    const radial = Math.exp(-((x * x) / (R * R * 0.62) + (y * y) / (R * R * 0.68)))
    const density = Math.min(1, value * 0.6 + radial * 0.82)
    if (density > 0.2 + Math.random() * 0.1) return { x: CX + x, y: CY + y - R * 0.02, density }
  }
  return { x: CX, y: CY, density: 1 }
}

function initRain(s: Scene, i: number, visible = false) {
  const { CX, R, H } = s
  const lane = Math.round(((Math.random() * 2 - 1) * R * 1.25) / 14) * 14
  s.px[i] = CX + lane + (Math.random() - 0.5) * 3
  s.py[i] = visible ? (Math.random() - 0.2) * H : -12 - Math.random() * H * 0.65
  s.vx[i] = (Math.random() - 0.5) * 0.16
  s.vy[i] = s.type[i] === T_GLYPH ? 0.24 + Math.random() * 0.38 : 0.32 + Math.random() * 0.5
  s.state[i] = S_FALL
  s.phase[i] = Math.random() * Math.PI * 2
  s.speed[i] = 0.01 + Math.random() * 0.028
  s.alpha[i] = 0.15 + Math.random() * 0.45
  const ty = s.type[i]
  if (ty === T_GLYPH) {
    s.chars[i] = pick(RUNES + SYMBOLS)
    s.size[i] = 8 + Math.random() * 6
  } else if (ty === T_EYE) {
    s.chars[i] = Math.random() < 0.28 ? pick(EYE_GLYPHS) : null
    s.size[i] = 2.2 + Math.random() * 2.5
  } else if (ty === T_RAIN) {
    s.chars[i] = pick(RAIN_GLYPHS)
    s.size[i] = 7 + Math.random() * 5
  } else {
    const bin = Math.random() < 0.16
    s.chars[i] = bin ? pick(BINARY) : Math.random() < 0.035 ? pick(RUNES) : null
    s.size[i] = bin ? 3 + Math.random() * 1.8 : 1.4 + Math.random() * 2
  }
  const col: RGB = ty === T_EYE ? EYE : ty === T_GLYPH ? GLYPH : BODY
  s.r[i] = col[0]
  s.g[i] = col[1]
  s.b[i] = col[2]
}

/** Production proportions: simulate in a 340x420 space (R = 0.195 of the short side) and scale only the drawing. */
export function createScene(W: number, H: number, quality = 1): Scene {
  const R = Math.min(W, H) * 0.195
  const d = quality
  const nBody = Math.round(900 * d)
  const nEye = Math.round(220 * d)
  const nGlyph = Math.round(90 * d)
  const nRain = Math.round(140 * d)
  const N = nBody + nEye + nGlyph + nRain
  const f = (n: number) => new Float32Array(n)
  const s: Scene = {
    W, H, CX: W / 2, CY: H / 2, R, N, nBody, nEye, nGlyph,
    px: f(N), py: f(N), vx: f(N), vy: f(N), hx: f(N), hy: f(N), phase: f(N), speed: f(N), alpha: f(N), size: f(N),
    density: f(N), sAngle: f(N), sRadius: f(N), eox: f(N), eoy: f(N),
    state: new Uint8Array(N), type: new Uint8Array(N), chars: new Array<string | null>(N).fill(null),
    r: f(N), g: f(N), b: f(N),
    t: 0, settledFrac: 0,
    look: { x: 0, y: 0, tx: 0, ty: 0, timer: 1.5 },
    blink: { state: 0, scale: 1, nextAt: 3, pause: 0 },
    eyePulse: 1, cooldown: 0, nextFlushAt: 6, flushFrames: 0,
  }
  const iEye = nBody
  const iGlyph = iEye + nEye
  const iRain = iGlyph + nGlyph
  const le = leftEye(s)
  const re = rightEye(s)
  for (let i = 0; i < nBody; i++) {
    const p = sampleBody(s)
    s.hx[i] = p.x
    s.hy[i] = p.y
    s.density[i] = p.density
    s.type[i] = T_BODY
  }
  for (let i = 0; i < nEye; i++) {
    const target = i < nEye / 2 ? le : re
    const a = Math.random() * Math.PI * 2
    const rad = Math.random() * R * 0.11
    const k = iEye + i
    s.eox[k] = Math.cos(a) * rad
    s.eoy[k] = Math.sin(a) * rad * 0.65
    s.hx[k] = target.x + s.eox[k]
    s.hy[k] = target.y + s.eoy[k]
    s.density[k] = 1
    s.type[k] = T_EYE
  }
  for (let i = 0; i < nGlyph; i++) {
    const p = sampleBody(s)
    const k = iGlyph + i
    s.hx[k] = p.x
    s.hy[k] = p.y
    s.density[k] = p.density * 0.9
    s.type[k] = T_GLYPH
  }
  for (let i = 0; i < nRain; i++) {
    const k = iRain + i
    s.hx[k] = s.CX + (Math.random() * 2 - 1) * R * 0.55
    s.hy[k] = s.CY + (Math.random() * 2 - 1) * R * 0.5
    s.density[k] = 0.75
    s.type[k] = T_RAIN
  }
  for (let i = 0; i < N; i++) initRain(s, i, true)
  return s
}

/** Scatter the settled figure; it re-condenses out of the rain. */
export function scatter(s: Scene) {
  if (s.cooldown > 0) return
  s.cooldown = 180
  for (let i = 0; i < s.N; i++) {
    if (s.state[i] !== S_SETTLED) continue
    const a = Math.random() * Math.PI * 2
    const force = 4 + Math.random() * 8
    s.px[i] = s.CX + (Math.random() * 2 - 1) * s.R * 0.75
    s.py[i] = s.CY + (Math.random() * 2 - 1) * s.R * 0.75
    s.vx[i] = Math.cos(a) * force
    s.vy[i] = Math.sin(a) * force
    s.state[i] = S_SCATTER
    s.alpha[i] = 0.4 + Math.random() * 0.5
  }
}

function updateEyes(s: Scene, dt: number, input: Input) {
  const { blink, look, R, CX, CY } = s
  if (blink.state === 0) {
    if (s.t >= blink.nextAt) {
      blink.state = 1
      blink.pause = 0.05
    }
  } else if (blink.state === 1) {
    blink.scale -= dt * 10
    if (blink.scale <= 0) {
      blink.scale = 0
      blink.state = 2
    }
  } else if (blink.state === 2) {
    blink.pause -= dt
    if (blink.pause <= 0) blink.state = 3
  } else {
    blink.scale += dt * 12
    if (blink.scale >= 1) {
      blink.scale = 1
      blink.state = 0
      blink.nextAt = s.t + rnd(BLINK_MIN, BLINK_MAX)
    }
  }

  if (input.x !== null && input.y !== null) {
    const dx = input.x - CX
    const dy = input.y - CY
    const dist = Math.hypot(dx, dy) || 1
    const maxLook = R * LOOK_RANGE
    const force = Math.min(dist, R * 1.8) / (R * 1.8)
    look.tx = (dx / dist) * maxLook * force
    look.ty = (dy / dist) * maxLook * force * 0.65
  } else {
    look.timer -= dt
    if (look.timer <= 0) {
      look.timer = 1.2 + Math.random() * 3.5
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * R * LOOK_RANGE
      look.tx = Math.cos(a) * r
      look.ty = Math.sin(a) * r * 0.55
    }
    look.tx *= 0.97
    look.ty *= 0.97
  }
  look.x += (look.tx - look.x) * LOOK_SPEED
  look.y += (look.ty - look.y) * LOOK_SPEED

  const open = Math.max(0, Math.min(1.45, blink.scale * EYE_SQUINT))
  const le = leftEye(s)
  const re = rightEye(s)
  const iEye = s.nBody
  for (let i = iEye; i < iEye + s.nEye; i++) {
    const eye = i < iEye + s.nEye / 2 ? le : re
    s.hx[i] = eye.x + s.eox[i] + look.x
    s.hy[i] = eye.y + s.eoy[i] * open + look.y * 0.7
  }
}

/** One fixed 1/60 s simulation step. */
export function step(s: Scene, input: Input) {
  const dt = 1 / 60
  s.t += dt
  if (s.cooldown > 0) s.cooldown -= 1
  s.eyePulse = 0.35 + 0.65 * ((Math.sin(s.t * EYE_SPEED * 2.6) + 1) / 2)
  updateEyes(s, dt, input)

  const { CX, CY, R, W, H, N, px, py, vx, vy, hx, hy, state, type, phase, speed, alpha, density } = s
  const iEye = s.nBody
  let settled = 0
  for (let i = 0; i < N; i++) {
    if (state[i] === S_SETTLED) settled++
    if (type[i] === T_EYE) {
      const pulse = 0.5 + 0.5 * Math.sin(s.t * 2.6 * (i < iEye + s.nEye / 2 ? 1 : -1))
      const k = (0.55 + pulse * 0.65) * (0.4 + 0.6 * s.blink.scale)
      s.r[i] = EYE[0] * k
      s.g[i] = EYE[1] * k
      s.b[i] = EYE[2] * k
    }
    if (type[i] === T_RAIN && state[i] === S_SETTLED) {
      hy[i] -= 0.1
      if (hy[i] < CY - R * 2) hy[i] = CY + R * 0.95
    }

    if (state[i] === S_FALL) {
      vy[i] += 0.018
      vx[i] += Math.sin(phase[i]) * 0.0035
      phase[i] += speed[i]
      px[i] += vx[i]
      py[i] += vy[i]
      const dx = CX - px[i]
      const dy = CY - R * 0.05 - py[i]
      const dist = Math.hypot(dx, dy) || 1
      const cap = R * 2.4
      if (dist < cap) {
        const g = 0.014 * (1 - dist / cap)
        vx[i] += (dx / dist) * g * 10
        vy[i] += (dy / dist) * g * 8
      }
      if (dist < cap * 0.5 && Math.random() < 0.018) {
        state[i] = S_SPIRAL
        s.sAngle[i] = Math.atan2(py[i] - (CY - R * 0.05), px[i] - CX)
        s.sRadius[i] = dist
      }
      if (py[i] > H + 30 || px[i] < -30 || px[i] > W + 30) initRain(s, i)
      continue
    }
    if (state[i] === S_SPIRAL) {
      s.sRadius[i] *= 0.971
      s.sAngle[i] += 0.054 + 0.038 * (R / Math.max(s.sRadius[i], 4))
      const progress = Math.max(0, 1 - s.sRadius[i] / (R * 0.85))
      const sx = CX + Math.cos(s.sAngle[i]) * s.sRadius[i]
      const sy = CY + Math.sin(s.sAngle[i]) * s.sRadius[i]
      px[i] += (sx * (1 - progress) + hx[i] * progress - px[i]) * 0.12
      py[i] += (sy * (1 - progress) + hy[i] * progress - py[i]) * 0.12
      if (Math.hypot(hx[i] - px[i], hy[i] - py[i]) < 3.5 || s.sRadius[i] < 5) {
        state[i] = S_SETTLED
        vx[i] = 0
        vy[i] = 0
      }
      continue
    }
    if (state[i] === S_SETTLED) {
      phase[i] += speed[i]
      const soft = type[i] === T_BODY || type[i] === T_GLYPH
      const follow = soft ? 0.03 + density[i] * 0.028 : 0.062
      const damping = soft ? 0.73 + density[i] * 0.09 : 0.8
      vx[i] += (hx[i] - px[i]) * follow
      vy[i] += (hy[i] - py[i]) * follow
      vx[i] *= damping
      vy[i] *= damping
      px[i] += vx[i]
      py[i] += vy[i]
      const wobble = (type[i] === T_GLYPH ? 1.2 : type[i] === T_EYE ? 0.5 : 1.42) * (soft ? 0.92 + (1 - density[i]) * 0.22 : 1)
      px[i] += Math.sin(phase[i]) * wobble * 0.13
      py[i] += Math.cos(phase[i] * 0.72) * wobble * 0.13
      const settledAlpha = 0.55 + 0.45 * Math.sin(phase[i] * 1.4 + i * 0.01)
      alpha[i] = soft ? settledAlpha * (0.72 + density[i] * 0.28) : settledAlpha
      continue
    }
    vx[i] *= 0.91
    vy[i] *= 0.94
    vy[i] += 0.07
    px[i] += vx[i]
    py[i] += vy[i]
    alpha[i] *= 0.98
    if (Math.hypot(vx[i], vy[i]) < 1 || py[i] > H + 45 || px[i] < -45 || px[i] > W + 45) initRain(s, i)
  }
  s.settledFrac = settled / N
  if (s.t >= s.nextFlushAt) {
    s.flushFrames = 10
    s.nextFlushAt = s.t + 9
  }
}

/** Pointer repel on the settled figure (cheap radial push). */
export function repel(s: Scene, x: number, y: number, radius = 50) {
  for (let i = 0; i < s.N; i++) {
    if (s.state[i] !== S_SETTLED) continue
    const dx = s.px[i] - x
    const dy = s.py[i] - y
    const d = Math.hypot(dx, dy)
    if (d > 0 && d < radius) {
      const f = (1 - d / radius) * 1.4
      s.vx[i] += (dx / d) * f
      s.vy[i] += (dy / d) * f
    }
  }
}

export function draw(ctx: CanvasRenderingContext2D, s: Scene, fade = true) {
  const { W, H, CX, CY, R, N, px, py, type, state, alpha, density, size } = s
  // The canvas is transparent so the figure sits on the page; trails are a destination-out fade.
  ctx.globalCompositeOperation = 'destination-out'
  const flush = s.flushFrames > 0
  if (flush) s.flushFrames -= 1
  ctx.fillStyle = !fade ? 'rgba(0,0,0,1)' : flush ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.18)'
  ctx.fillRect(0, 0, W, H)

  ctx.globalCompositeOperation = 'lighter'
  const glow = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.55)
  glow.addColorStop(0, `rgba(${BODY[0]},${BODY[1]},${BODY[2]},0.09)`)
  glow.addColorStop(0.5, `rgba(${BODY[0]},${BODY[1]},${BODY[2]},0.028)`)
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let lastPx = -1
  for (let i = 0; i < N; i++) {
    const ty = type[i]
    const softness = ty === T_BODY || ty === T_GLYPH ? 0.62 + density[i] * 0.38 : 1
    const stateAlpha = state[i] === S_FALL ? 0.34 : state[i] === S_SPIRAL ? 0.66 : ty === T_RAIN ? 0.48 : 0.82
    const a = Math.min(1, alpha[i] * stateAlpha * softness)
    if (a < 0.012) continue
    ctx.fillStyle = `rgba(${Math.round(s.r[i])},${Math.round(s.g[i])},${Math.round(s.b[i])},${ty === T_EYE ? a * s.eyePulse : a})`
    const ch = s.chars[i]
    if (ch) {
      const fp = Math.max(1, Math.round(size[i] * (ty === T_EYE ? 2.2 : 1)))
      if (fp !== lastPx) {
        lastPx = fp
        ctx.font = `${fp}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      }
      ctx.fillText(ch, px[i], py[i])
    } else {
      ctx.fillRect(px[i] - size[i] * 0.5, py[i] - size[i] * 0.5, size[i], size[i])
    }
  }

  drawEyes({
    ctx,
    R,
    centers: [leftEye(s), rightEye(s)],
    lookX: s.look.x,
    lookY: s.look.y,
    open: Math.max(0, Math.min(1.45, s.blink.scale * EYE_SQUINT)),
    pulse: s.eyePulse,
    color: EYE,
  })
}

/** Simulate off-screen so a static frame (reduced motion) shows the finished figure. */
export function settleInstantly(s: Scene, input: Input, steps = 900) {
  for (let i = 0; i < steps; i++) step(s, input)
}
