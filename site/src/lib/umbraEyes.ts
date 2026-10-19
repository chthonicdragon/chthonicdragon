/** Eye layer of the Umbra spirit, ported from the production UmbraAscendantScene (default, non-humanoid form). */
export type RGB = readonly [number, number, number]

const c = (rgb: RGB, a: number) => `rgba(${Math.round(rgb[0])},${Math.round(rgb[1])},${Math.round(rgb[2])},${a})`

export interface EyeInput {
  ctx: CanvasRenderingContext2D
  R: number
  centers: readonly [{ x: number; y: number }, { x: number; y: number }]
  lookX: number
  lookY: number
  open: number
  pulse: number
  color: RGB
}

export function drawEyes({ ctx, R, centers, lookX, lookY, open, pulse, color }: EyeInput) {
  const visibleOpen = Math.max(0, Math.min(1.45, open))
  const eyeRX = R * 0.135
  const eyeRYBase = R * 0.085
  const op = Math.min(1, visibleOpen)

  for (const eye of centers) {
    const ex = eye.x + lookX
    const ey = eye.y + lookY * 0.7
    const eyeRY = eyeRYBase * Math.max(0.02, visibleOpen)

    ctx.globalCompositeOperation = 'lighter'
    const haloRadius = R * 0.42 + pulse * R * 0.06
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, haloRadius)
    halo.addColorStop(0, c(color, 0.38 * pulse * op))
    halo.addColorStop(0.35, c(color, 0.13 * pulse * op))
    halo.addColorStop(0.7, `rgba(${Math.round(color[0] * 0.5)},${Math.round(color[1] * 0.3)},${Math.round(color[2] * 0.2)},${0.04 * pulse * op})`)
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.save()
    ctx.translate(ex, ey)
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(0, 0, haloRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    const chroma = R * 0.018
    const core = ctx.createRadialGradient(ex, ey, 0, ex, ey, R * 0.12)
    core.addColorStop(0, `rgba(${Math.min(255, color[0] + 80)},${Math.min(255, color[1] + 40)},${Math.min(255, color[2] + 20)},${0.65 * pulse * op})`)
    core.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(ex - chroma, ey, R * 0.14, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(ex + chroma, ey, R * 0.14, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalCompositeOperation = 'source-over'
    if (eyeRY < 0.5) {
      ctx.strokeStyle = 'rgba(15,8,30,0.75)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(ex, ey, eyeRX * 1.04, 1.2, 0, 0, Math.PI * 2)
      ctx.stroke()
      continue
    }

    ctx.save()
    ctx.beginPath()
    ctx.ellipse(ex, ey, eyeRX, eyeRY, 0, 0, Math.PI * 2)
    ctx.clip()
    const iris = ctx.createRadialGradient(ex, ey - eyeRY * 0.2, 0, ex, ey, eyeRX)
    iris.addColorStop(0, `rgba(${Math.min(255, color[0] + 100)},${Math.min(255, color[1] + 60)},${Math.min(255, color[2] + 30)},${0.95 * pulse})`)
    iris.addColorStop(0.35, c(color, 0.9 * pulse))
    iris.addColorStop(0.75, `rgba(${Math.round(color[0] * 0.55)},${Math.round(color[1] * 0.3)},${Math.round(color[2] * 0.25)},${0.8 * pulse})`)
    iris.addColorStop(1, `rgba(${Math.round(color[0] * 0.2)},6,8,${0.6 * pulse})`)
    ctx.fillStyle = iris
    ctx.fillRect(ex - eyeRX, ey - eyeRY, eyeRX * 2, eyeRY * 2)

    ctx.strokeStyle = `rgba(${color[0]},${Math.round(color[1] * 0.55)},20,${0.35 * pulse})`
    ctx.lineWidth = 0.9
    ctx.beginPath()
    ctx.ellipse(ex, ey, eyeRX * 0.7, eyeRY * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Vertical slit pupil.
    const pox = lookX * 0.55
    const poy = lookY * 0.42
    ctx.fillStyle = 'rgba(3,0,8,0.96)'
    ctx.beginPath()
    ctx.ellipse(ex + pox, ey + poy, eyeRX * 0.26, Math.max(0.5, eyeRY * 0.72), 0, 0, Math.PI * 2)
    ctx.fill()

    const cx = ex - pox * 0.5 - eyeRX * 0.28
    const cy = ey - poy * 0.5 - eyeRY * 0.38
    ctx.fillStyle = `rgba(255,245,255,${0.72 * pulse})`
    ctx.beginPath()
    ctx.ellipse(cx, cy, eyeRX * 0.18, eyeRY * 0.14, Math.PI * 0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = `rgba(255,230,255,${0.32 * pulse})`
    ctx.beginPath()
    ctx.ellipse(cx + eyeRX * 0.14, cy + eyeRY * 0.12, eyeRX * 0.09, eyeRY * 0.07, -Math.PI * 0.1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    const lid = 1 - Math.min(1, visibleOpen)
    if (lid > 0.02) {
      const la = 0.82 * lid
      const topY = ey - eyeRY * (1 - lid * 0.85)
      const tg = ctx.createLinearGradient(ex, topY - 4, ex, topY + eyeRY * 0.8 * lid + 3)
      tg.addColorStop(0, `rgba(5,2,16,${la})`)
      tg.addColorStop(0.6, `rgba(8,4,20,${la * 0.6})`)
      tg.addColorStop(1, 'rgba(5,2,16,0)')
      ctx.fillStyle = tg
      ctx.beginPath()
      ctx.ellipse(ex, topY, eyeRX * 1.1, eyeRY * 0.7 + eyeRY * 1.4 * lid, 0, Math.PI, Math.PI * 2)
      ctx.fill()
      const botY = ey + eyeRY * (1 - lid * 0.58)
      const bg = ctx.createLinearGradient(ex, botY, ex, botY - eyeRY * 0.6 * lid)
      bg.addColorStop(0, `rgba(4,2,14,${la * 0.7})`)
      bg.addColorStop(1, 'rgba(4,2,14,0)')
      ctx.fillStyle = bg
      ctx.beginPath()
      ctx.ellipse(ex, botY, eyeRX * 1.05, eyeRY * 0.5 + eyeRY * lid, 0, 0, Math.PI)
      ctx.fill()
    }
  }
  ctx.globalCompositeOperation = 'source-over'
}
