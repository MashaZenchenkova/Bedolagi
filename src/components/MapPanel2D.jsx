import { useEffect, useRef, useState } from 'react';
import './MapPanel2D.css';

const DEMO_POINTS = [];
for (let a = 0; a < 360; a += 1.5) {
  const d = 1800 + Math.sin(a * Math.PI / 70) * 600 + Math.cos(a * Math.PI / 45) * 300 + (Math.random() - 0.5) * 200;
  const rad = a * Math.PI / 180;
  DEMO_POINTS.push({ x: Math.cos(rad) * d, y: Math.sin(rad) * d, distance: d, angle: a });
}

const MAX_RADIUS = 2000;
const PADDING = 30;
const MIN_SCALE = 0.02;
const MAX_SCALE = 0.15;

function MapPanel2D({ points = DEMO_POINTS }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(0.058);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Zoom колесиком мыши
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prevScale => {
        const newScale = prevScale * delta;
        return Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
      });
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  // Панорамирование мышью
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      dragRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      dragRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      canvas.style.cursor = 'crosshair';
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2 + pan.x;
    const cy = H / 2 + pan.y;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = '#111820';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    [600, 1200, 2000].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.strokeStyle = '#181f2c';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#2a3040';
      ctx.font = '10px Arial';
      ctx.fillText(r + ' мм', cx + r * scale + 3, cy);
    });

    if (points.length > 0) {
      const maxD = Math.max(...points.map(p => p.distance));
      points.forEach(p => {
        const t = p.distance / (maxD || 1);
        const g = Math.round(120 + t * 135);
        ctx.fillStyle = `rgb(0, ${g}, ${Math.round(g * 0.45)})`;
        ctx.beginPath();
        ctx.arc(cx + p.x * scale, cy - p.y * scale, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 22 * (scale / 0.058), 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 18 * (scale / 0.058));
    ctx.stroke();
  }, [points, size, scale, pan]);

  return (
    <div ref={containerRef} className="map2d-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 13, color: '#8d96a8', marginBottom: 8, padding: '0 4px' }}>
        2D карта · точек: {points.length} · колесико: масштаб, тяните: перемещение
      </div>
      <canvas
        ref={canvasRef}
        style={{
          flex: 1,
          width: '100%',
          background: '#050608',
          border: '1px solid #303744',
          borderRadius: 10,
          cursor: 'crosshair',
          display: 'block',
        }}
      />
    </div>
  );
}

export default MapPanel2D;