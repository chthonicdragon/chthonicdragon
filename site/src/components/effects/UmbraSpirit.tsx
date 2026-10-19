import { useEffect, useRef } from 'react'
import { createScene, draw, scatter, settleInstantly, step, type Input, type Scene } from '@/lib/umbraSpirit'

/** Decorative: Umbra condensing out of falling code. Pauses offscreen and in hidden tabs; static frame for reduced motion. */
export function UmbraSpirit({ className }: { className?: string }) {
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
    const input: Input = { x: null, y: null, hovered: false }
    let scene: Scene | null = null
    let size = 0
    let frameId: number | null = null
    let visible = false
    let last = 0

    function build() {
      size = Math.max(200, Math.round(wrap!.clientWidth))
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.6)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scene = createScene(size, reduced ? 0.7 : coarse ? 0.76 : 1)
      if (reduced) {
        settleInstantly(scene, input)
        draw(ctx, scene, false)
      }
    }

    function frame(now: number) {
      frameId = null
      if (!visible || document.hidden || !scene) return
      const dt = Math.min(0.033, last ? (now - last) / 1000 : 1 / 60)
      last = now
      step(scene, dt, input)
      draw(ctx, scene, !coarse)
      frameId = requestAnimationFrame(frame)
    }
    const start = () => {
      if (reduced || frameId !== null) return
      last = 0
      frameId = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
    }

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: ((e.clientX - r.left) * size) / r.width, y: ((e.clientY - r.top) * size) / r.height, r }
    }
    // Gaze follows the pointer anywhere on the page; scatter force only applies while over the canvas.
    const onMove = (e: PointerEvent) => {
      const { x, y } = local(e)
      input.x = x
      input.y = y
      input.hovered = x >= 0 && y >= 0 && x <= size && y <= size
    }
    const onLeaveDoc = () => {
      input.x = null
      input.y = null
      input.hovered = false
    }
    const onDown = (e: PointerEvent) => {
      const { x, y } = local(e)
      if (scene && x >= 0 && y >= 0 && x <= size && y <= size) scatter(scene, x, y)
    }
    const onVisibility = () => (document.hidden ? stop() : visible && start())

    build()
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(wrap)
    const ro = new ResizeObserver(() => {
      if (Math.abs(wrap.clientWidth - size) > 4) build()
    })
    ro.observe(wrap)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerleave', onLeaveDoc)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerleave', onLeaveDoc)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
