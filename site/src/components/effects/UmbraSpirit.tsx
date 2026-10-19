import { useEffect, useRef } from 'react'
import { createScene, draw, repel, scatter, settleInstantly, step, type Input, type Scene } from '@/lib/umbraSpirit'

const FIXED_MS = 1000 / 60

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
    const input: Input = { x: null, y: null }
    let scene: Scene | null = null
    let width = 0
    let frameId: number | null = null
    let visible = false
    let last = 0
    let acc = 0

    function build() {
      width = Math.round(Math.min(460, Math.max(320, wrap!.clientWidth)))
      const height = Math.round(width * 1.2)
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.75)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scene = createScene(width, height, coarse ? 0.7 : 1)
      if (reduced) {
        settleInstantly(scene, input)
        draw(ctx, scene, false)
      }
    }

    function frame(now: number) {
      frameId = null
      if (!visible || document.hidden || !scene) return
      acc += Math.min(100, last ? now - last : FIXED_MS)
      last = now
      let steps = 0
      while (acc >= FIXED_MS && steps < 6) {
        step(scene, input)
        acc -= FIXED_MS
        steps++
      }
      if (input.x !== null && input.y !== null) repel(scene, input.x, input.y)
      draw(ctx, scene)
      frameId = requestAnimationFrame(frame)
    }
    const start = () => {
      if (reduced || frameId !== null) return
      last = 0
      acc = 0
      frameId = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
    }

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: ((e.clientX - r.left) * width) / r.width, y: ((e.clientY - r.top) * width) / r.width }
    }
    // The gaze follows the pointer anywhere on the page; the figure reacts only near it.
    const onMove = (e: PointerEvent) => {
      const { x, y } = local(e)
      input.x = x
      input.y = y
    }
    const onLeaveDoc = () => {
      input.x = null
      input.y = null
    }
    const onDown = (e: PointerEvent) => {
      const { x, y } = local(e)
      if (scene && Math.hypot(x - scene.CX, y - scene.CY) < scene.R * 1.3) scatter(scene)
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
      const w = Math.round(Math.min(460, Math.max(320, wrap.clientWidth)))
      if (w !== width) build()
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
      <canvas ref={canvasRef} className="mx-auto block" />
    </div>
  )
}
