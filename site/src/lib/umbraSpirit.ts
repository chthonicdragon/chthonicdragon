/**
 * Umbra spirit: code rain is pulled into a hooded "spirit" silhouette with two glowing eyes.
 * Condensed port of the EsotericaOS Umbra canvas (idle palette), kept free of React.
 */
export type RGB = [number, number, number]
type Role = 'body' | 'glyph' | 'rain'
type State = 'rain' | 'spiral' | 'settled' | 'scatter'

export interface Particle {
  role: Role
  state: State
  x: number
  y: number
  vx: number
  vy: number
  homeX: number
  homeY: number
  size: number
  alpha: number
  baseAlpha: number
  glyph: string | null
  phase: number
  speed: number
  spiralAngle: number
  spiralRadius: number
  driftMinY: number
  driftMaxY: number
  bias: number
}

export interface Scene {
  size: number
  cx: number
  cy: number
  radius: number
  matrixCell: number
  particles: Particle[]
  eyes: EyeState[]
  gaze: { x: number; y: number; tx: number; ty: number; timer: number }
  time: number
  settleRatio: number
  scatterCooldown: number
}

interface EyeState {
  open: number
  blinking: boolean
  blinkT: number
  blinkDur: number
  nextBlink: number
}

export interface Input {
  x: number | null
  y: number | null
  hovered: boolean
}

const PALETTE = {
  body: [92, 62, 152] as RGB,
  accent: [190, 126, 255] as RGB,
  code: [130, 218, 255] as RGB,
  rain: [92, 188, 228] as RGB,
}
// Eye palette from the production UmbraEyesCanvas (idle look).
const SCLERA: RGB = [12, 6, 22]
const IRIS: RGB = [210, 145, 40]
const GLOW: RGB = [255, 170, 50]
const PUPIL: RGB = [4, 0, 12]
const SPEC: RGB = [255, 235, 195]
const AGITATION = 0.54
const SENSITIVITY = 0.82

const BODY_GLYPHS = Array.from('ᚠᚢᚦᚨᚱᚲᚷᚹᚾᛁᛃᛇᛏᛒᛖᛗᛚᛟ⊗△☽⊕01|/\\-_+#@%')
const RAIN_GLYPHS = Array.from('01ᚠᚢᚦᚨᚱᚲ/|\\-+#%')

const RADIUS_RATIO = 0.25
const EYE_OFFSET = 0.29
const EYE_Y = -0.21
const EYE_HALF_W = 0.24 // almond half-width, in units of radius
const CAPTURE_RATIO = 2.22

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)
const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)] ?? values[0]
const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
]
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

/** Rejection-sample the spirit silhouette: a soft hood-and-cloud mass with shoulder lobes. */
export function sampleSpiritPoint(cx: number, cy: number, radius: number) {
  for (;;) {
    const x = rand(-radius, radius)
    const y = rand(-radius * 1.06, radius * 1.04)
    const cloud = Math.exp(-((x * x + y * y) / (radius * radius * 0.52)))
    const ax = Math.abs(x) - radius * 0.32
    const ay = y + radius * 0.05
    const shoulders = Math.exp(-((ax * ax) / (radius * radius * 0.08) + (ay * ay) / (radius * radius * 0.2)))
    if (Math.random() < Math.max(cloud, shoulders * 0.44)) return { x: cx + x, y: cy + y - radius * 0.04 }
  }
}

function makeParticle(role: Role, homeX: number, homeY: number, size: number, glyph: string | null): Particle {
  return {
    role, state: 'rain', x: 0, y: 0, vx: 0, vy: 0, homeX, homeY,
    size, alpha: rand(0.18, 0.7),
    baseAlpha: rand(0.26, role === 'glyph' ? 0.92 : 0.82),
    glyph, phase: rand(0, Math.PI * 2), speed: rand(0.75, 2.2), spiralAngle: 0, spiralRadius: 0,
    driftMinY: homeY, driftMaxY: homeY, bias: rand(-1, 1),
  }
}

function respawn(s: Scene, p: Particle, immediate = false) {
  const { cx, cy, radius, size, matrixCell } = s
  p.state = 'rain'
  p.alpha = rand(0.18, 0.72)
  p.phase = rand(0, Math.PI * 2)
  p.speed = rand(0.75, 2.18)
  const lane = Math.round(rand(-radius * 1.88, radius * 1.88) / matrixCell) * matrixCell
  const roll = Math.random()
  if (roll < 0.9) {
    p.x = cx + lane + rand(-matrixCell * 0.12, matrixCell * 0.12)
    p.y = immediate ? rand(-size * 0.28, size * 0.12) : rand(-size * 1.04, -radius * 0.36)
    p.vx = rand(-0.05, 0.05)
    p.vy = p.role === 'rain' ? rand(0.26, 0.62) : p.role === 'glyph' ? rand(0.22, 0.52) : rand(0.2, 0.46)
  } else {
    const left = roll < 0.95
    p.x = left ? (immediate ? rand(0, radius * 0.22) : rand(-radius * 0.75, 0)) : immediate ? rand(size - radius * 0.22, size) : rand(size, size + radius * 0.75)
    p.y = rand(cy - radius * 1.5, cy + radius * 0.9)
    p.vx = left ? rand(0.14, 0.34) : rand(-0.34, -0.14)
    p.vy = rand(0.12, 0.3)
  }
  p.spiralAngle = Math.atan2(p.y - (cy - radius * 0.08), p.x - cx)
  p.spiralRadius = Math.hypot(p.x - cx, p.y - (cy - radius * 0.08))
  if (p.role === 'glyph') p.glyph = pick(BODY_GLYPHS)
  else if (p.role === 'rain') p.glyph = pick(RAIN_GLYPHS)
  else p.glyph = Math.random() < 0.06 ? pick(BODY_GLYPHS) : null
}

/** `quality` scales particle counts (1 = desktop, ~0.7 coarse pointer). */
export function createScene(size: number, quality: number): Scene {
  const radius = size * RADIUS_RATIO
  const s: Scene = {
    size, cx: size / 2, cy: size / 2 + size * 0.018, radius, matrixCell: Math.max(11, Math.round(size * 0.076)),
    particles: [], eyes: [0, 1].map((i) => ({ open: 1, blinking: false, blinkT: 0, blinkDur: 0.13, nextBlink: rand(2 + i * 0.8, 4.5 + i) })), gaze: { x: 0, y: 0, tx: 0, ty: 0, timer: rand(0.9, 2.8) },
    time: 0, settleRatio: 0, scatterCooldown: 0,
  }
  const density = quality * clamp(size / 420, 1, 2)
  const n = (base: number, min: number) => Math.max(min, Math.round(base * density))
  const { cx, cy } = s
  const add = (p: Particle) => { respawn(s, p, true); s.particles.push(p) }

  for (let i = 0; i < n(310, 88); i++) {
    const pt = sampleSpiritPoint(cx, cy, radius)
    add(makeParticle('body', pt.x, pt.y, rand(1.35, 2.25), Math.random() < 0.08 ? pick(BODY_GLYPHS) : null))
  }
  for (let i = 0; i < n(34, 10); i++) {
    const pt = sampleSpiritPoint(cx, cy, radius * 0.84)
    const p = makeParticle('glyph', pt.x, pt.y, rand(2.1, 3.25), pick(BODY_GLYPHS))
    p.baseAlpha = rand(0.44, 0.92)
    add(p)
  }
  for (let i = 0; i < n(48, 10); i++) {
    const p = makeParticle('rain', rand(cx - radius * 0.56, cx + radius * 0.56), rand(cy - radius * 0.44, cy + radius * 0.5), rand(1.5, 2.25), pick(RAIN_GLYPHS))
    p.driftMinY = cy - radius * 1.72
    p.driftMaxY = cy + radius * 0.94
    p.baseAlpha = rand(0.26, 0.58)
    add(p)
  }
  return s
}

function eyeCenters(s: Scene) {
  const { cx, cy, radius, gaze } = s
  return [-1, 1].map((side) => ({ x: cx + side * radius * EYE_OFFSET, y: cy + radius * EYE_Y, gx: gaze.x, gy: gaze.y * 0.72 }))
}

/** Scatter the settled particles away from a point; they re-condense out of the rain. */
export function scatter(s: Scene, ox: number, oy: number) {
  if (s.scatterCooldown > 0) return
  s.scatterCooldown = 1.2
  for (const p of s.particles) {
    if (p.state !== 'settled') continue
    p.state = 'scatter'
    const dx = p.x - ox
    const dy = p.y - oy
    const d = Math.hypot(dx, dy) || 1
    const ang = Math.atan2(dy, dx) + rand(-0.35, 0.35)
    const speed = (4.2 + rand(0.8, 4.6)) * (0.42 + 1.14 * (1 - clamp(d / (s.radius * 1.82), 0, 1)) * 0.92)
    p.vx = Math.cos(ang) * speed
    p.vy = Math.sin(ang) * speed
  }
}

export function step(s: Scene, dt: number, input: Input) {
  const { cx, cy, radius, size, gaze } = s
  const fs = dt * 60
  const captureDistance = radius * CAPTURE_RATIO
  const pointerRange = Math.max(52, radius * 0.62)
  s.time += dt
  s.scatterCooldown = Math.max(0, s.scatterCooldown - dt)

  if (input.x !== null && input.y !== null) {
    const dx = input.x - cx
    const dy = input.y - (cy - radius * 0.08)
    const d = Math.hypot(dx, dy) || 1
    const maxOff = radius * 0.064
    const f = Math.min(1, d / (radius * 1.58))
    gaze.tx = clamp((dx / d) * maxOff * f, -maxOff, maxOff)
    gaze.ty = clamp((dy / d) * maxOff * f, -maxOff * 0.8, maxOff * 0.8)
  } else {
    gaze.timer -= dt
    if (gaze.timer <= 0) {
      gaze.timer = rand(1.2, 3.6)
      const a = rand(0, Math.PI * 2)
      gaze.tx = Math.cos(a) * radius * 0.04
      gaze.ty = Math.sin(a) * radius * 0.026
    }
  }
  gaze.x = lerp(gaze.x, gaze.tx, 0.08 * fs)
  gaze.y = lerp(gaze.y, gaze.ty, 0.08 * fs)
  for (const [i, b] of s.eyes.entries()) {
    b.nextBlink -= dt
    if (!b.blinking && b.nextBlink <= 0) {
      b.blinking = true
      b.blinkT = 0
      b.blinkDur = rand(0.1, 0.2)
      b.nextBlink = rand(2.4, 5.8)
      if (i === 0 && Math.random() < 0.4) s.eyes[1].nextBlink = rand(0.02, 0.1)
    }
    if (b.blinking) {
      b.blinkT += dt
      const t = b.blinkT / b.blinkDur
      b.open = t < 0.4 ? lerp(1, 0, t / 0.4) : lerp(0, 1, (t - 0.4) / 0.6)
      if (b.blinkT >= b.blinkDur) { b.blinking = false; b.open = 1 }
    }
  }

  let settled = 0
  for (const p of s.particles) {
    p.phase += dt * p.speed * (p.role === 'rain' ? 1.8 : 1.3 + AGITATION * 0.55)

    if (p.role === 'rain' && p.state === 'settled') {
      p.homeY -= dt * radius * (0.32 + AGITATION * 0.1)
      if (p.homeY < p.driftMinY) {
        p.homeY = p.driftMaxY
        p.homeX = rand(cx - radius * 0.56, cx + radius * 0.56)
      }
    }

    if (p.state === 'rain') {
      p.vy += 0.011 * fs
      p.x += p.vx * fs
      p.y += p.vy * fs
      p.vx += Math.sin(p.phase + p.bias * 1.6) * 0.003 * fs
      p.vx *= Math.pow(0.985, fs)
      const dx = cx - p.x
      const dy = cy - radius * 0.08 - p.y
      const d = Math.hypot(dx, dy) || 1
      if (d < captureDistance) {
        const g = 0.012 * Math.pow(1 - d / captureDistance, 1.35)
        p.vx += (dx / d) * g * 7.5 * fs
        p.vy += (dy / d) * g * 5.8 * fs
      }
      if (d < captureDistance * 0.42 && Math.random() < dt * (0.92 + AGITATION * 0.44)) {
        p.state = 'spiral'
        p.spiralAngle = Math.atan2(p.y - (cy - radius * 0.08), p.x - cx)
        p.spiralRadius = d
      }
      if (p.y > size + 28 || p.x < -28 || p.x > size + 28) respawn(s, p)
      continue
    }

    if (p.state === 'spiral') {
      p.spiralRadius *= Math.max(0.9, 1 - dt * 1.5)
      p.spiralAngle += dt * (3.2 + AGITATION * 0.86 + (radius / Math.max(p.spiralRadius, 8)) * 0.22)
      const progress = clamp(1 - p.spiralRadius / (radius * 0.86), 0, 1)
      const tx = lerp(cx + Math.cos(p.spiralAngle) * p.spiralRadius, p.homeX, progress)
      const ty = lerp(cy + Math.sin(p.spiralAngle) * p.spiralRadius, p.homeY, progress)
      p.x += (tx - p.x) * 0.09 * fs
      p.y += (ty - p.y) * 0.09 * fs
      if (Math.hypot(p.homeX - p.x, p.homeY - p.y) < 3.4 || p.spiralRadius < 5.8) {
        p.state = 'settled'
        p.vx = 0
        p.vy = 0
      }
      continue
    }

    if (p.state === 'settled') {
      settled++
      if (input.hovered && input.x !== null && input.y !== null) {
        const dx = p.x - input.x
        const dy = p.y - input.y
        const d = Math.hypot(dx, dy) || 1
        if (d < pointerRange) {
          const force = (1 - d / pointerRange) * SENSITIVITY
          p.vx += (dx / d) * force * 0.82
          p.vy += (dy / d) * force * 0.74
        }
      }
      p.vx += (p.homeX - p.x) * 0.058 * fs
      p.vy += (p.homeY - p.y) * 0.058 * fs
      p.vx *= Math.pow(0.81, fs)
      p.vy *= Math.pow(0.81, fs)
      p.x += p.vx * fs
      p.y += p.vy * fs
      const wobble = p.role === 'glyph' ? 1.2 : p.role === 'rain' ? 0.9 : 1.4
      p.x += Math.sin(p.phase + p.bias) * wobble * 0.14
      p.y += Math.cos(p.phase * 0.74 + p.bias) * wobble * 0.14
      p.alpha = clamp(p.baseAlpha + Math.sin(p.phase * 1.35 + p.bias) * 0.22, 0.14, 1)
      continue
    }

    p.vx *= Math.pow(0.92, fs)
    p.vy *= Math.pow(0.95, fs)
    p.vy += 0.08 * fs
    p.x += p.vx * fs
    p.y += p.vy * fs
    p.alpha *= Math.pow(0.98, fs)
    if (Math.hypot(p.vx, p.vy) < 1.15 || p.y > size + 42 || p.x < -42 || p.x > size + 42) respawn(s, p)
  }
  s.settleRatio = settled / s.particles.length

}

function mark(ctx: CanvasRenderingContext2D, p: Particle, color: string) {
  ctx.fillStyle = color
  if (p.glyph) {
    const k = p.role === 'glyph' ? 3.2 : p.role === 'rain' ? 2.6 : 2.85
    ctx.font = `${Math.max(7, p.size * k)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(p.glyph, p.x, p.y)
    return
  }
  ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size)
}

function trail(ctx: CanvasRenderingContext2D, s: Scene, p: Particle, color: RGB, alpha: number) {
  if (p.state === 'settled') return
  const sp = Math.hypot(p.vx, p.vy)
  if (sp < 0.001) return
  const tail = p.role === 'rain' ? s.radius * 1.2 : s.radius * 0.6
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
  ctx.lineTo(p.x - (p.vx / sp) * tail, p.y - (p.vy / sp) * tail)
  ctx.strokeStyle = rgba(color, alpha)
  ctx.lineWidth = p.role === 'rain' ? Math.max(0.8, p.size * 0.58) : Math.max(0.7, p.size * 0.44)
  ctx.lineCap = 'round'
  ctx.stroke()
}

function eyePath(ctx: CanvasRenderingContext2D, cx: number, cy: number, ew: number, eh: number) {
  ctx.beginPath()
  ctx.moveTo(cx - ew, cy)
  ctx.bezierCurveTo(cx - ew * 0.35, cy - eh * 1.85, cx + ew * 0.35, cy - eh * 1.85, cx + ew, cy)
  ctx.bezierCurveTo(cx + ew * 0.35, cy + eh * 1.55, cx - ew * 0.35, cy + eh * 1.55, cx - ew, cy)
  ctx.closePath()
}

/** One almond eye, ported from the production UmbraEyesCanvas (sclera, iris, pupil, highlight, lid, lash). */
function drawEye(ctx: CanvasRenderingContext2D, s: Scene, cx: number, cy: number, gx: number, gy: number, open: number, fade: number) {
  if (open < 0.02 || fade < 0.01) return
  const ew = s.radius * EYE_HALF_W
  const eh = ew * 0.59 * open
  const ix = clamp(cx + gx * 3, cx - ew * 0.3, cx + ew * 0.3)
  const iy = clamp(cy + gy * 3, cy - ew * 0.59 * 0.4 * open, cy + ew * 0.59 * 0.4 * open)
  const pulse = (0.7 + 0.3 * ((Math.sin(s.time * 1.5) + 1) / 2)) * fade
  const irisR = ew * 0.6
  const pupilR = irisR * 0.36

  const haloR = ew * 1.1
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR)
  halo.addColorStop(0, rgba(GLOW, 0.28 * pulse * open))
  halo.addColorStop(0.5, rgba(GLOW, 0.1 * pulse * open))
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.ellipse(cx, cy, haloR, haloR * 0.65, 0, 0, Math.PI * 2)
  ctx.fill()

  eyePath(ctx, cx, cy, ew, eh)
  ctx.fillStyle = rgba(SCLERA, 0.92 * fade)
  ctx.fill()

  ctx.save()
  eyePath(ctx, cx, cy, ew, eh)
  ctx.clip()
  const ig = ctx.createRadialGradient(ix, iy, 0, ix, iy, irisR)
  ig.addColorStop(0, rgba(IRIS, pulse))
  ig.addColorStop(0.42, rgba(IRIS, 0.82 * pulse))
  ig.addColorStop(0.78, rgba(IRIS, 0.3 * pulse))
  ig.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = ig
  ctx.beginPath()
  ctx.arc(ix, iy, irisR, 0, Math.PI * 2)
  ctx.fill()
  const pg = ctx.createRadialGradient(ix, iy, 0, ix, iy, pupilR)
  pg.addColorStop(0, rgba(PUPIL, fade))
  pg.addColorStop(0.7, rgba(PUPIL, 0.92 * fade))
  pg.addColorStop(1, rgba(PUPIL, 0))
  ctx.fillStyle = pg
  ctx.beginPath()
  ctx.arc(ix, iy, pupilR, 0, Math.PI * 2)
  ctx.fill()
  const sx = ix - irisR * 0.26
  const sy = iy - irisR * 0.28
  const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, irisR * 0.16)
  sg.addColorStop(0, rgba(SPEC, 0.88 * fade))
  sg.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sg
  ctx.beginPath()
  ctx.arc(sx, sy, irisR * 0.16, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  eyePath(ctx, cx, cy, ew, eh)
  ctx.strokeStyle = rgba(GLOW, 0.35 * open * pulse)
  ctx.lineWidth = Math.max(0.65, ew * 0.03)
  ctx.stroke()
  if (open > 0.5) {
    ctx.beginPath()
    ctx.moveTo(cx - ew * 0.6, cy - eh * 1.2)
    ctx.bezierCurveTo(cx - ew * 0.2, cy - eh * 1.8, cx + ew * 0.2, cy - eh * 1.8, cx + ew * 0.6, cy - eh * 1.2)
    ctx.strokeStyle = rgba(GLOW, 0.18 * open * fade)
    ctx.lineWidth = Math.max(0.9, ew * 0.04)
    ctx.stroke()
  }
}

export function draw(ctx: CanvasRenderingContext2D, s: Scene, shadows: boolean) {
  const { size, cx, cy, radius, particles } = s
  const P = PALETTE
  ctx.clearRect(0, 0, size, size)

  const glow = ctx.createRadialGradient(cx, cy - radius * 0.08, 0, cx, cy, radius * 1.45)
  glow.addColorStop(0, rgba(P.body, 0.1))
  glow.addColorStop(0.5, rgba(P.accent, 0.04 + s.settleRatio * 0.035))
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  for (const p of particles) {
    if (p.role === 'glyph' || p.role === 'rain') continue
    const a = p.state === 'rain' ? 0.5 : p.state === 'spiral' ? 0.78 : p.state === 'scatter' ? 0.58 : 1
    const color =
      p.state === 'rain' || p.state === 'scatter' ? mix(P.rain, P.code, 0.04)
      : p.state === 'spiral' ? mix(P.rain, P.accent, 0.54)
      : mix(P.body, P.accent, 0.18)
    trail(ctx, s, p, color, p.alpha * 0.26)
    mark(ctx, p, rgba(color, p.alpha * a))
  }

  if (shadows) { ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = rgba(P.accent, 0.74) }
  for (const p of particles) {
    if (p.role !== 'glyph') continue
    const color = p.state === 'rain' || p.state === 'scatter' ? mix(P.rain, P.accent, 0.46) : p.state === 'spiral' ? mix(P.accent, P.code, 0.3) : P.accent
    trail(ctx, s, p, color, p.alpha * 0.2)
    mark(ctx, p, rgba(color, p.alpha * (p.state === 'settled' ? 0.92 : 0.72)))
  }
  if (shadows) ctx.restore()

  // The eyes open once the figure has mostly condensed.
  const fade = clamp((s.settleRatio - 0.25) / 0.35, 0, 1)
  eyeCenters(s).forEach((e, i) => drawEye(ctx, s, e.x, e.y, e.gx, e.gy, s.eyes[i].open, fade))

  for (const p of particles) {
    if (p.role !== 'rain') continue
    const color = p.state === 'settled' ? mix(P.rain, P.accent, 0.12) : p.state === 'spiral' ? mix(P.rain, P.code, 0.42) : P.rain
    trail(ctx, s, p, color, p.alpha * 0.32)
    mark(ctx, p, rgba(color, p.alpha * (p.state === 'settled' ? 0.66 : 0.48)))
  }
}

/** Run the sim forward off-screen so a static frame (reduced motion) shows the finished figure. */
export function settleInstantly(s: Scene, input: Input, seconds = 14) {
  for (let t = 0; t < seconds; t += 1 / 30) step(s, 1 / 30, input)
}
