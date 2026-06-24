import { useEffect, useRef, useState } from 'react';

const DEMO_POINTS_3D = [];
for (let i = 0; i < 200; i++) {
  DEMO_POINTS_3D.push({
    x: (Math.random() - 0.5) * 4000,
    y: (Math.random() - 0.5) * 4000,
    z: Math.random() * 200 - 100
  });
}

function MapPanel3D({ points = DEMO_POINTS_3D }) {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;
    const scale = 0.08;

    ctx.clearRect(0, 0, W, H);

    // проекция 3D -> 2D
    const project = (point) => {
      const x = point.x * Math.cos(rotation.y) - point.z * Math.sin(rotation.y);
      const z = point.x * Math.sin(rotation.y) + point.z * Math.cos(rotation.y);
      const y = point.y * Math.cos(rotation.x) - z * Math.sin(rotation.x);
      return {
        x: cx + x * scale,
        y: cy + y * scale,
        z: z
      };
    };

    // сетка
    ctx.strokeStyle = '#111820';
    ctx.lineWidth = 1;
    for (let i = -2000; i <= 2000; i += 500) {
      const p1 = project({ x: i, y: -2000, z: 0 });
      const p2 = project({ x: i, y: 2000, z: 0 });
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      
      const p3 = project({ x: -2000, y: i, z: 0 });
      const p4 = project({ x: 2000, y: i, z: 0 });
      ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
    }

    // точки
    const projected = points.map(p => ({ ...p, proj: project(p) }));
    projected.sort((a, b) => b.proj.z - a.proj.z);

    projected.forEach(p => {
      const brightness = Math.max(0.2, Math.min(1, (p.proj.z + 1000) / 2000));
      ctx.fillStyle = `rgba(0, ${Math.round(255 * brightness)}, ${Math.round(153 * brightness)}, 0.8)`;
      ctx.beginPath();
      ctx.arc(p.proj.x, p.proj.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // оси
    const origin = project({ x: 0, y: 0, z: 0 });
    const xAxis = project({ x: 1000, y: 0, z: 0 });
    const yAxis = project({ x: 0, y: 1000, z: 0 });
    const zAxis = project({ x: 0, y: 0, z: 1000 });

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff4444';
    ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(xAxis.x, xAxis.y); ctx.stroke();
    ctx.strokeStyle = '#44ff44';
    ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(yAxis.x, yAxis.y); ctx.stroke();
    ctx.strokeStyle = '#4444ff';
    ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(zAxis.x, zAxis.y); ctx.stroke();

    // робот
    const robot = project({ x: 0, y: 0, z: 0 });
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(robot.x, robot.y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(robot.x, robot.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }, [points, rotation]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setRotation(prev => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 13, color: '#8d96a8', marginBottom: 8 }}>
        3D карта · точек: {points.length} · перетащи для вращения
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: 1,
          width: '100%',
          background: '#050608',
          border: '1px solid #303744',
          borderRadius: 10,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      />
    </div>
  );
}

export default MapPanel3D;