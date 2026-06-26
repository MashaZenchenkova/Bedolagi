import { useState, useEffect, useRef } from 'react';
import './TelemetryPanel.css';

function TelemetryPanel() {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    battery: 100,
    angle: 0,
    distance: 0
  });
  const [speedHistory, setSpeedHistory] = useState(Array(30).fill(0));

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

  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = Math.random() * 100;
      setTelemetry({
        speed: newSpeed,
        battery: Math.max(0, 100 - Math.random() * 5),
        angle: Math.random() * 360,
        distance: Math.random() * 5000
      });
      setSpeedHistory(prev => [...prev.slice(1), newSpeed]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const baseWidth = 300;
  const baseHeight = 350;
  const scale = Math.min(size.width / baseWidth, size.height / baseHeight, 1.5);
  const fontSize = Math.max(10, 11 * scale);
  const valueSize = Math.max(16, 24 * scale);
  const unitSize = Math.max(8, 12 * scale);
  const padding = Math.max(6, 12 * scale);
  const gap = Math.max(4, 10 * scale);
  const borderRadius = Math.max(4, 8 * scale);
  const chartHeight = Math.max(30, 60 * scale);
  const bottomPadding = Math.max(10, 20 * scale); 

  return (
    <div ref={containerRef} className="telemetry-container">
      <div className="telemetry-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: gap, flex: 1 }}>
        
        <div className="telemetry-card" style={{ padding: padding, borderRadius: borderRadius }}>
          <div className="telemetry-label" style={{ fontSize: fontSize, marginBottom: 4 }}>Скорость</div>
          <div className="telemetry-value" style={{ fontSize: valueSize, color: '#00ff99' }}>
            {telemetry.speed.toFixed(1)}
            <span className="telemetry-unit" style={{ fontSize: unitSize }}>см/с</span>
          </div>
          <div className="telemetry-bar-bg" style={{ marginTop: gap / 2, height: Math.max(3, 4 * scale), borderRadius: Math.max(1, 2 * scale) }}>
            <div 
              className="telemetry-bar-fill" 
              style={{
                width: `${telemetry.speed}%`,
                background: '#00ff99',
                borderRadius: Math.max(1, 2 * scale),
              }}
            />
          </div>
        </div>

        
        <div className="telemetry-card" style={{ padding: padding, borderRadius: borderRadius }}>
          <div className="telemetry-label" style={{ fontSize: fontSize, marginBottom: 4 }}>Заряд</div>
          <div className="telemetry-value" style={{ fontSize: valueSize, color: '#00ccff' }}>
            {telemetry.battery.toFixed(0)}
            <span className="telemetry-unit" style={{ fontSize: unitSize }}>%</span>
          </div>
          <div className="telemetry-bar-bg" style={{ marginTop: gap / 2, height: Math.max(3, 4 * scale), borderRadius: Math.max(1, 2 * scale) }}>
            <div 
              className="telemetry-bar-fill" 
              style={{
                width: `${telemetry.battery}%`,
                background: telemetry.battery > 50 ? '#00ccff' : telemetry.battery > 20 ? '#ffaa00' : '#ff4444',
                borderRadius: Math.max(1, 2 * scale),
              }}
            />
          </div>
        </div>

        
        <div className="telemetry-card" style={{ padding: padding, borderRadius: borderRadius }}>
          <div className="telemetry-label" style={{ fontSize: fontSize, marginBottom: 4 }}>Угол</div>
          <div className="telemetry-value" style={{ fontSize: valueSize, color: '#ffcc00' }}>
            {telemetry.angle.toFixed(0)}
            <span className="telemetry-unit" style={{ fontSize: unitSize }}>°</span>
          </div>
        </div>

        
        <div className="telemetry-card" style={{ padding: padding, borderRadius: borderRadius }}>
          <div className="telemetry-label" style={{ fontSize: fontSize, marginBottom: 4 }}>Расстояние</div>
          <div className="telemetry-value" style={{ fontSize: valueSize, color: '#ff66aa' }}>
            {(telemetry.distance / 100).toFixed(1)}
            <span className="telemetry-unit" style={{ fontSize: unitSize }}>м</span>
          </div>
        </div>
      </div>

      
      <div className="telemetry-chart" style={{ marginTop: gap, padding: padding, borderRadius: borderRadius, marginBottom: bottomPadding }}>
        <div className="telemetry-label" style={{ fontSize: fontSize, marginBottom: gap / 2 }}>График скорости</div>
        <div className="telemetry-chart-bars" style={{ height: chartHeight, gap: Math.max(1, 2 * scale) }}>
          {speedHistory.map((speed, i) => (
            <div
              key={i}
              className="telemetry-chart-bar"
              style={{
                height: `${speed}%`,
                opacity: 0.4 + (i / speedHistory.length) * 0.6,
                borderRadius: `${Math.max(1, 2 * scale)}px ${Math.max(1, 2 * scale)}px 0 0`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TelemetryPanel;