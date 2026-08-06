import { useEffect, useRef } from 'react'
import { createNodes, stepNodes, rescaleNodes, LINK_DISTANCE } from '@/lib/knowledgeGraph'

const FALLBACK_ACCENT_HSL = '267 75% 66%'

export function KnowledgeGraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas: HTMLCanvasElement = canvasEl
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const accentHsl =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim()
        .replace(/^hsl\(/, '')
        .replace(/\)$/, '') || FALLBACK_ACCENT_HSL

    let width = window.innerWidth
    let height = window.innerHeight
    const nodes = createNodes(width, height)
    let frameId: number | null = null

    function resizeCanvas() {
      const prevW = width
      const prevH = height
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rescaleNodes(nodes, prevW, prevH, width, height)
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.16
            ctx.strokeStyle = `hsl(${accentHsl} / ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${accentHsl} / 0.3)`
        ctx.fill()
      }
    }

    function tick() {
      stepNodes(nodes, width, height)
      draw()
      frameId = requestAnimationFrame(tick)
    }

    resizeCanvas()

    if (reduceMotionQuery.matches) {
      draw()
    } else {
      frameId = requestAnimationFrame(tick)
    }

    function handleVisibility() {
      if (document.hidden) {
        if (frameId !== null) {
          cancelAnimationFrame(frameId)
          frameId = null
        }
      } else if (!reduceMotionQuery.matches && frameId === null) {
        frameId = requestAnimationFrame(tick)
      }
    }

    function handleResize() {
      resizeCanvas()
      draw()
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />
}
