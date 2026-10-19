import { useEffect, useRef } from 'react'
import { createParticles, EYE_Y, type UmbraParticle } from '@/lib/umbraParticles'

// Mirrors --color-accent in index.css.
const ACCENT_HSL = '267 75% 66%'
const EYE_RGB = '255, 200, 112'

interface Props {
  className?: string
}

/** Decorative: a hooded figure that condenses out of falling rune particles. Pauses offscreen and when the tab is hidden. */
export function UmbraParticles({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvasEl = canvasRef.current
    if (!wrap || !canvasEl) return
    const canvas: HTMLCanvasElement = canvasEl
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const accent = ACCENT_HSL

    let size = 0
    let radius = 0
    let particles: UmbraParticle[] = []
    let t = 0
    let last = 0
    let frameId: number | null = null
    let visible = false
    const pointer = { x: 0, y: 0, active: false }
    const look = { x: 0, y: 0 }

    function build() {
      size = Math.max(160, Math.round(wrap!.clientWidth))
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      radius = size * 0.4
      particles = createParticles(size / 2, size / 2, radius, coarse || size < 280 ? 420 : 760)
      if (reduced) for (const p of particles) { p.x = p.homeX; p.y = p.homeY }
    }

    function step(dt: number) {
      t += dt
      const eyeLook = 0.012 * radius
      look.x += ((pointer.active ? (pointer.x - size / 2) / size : 0) * 2 - look.x) * 0.08
      look.y += ((pointer.active ? (pointer.y - size / 2) / size : 0) * 2 - look.y) * 0.08
      for (const p of particles) {
        if (t < p.delay) continue
        let tx = p.homeX
        let ty = p.homeY
        if (p.kind === 'eye') {
          tx += look.x * eyeLook * 4
          ty += look.y * eyeLook * 3
        } else {
          ty += Math.sin(t * 0.9 + p.phase) * 1.4
          tx += Math.cos(t * 0.7 + p.phase) * 0.9
        }
        const dx = tx - p.x
        const dy = ty - p.y
        p.vx += dx * 0.012
        p.vy += dy * 0.012
        if (pointer.active) {
          const px = p.x - pointer.x
          const py = p.y - pointer.y
          const d2 = px * px + py * py
          const rr = radius * 0.34
          if (d2 < rr * rr && d2 > 1) {
            const f = (1 - Math.sqrt(d2) / rr) * 1.1
            p.vx += (px / Math.sqrt(d2)) * f
            p.vy += (py / Math.sqrt(d2)) * f
          }
        }
        p.vx *= 0.9
        p.vy *= 0.9
        p.x += p.vx * dt * 60
        p.y += p.vy * dt * 60
      }
    }

    function draw() {
      ctx.clearRect(0, 0, size, size)
      const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, radius * 1.3)
      glow.addColorStop(0, `hsl(${accent} / 0.16)`)
      glow.addColorStop(1, `hsl(${accent} / 0)`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)
      ctx.font = `${Math.round(radius * 0.075)}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const p of particles) {
        if (t < p.delay) continue
        const settle = Math.min(1, t / 3)
        const tw = 0.75 + 0.25 * Math.sin(t * 1.6 + p.phase)
        const a = p.alpha * tw * (0.45 + 0.55 * settle)
        if (p.kind === 'eye') {
          ctx.fillStyle = `rgba(${EYE_RGB}, ${a})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.kind === 'glyph') {
          ctx.fillStyle = `hsl(${accent} / ${a})`
          ctx.fillText(p.glyph, p.x, p.y)
        } else {
          ctx.fillStyle = `hsl(${accent} / ${a})`
          ctx.fillRect(p.x, p.y, p.size, p.size)
        }
      }
      const ex = size / 2
      const ey = size / 2 + radius * EYE_Y
      const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, radius * 0.5)
      g.addColorStop(0, `rgba(${EYE_RGB}, ${0.07 * Math.min(1, t / 3)})`)
      g.addColorStop(1, `rgba(${EYE_RGB}, 0)`)
      ctx.fillStyle = g
      ctx.fillRect(ex - radius, ey - radius, radius * 2, radius * 2)
    }

    function frame(now: number) {
      frameId = null
      if (!visible || document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      step(dt)
      draw()
      frameId = requestAnimationFrame(frame)
    }

    function start() {
      if (reduced || frameId !== null) return
      last = performance.now()
      frameId = requestAnimationFrame(frame)
    }
    function stop() {
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
    }

    build()
    if (reduced) {
      t = 4
      draw()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    observer.observe(wrap)

    const onVisibility = () => (document.hidden ? stop() : visible && start())
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = pointer.x > -80 && pointer.y > -80 && pointer.x < rect.width + 80 && pointer.y < rect.height + 80
    }
    const onLeave = () => (pointer.active = false)
    const resize = new ResizeObserver(() => {
      build()
      if (reduced) draw()
    })
    resize.observe(wrap)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
