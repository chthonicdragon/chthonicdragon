export interface GraphNode {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

const MIN_NODES = 22
const MAX_NODES = 64
const AREA_PER_NODE = 26000
const MAX_SPEED = 0.06
const MIN_SPEED = 0.015

export function nodeCountForViewport(width: number, height: number): number {
  const raw = Math.round((width * height) / AREA_PER_NODE)
  return Math.min(MAX_NODES, Math.max(MIN_NODES, raw))
}

function randomVelocity() {
  const angle = Math.random() * Math.PI * 2
  const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)
  return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
}

export function createNodes(width: number, height: number): GraphNode[] {
  const count = nodeCountForViewport(width, height)
  return Array.from({ length: count }, () => {
    const { vx, vy } = randomVelocity()
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx,
      vy,
      r: 1 + Math.random() * 1.2,
    }
  })
}

export function stepNodes(nodes: GraphNode[], width: number, height: number): void {
  for (const node of nodes) {
    node.x += node.vx
    node.y += node.vy

    if (node.x < 0 || node.x > width) node.vx *= -1
    if (node.y < 0 || node.y > height) node.vy *= -1

    node.x = Math.min(Math.max(node.x, 0), width)
    node.y = Math.min(Math.max(node.y, 0), height)
  }
}

export function rescaleNodes(nodes: GraphNode[], fromW: number, fromH: number, toW: number, toH: number): void {
  if (fromW === 0 || fromH === 0) return
  const scaleX = toW / fromW
  const scaleY = toH / fromH
  for (const node of nodes) {
    node.x *= scaleX
    node.y *= scaleY
  }
}

export const LINK_DISTANCE = 150
