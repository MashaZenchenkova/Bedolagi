import { useEffect, useRef } from 'react';

const DEMO_POINTS = [];
for (let a = 0; a < 360; a += 1.5) {
  const d = 1800 + Math.sin(a * Math.PI / 70) * 600 + Math.cos(a * Math.PI / 45) * 300 + (Math.random() - 0.5) * 200;
  const rad = a * Math.PI / 180;
  DEMO_POINTS.push({ x: Math.cos(rad) * d, y: Math.sin(rad) * d, distance: d, angle: a });
}

function MapPanel2D({ points = DEMO_POINTS, scale = 0.058 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;

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
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 18);
    ctx.stroke();
  }, [points, scale]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 13, color: '#8d96a8', marginBottom: 8 }}>
        2D карта · точек: {points.length}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          flex: 1,
          width: '100%',
          background: '#050608',
          border: '1px solid #303744',
          borderRadius: 10,
        }}
      />
    </div>
  );
}

export default MapPanel2D;