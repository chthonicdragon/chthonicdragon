export type ParticleKind = 'body' | 'eye' | 'glyph'

export interface UmbraParticle {
  kind: ParticleKind
  x: number
  y: number
  vx: number
  vy: number
  homeX: number
  homeY: number
  size: number
  alpha: number
  phase: number
  delay: number
  glyph: string
}

export const RUNES = Array.from('ᚠᚢᚦᚨᚱᚲᚷᚹᚾᛁᛃᛇᛏᛒᛖᛗᛚᛟ')

export const EYE_OFFSET = 0.2
export const EYE_Y = -0.04

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/** Rejection-sample a point inside a hooded, cloud-like silhouette centred on (0,0), unit radius. */
export function sampleSilhouette(): { x: number; y: number } {
  for (;;) {
    const x = rand(-1, 1)
    const y = rand(-1.05, 1.05)
    const hood = Math.exp(-((x * x) / 0.34 + ((y + 0.18) * (y + 0.18)) / 0.5))
    const ax = Math.abs(x) - 0.42
    const shoulders = 0.7 * Math.exp(-((ax * ax) / 0.09 + ((y - 0.5) * (y - 0.5)) / 0.12))
    const face = Math.exp(-((x * x) / 0.05 + ((y - EYE_Y) * (y - EYE_Y)) / 0.04))
    const keep = Math.max(hood, shoulders) * (1 - 0.82 * face)
    if (Math.random() < keep) return { x, y }
  }
}

export function createParticles(cx: number, cy: number, radius: number, count: number): UmbraParticle[] {
  const particles: UmbraParticle[] = []
  const make = (kind: ParticleKind, hx: number, hy: number, size: number, alpha: number): UmbraParticle => ({
    kind,
    x: hx + rand(-radius * 0.6, radius * 0.6),
    y: cy - radius * rand(1.2, 2.6),
    vx: 0,
    vy: rand(0.6, 1.8),
    homeX: hx,
    homeY: hy,
    size,
    alpha,
    phase: rand(0, Math.PI * 2),
    delay: rand(0, 1.6),
    glyph: RUNES[Math.floor(Math.random() * RUNES.length)],
  })
  for (let i = 0; i < count; i++) {
    const p = sampleSilhouette()
    const isGlyph = i % 9 === 0
    particles.push(
      make(isGlyph ? 'glyph' : 'body', cx + p.x * radius, cy + p.y * radius, isGlyph ? radius * 0.075 : rand(1, 2.2), rand(0.4, 0.95)),
    )
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 26; i++) {
      const a = rand(0, Math.PI * 2)
      const r = Math.sqrt(Math.random()) * radius * 0.07
      particles.push(
        make('eye', cx + side * radius * EYE_OFFSET + Math.cos(a) * r, cy + radius * EYE_Y + Math.sin(a) * r * 0.7, rand(0.9, 1.7), rand(0.7, 1)),
      )
    }
  }
  return particles
}
