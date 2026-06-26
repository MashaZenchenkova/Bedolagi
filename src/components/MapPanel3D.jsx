import { useEffect, useRef, useState } from 'react'
import './MapPanel3D.css'

const DEMO_POINTS = []
for (let a = 0; a < 360; a += 1.5) {
  const d = 1800 + Math.sin(a * Math.PI / 70) * 600 + Math.cos(a * Math.PI / 45) * 300 + (Math.random() - 0.5) * 200
  const rad = a * Math.PI / 180
  DEMO_POINTS.push({ x: Math.cos(rad) * d, y: Math.sin(rad) * d, distance: d })
}

const MAX_RADIUS = 2400
const PADDING = 30
const MIN_SCALE = 0.02
const MAX_SCALE = 0.15

function MapPanel3D({ points = DEMO_POINTS }) {
  const canvasRef = useRef(null)
  const rotRef = useRef({ yaw: 0.6, pitch: 0.5 })
  const dragRef = useRef(null)
  const panDragRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(0.058)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setScale(prevScale => {
        const newScale = prevScale * delta
        return Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
      })
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [])

  function project(x, y, z) {
    const { yaw, pitch } = rotRef.current
    const x1 = x * Math.cos(yaw) - z * Math.sin(yaw)
    const z1 = x * Math.sin(yaw) + z * Math.cos(yaw)
    const y1 = y * Math.cos(pitch) - z1 * Math.sin(pitch)
    const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch)
    const cam = 1200
    const p = cam / (cam - z2)
    return { x: x1 * p, y: y1 * p, depth: z2 }
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    const ctx = canvas.getContext('2d')
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H
    const cx = W / 2 + pan.x
    const cy = H / 2 + pan.y

    ctx.clearRect(0, 0, W, H)

    ctx.strokeStyle = '#111820'
    ctx.lineWidth = 1
    for (let g = -800; g <= 800; g += 60) {
      const p1 = project(g, -800, 0), p2 = project(g, 800, 0)
      ctx.beginPath(); ctx.moveTo(cx + p1.x, cy - p1.y); ctx.lineTo(cx + p2.x, cy - p2.y); ctx.stroke()
      const p3 = project(-800, g, 0), p4 = project(800, g, 0)
      ctx.beginPath(); ctx.moveTo(cx + p3.x, cy - p3.y); ctx.lineTo(cx + p4.x, cy - p4.y); ctx.stroke()
    }

    ;[
      { to: project(250, 0, 0),  color: '#ff5566' },
      { to: project(0, 250, 0),  color: '#55ff88' },
      { to: project(0, 0, 250),  color: '#5599ff' },
    ].forEach(a => {
      ctx.strokeStyle = a.color; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + a.to.x, cy - a.to.y); ctx.stroke()
    })

    if (points.length > 0) {
      const projected = points.map(p => {
        const pr = project(p.x * scale, p.y * scale, 0)
        return { sx: cx + pr.x, sy: cy - pr.y, depth: pr.depth, dist: p.distance }
      })
      projected.sort((a, b) => a.depth - b.depth)
      const maxD = Math.max(...points.map(p => p.distance))
      projected.forEach(p => {
        const t = p.dist / (maxD || 1)
        const g = Math.round(120 + t * 135)
        ctx.fillStyle = `rgb(0, ${g}, ${Math.round(g * 0.45)})`
        ctx.beginPath(); ctx.arc(p.sx, p.sy, 2, 0, Math.PI * 2); ctx.fill()
      })
    }

    const segs = 28
    ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 3
    ctx.beginPath()
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2
      const pr = project(Math.cos(a) * 22, Math.sin(a) * 22, 0)
      i === 0 ? ctx.moveTo(cx + pr.x, cy - pr.y) : ctx.lineTo(cx + pr.x, cy - pr.y)
    }
    ctx.stroke()
    const c0 = project(0, 0, 0)
    ctx.fillStyle = '#ffcc00'
    ctx.beginPath(); ctx.arc(cx + c0.x, cy - c0.y, 4, 0, Math.PI * 2); ctx.fill()
    const mast = project(0, 0, 80)
    ctx.beginPath(); ctx.moveTo(cx + c0.x, cy - c0.y); ctx.lineTo(cx + mast.x, cy - mast.y); ctx.stroke()
  }

  useEffect(() => {
    draw()
  }, [points, scale, size, pan])
  function onMouseDown(e) {
    if (e.button === 0) {
      dragRef.current = { x: e.clientX, y: e.clientY }
    } else if (e.button === 2) {
      panDragRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  function onMouseMove(e) {
    if (dragRef.current) {
      rotRef.current.yaw   += (e.clientX - dragRef.current.x) * 0.01
      rotRef.current.pitch -= (e.clientY - dragRef.current.y) * 0.01
      rotRef.current.pitch = Math.max(-1.4, Math.min(1.4, rotRef.current.pitch))
      dragRef.current = { x: e.clientX, y: e.clientY }
      draw()
    }
    if (panDragRef.current) {
      const dx = e.clientX - panDragRef.current.x
      const dy = e.clientY - panDragRef.current.y
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
      panDragRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  function onMouseUp(e) {
    if (e.button === 0) dragRef.current = null
    if (e.button === 2) panDragRef.current = null
  }

  function onContextMenu(e) {
    e.preventDefault()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 13, color: '#8d96a8', marginBottom: 8 }}>
        3D карта · точек: {points.length} · ЛКМ: вращение, ПКМ: перемещение, колесико: масштаб
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onContextMenu={onContextMenu}
        style={{
          flex: 1, width: '100%',
          background: '#050608',
          border: '1px solid #303744',
          borderRadius: 10,
          cursor: 'grab',
        }}
      />
    </div>
  )
}

export default MapPanel3D