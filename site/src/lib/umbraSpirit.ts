/**
 * Umbra spirit: code rain is pulled into a hooded "spirit" silhouette with two glowing eyes.
 * Condensed port of the EsotericaOS Umbra canvas (idle palette), kept free of React.
 */
export type RGB = [number, number, number]
type Role = 'body' | 'eye' | 'orbit' | 'glyph' | 'rain'
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
  baseX: number
  baseY: number
  localX: number
  localY: number
  size: number
  alpha: number
  baseAlpha: number
  glyph: string | null
  phase: number
  speed: number
  spiralAngle: number
  spiralRadius: number
  orbitAngle: number
  orbitRadius: number
  driftMinY: number
  driftMaxY: number
  bias: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
}

export interface Scene {
  size: number
  cx: number
  cy: number
  radius: number
  matrixCell: number
  particles: Particle[]
  ripples: Ripple[]
  gaze: { x: number; y: number; tx: number; ty: number; timer: number }
  time: number
  lastPulse: number
  settleRatio: number
  scatterCooldown: number
}

export interface Input {
  x: number | null
  y: number | null
  hovered: boolean
}

const PALETTE = {
  iris: [255, 216, 128] as RGB,
  irisOuter: [236, 68, 40] as RGB,
  body: [92, 62, 152] as RGB,
  accent: [190, 126, 255] as RGB,
  code: [130, 218, 255] as RGB,
  rain: [92, 188, 228] as RGB,
  corona: [122, 84, 212] as RGB,
}
const AGITATION = 0.54
const PULSE_SPEED = 2.08
const SENSITIVITY = 0.82

const BODY_GLYPHS = Array.from('ᚠᚢᚦᚨᚱᚲᚷᚹᚾᛁᛃᛇᛏᛒᛖᛗᛚᛟ⊗△☽⊕01|/\\-_+#@%')
const EYE_GLYPHS = Array.from('⊗◈●✦◆')
const RAIN_GLYPHS = Array.from('01ᚠᚢᚦᚨᚱᚲ/|\\-+#%')

const RADIUS_RATIO = 0.25
const EYE_OFFSET = 0.29
const EYE_Y = -0.21
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
    role, state: 'rain', x: 0, y: 0, vx: 0, vy: 0, homeX, homeY, baseX: homeX, baseY: homeY, localX: 0, localY: 0,
    size, alpha: rand(0.18, 0.7),
    baseAlpha: rand(role === 'eye' ? 0.5 : 0.26, role === 'eye' ? 0.96 : role === 'glyph' ? 0.92 : 0.82),
    glyph, phase: rand(0, Math.PI * 2), speed: rand(0.75, 2.2), spiralAngle: 0, spiralRadius: 0,
    orbitAngle: 0, orbitRadius: 0, driftMinY: homeY, driftMaxY: homeY, bias: rand(-1, 1),
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
  else if (p.role === 'eye') p.glyph = Math.random() < 0.28 ? pick(EYE_GLYPHS) : null
  else if (p.role === 'orbit') p.glyph = Math.random() < 0.24 ? pick(BODY_GLYPHS) : null
  else if (p.role === 'rain') p.glyph = pick(RAIN_GLYPHS)
  else p.glyph = Math.random() < 0.06 ? pick(BODY_GLYPHS) : null
}

/** `quality` scales particle counts (1 = desktop, ~0.7 coarse pointer). */
export function createScene(size: number, quality: number): Scene {
  const radius = size * RADIUS_RATIO
  const s: Scene = {
    size, cx: size / 2, cy: size / 2 + size * 0.018, radius, matrixCell: Math.max(11, Math.round(size * 0.076)),
    particles: [], ripples: [], gaze: { x: 0, y: 0, tx: 0, ty: 0, timer: rand(0.9, 2.8) },
    time: 0, lastPulse: 0, settleRatio: 0, scatterCooldown: 0,
  }
  const n = (base: number, min: number) => Math.max(min, Math.round(base * quality))
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
  const orbitCount = n(52, 12)
  for (let i = 0; i < orbitCount; i++) {
    const a = (i / orbitCount) * Math.PI * 2
    const r = radius * (1.08 + Math.sin(a * 3) * 0.18 + Math.sin(a * 5 + 0.6) * 0.1 + rand(0, 0.18))
    const p = makeParticle('orbit', cx + Math.cos(a) * r * 0.88, cy - radius * 0.04 + Math.sin(a) * r, rand(1.25, 1.9), Math.random() < 0.28 ? pick(BODY_GLYPHS) : null)
    p.orbitAngle = a
    p.orbitRadius = r
    p.baseAlpha = rand(0.24, 0.68)
    add(p)
  }
  const eyeBases = [
    { x: cx - radius * EYE_OFFSET, y: cy + radius * EYE_Y },
    { x: cx + radius * EYE_OFFSET, y: cy + radius * EYE_Y },
  ]
  for (let i = 0; i < n(28, 12); i++) {
    const a = rand(0, Math.PI * 2)
    const er = rand(0, radius * 0.115)
    const lx = Math.cos(a) * er
    const ly = Math.sin(a) * er * 0.66
    for (const base of eyeBases) {
      const p = makeParticle('eye', base.x + lx, base.y + ly, rand(1.5, 2.15), Math.random() < 0.34 ? pick(EYE_GLYPHS) : null)
      p.baseX = base.x
      p.baseY = base.y
      p.localX = lx
      p.localY = ly
      p.baseAlpha = rand(0.54, 0.96)
      add(p)
    }
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
  return [-1, 1].map((side) => ({ x: cx + side * radius * EYE_OFFSET + gaze.x, y: cy + radius * EYE_Y + gaze.y * 0.72 }))
}

function pushRipple(s: Scene, x: number, y: number, strength: number) {
  s.ripples.push({ x, y, radius: Math.max(2, s.radius * 0.03), alpha: 0.48 + strength * 0.26, speed: 82 + strength * 44 })
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
  const eyes = eyeCenters(s)
  eyes.forEach((e) => pushRipple(s, e.x, e.y, 1))
  pushRipple(s, s.cx, s.cy, 0.72)
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
  const eyes = eyeCenters(s)
  if (s.time - s.lastPulse > 3.8 + Math.random() * 2.1) {
    s.lastPulse = s.time
    eyes.forEach((e) => pushRipple(s, e.x, e.y, 0.92))
  }

  let settled = 0
  for (const p of s.particles) {
    p.phase += dt * p.speed * (p.role === 'rain' ? 1.8 : 1.3 + AGITATION * 0.55)

    if (p.role === 'orbit') {
      p.orbitAngle += dt * (0.36 + AGITATION * 0.22) * (p.bias >= 0 ? 1 : -1)
      const r = p.orbitRadius * (1 + Math.sin(p.orbitAngle * 3 + p.bias) * 0.03)
      p.homeX = cx + Math.cos(p.orbitAngle) * r * 0.88
      p.homeY = cy - radius * 0.04 + Math.sin(p.orbitAngle) * r
    } else if (p.role === 'eye') {
      const anchor = p.baseX < cx ? eyes[0] : eyes[1]
      p.homeX = anchor.x + p.localX
      p.homeY = anchor.y + p.localY
    } else if (p.role === 'rain' && p.state === 'settled') {
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
      const wobble = p.role === 'orbit' ? 2.8 : p.role === 'glyph' ? 1.2 : p.role === 'eye' ? 0.48 : p.role === 'rain' ? 0.9 : 1.4
      p.x += Math.sin(p.phase + p.bias) * wobble * 0.14
      p.y += Math.cos(p.phase * 0.74 + p.bias) * wobble * 0.14
      p.alpha = clamp(p.baseAlpha + Math.sin(p.phase * 1.35 + p.bias) * 0.22, p.role === 'eye' ? 0.38 : 0.14, 1)
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

  for (let i = s.ripples.length - 1; i >= 0; i--) {
    const r = s.ripples[i]
    r.radius += r.speed * dt
    r.alpha *= Math.max(0.34, 1 - dt * 2.6)
    if (r.alpha < 0.02) s.ripples.splice(i, 1)
  }
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

export function draw(ctx: CanvasRenderingContext2D, s: Scene, shadows: boolean) {
  const { size, cx, cy, radius, particles } = s
  const P = PALETTE
  ctx.clearRect(0, 0, size, size)

  const glow = ctx.createRadialGradient(cx, cy - radius * 0.08, 0, cx, cy, radius * 1.7)
  glow.addColorStop(0, rgba(P.body, 0.16))
  glow.addColorStop(0.5, rgba(P.accent, 0.08 + s.settleRatio * 0.05))
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  for (const r of s.ripples) {
    ctx.beginPath()
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
    ctx.strokeStyle = rgba(P.irisOuter, r.alpha * 0.72)
    ctx.lineWidth = 1.2
    ctx.stroke()
  }

  for (const p of particles) {
    if (p.role === 'eye' || p.role === 'glyph' || p.role === 'rain') continue
    const a = p.state === 'rain' ? 0.5 : p.state === 'spiral' ? 0.78 : p.state === 'scatter' ? 0.58 : 1
    const color =
      p.state === 'rain' || p.state === 'scatter' ? mix(P.rain, P.code, p.role === 'orbit' ? 0.18 : 0.04)
      : p.state === 'spiral' ? mix(P.rain, P.accent, 0.54)
      : p.role === 'orbit' ? mix(P.body, P.accent, 0.42) : mix(P.body, P.accent, 0.18)
    trail(ctx, s, p, color, p.alpha * 0.26)
    mark(ctx, p, rgba(color, p.alpha * a))
  }

  if (shadows) { ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = rgba(P.accent, 0.74) }
  for (const p of particles) {
    if (p.role !== 'glyph') continue
    const color = p.state === 'rain' || p.state === 'scatter' ? mix(P.rain, P.accent, 0.46) : p.state === 'spiral' ? mix(P.accent, P.irisOuter, 0.18) : P.accent
    trail(ctx, s, p, color, p.alpha * 0.2)
    mark(ctx, p, rgba(color, p.alpha * (p.state === 'settled' ? 0.92 : 0.72)))
  }
  if (shadows) ctx.restore()

  const pulse = 0.42 + 0.58 * ((Math.sin(s.time * PULSE_SPEED) + 1) / 2)
  for (const e of eyeCenters(s)) {
    const halo = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, radius * 0.38)
    halo.addColorStop(0, rgba(P.iris, 0.52 * pulse))
    halo.addColorStop(0.26, rgba(P.irisOuter, 0.24 * pulse))
    halo.addColorStop(0.65, rgba(P.irisOuter, 0.08 * pulse))
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(e.x, e.y, radius * 0.42, 0, Math.PI * 2)
    ctx.fill()
    const core = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, radius * 0.11)
    core.addColorStop(0, rgba(P.iris, 0.9 * pulse))
    core.addColorStop(0.45, rgba(P.irisOuter, 0.6 * pulse))
    core.addColorStop(1, 'rgba(140,0,0,0)')
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(e.x, e.y, radius * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }

  if (shadows) { ctx.save(); ctx.shadowBlur = 10; ctx.shadowColor = rgba(P.irisOuter, 0.82) }
  for (const p of particles) {
    if (p.role !== 'eye') continue
    const color = p.state === 'rain' || p.state === 'scatter' ? mix(P.irisOuter, P.rain, 0.12) : mix(P.irisOuter, P.iris, p.state === 'spiral' ? 0.28 : 0.18)
    trail(ctx, s, p, color, p.alpha * 0.28)
    mark(ctx, p, rgba(color, p.alpha * (p.state === 'settled' ? pulse : 0.58)))
  }
  if (shadows) ctx.restore()

  for (const [r, a, w] of [[1.56, 0.05, 1], [1.72, 0.03, 0.8]] as const) {
    ctx.beginPath()
    ctx.arc(cx, cy - radius * 0.04, radius * r, 0, Math.PI * 2)
    ctx.strokeStyle = rgba(P.corona, a + 0.02 * Math.sin(s.time * 0.7))
    ctx.lineWidth = w
    ctx.stroke()
  }

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
