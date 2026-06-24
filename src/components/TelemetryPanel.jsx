import { useState, useEffect } from 'react';

function TelemetryPanel() {
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    battery: 100,
    angle: 0,
    distance: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        speed: Math.random() * 100,
        battery: Math.max(0, 100 - Math.random() * 5),
        angle: Math.random() * 360,
        distance: Math.random() * 5000
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 13, color: '#8d96a8', marginBottom: 12 }}>
        📊 Телеметрия
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
        <div style={{ background: '#0a0d12', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#5a6478', marginBottom: 4 }}>Скорость</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#00ff99' }}>
            {telemetry.speed.toFixed(1)}
            <span style={{ fontSize: 12, color: '#5a6478', marginLeft: 4 }}>см/с</span>
          </div>
          <div style={{ marginTop: 6, height: 4, background: '#1a1f2a', borderRadius: 2 }}>
            <div style={{
              width: `${telemetry.speed}%`,
              height: '100%',
              background: '#00ff99',
              borderRadius: 2,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        <div style={{ background: '#0a0d12', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#5a6478', marginBottom: 4 }}>Заряд</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#00ccff' }}>
            {telemetry.battery.toFixed(0)}
            <span style={{ fontSize: 12, color: '#5a6478', marginLeft: 4 }}>%</span>
          </div>
          <div style={{ marginTop: 6, height: 4, background: '#1a1f2a', borderRadius: 2 }}>
            <div style={{
              width: `${telemetry.battery}%`,
              height: '100%',
              background: telemetry.battery > 50 ? '#00ccff' : telemetry.battery > 20 ? '#ffaa00' : '#ff4444',
              borderRadius: 2,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        <div style={{ background: '#0a0d12', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#5a6478', marginBottom: 4 }}>Угол</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#ffcc00' }}>
            {telemetry.angle.toFixed(0)}
            <span style={{ fontSize: 12, color: '#5a6478', marginLeft: 4 }}>°</span>
          </div>
        </div>

        <div style={{ background: '#0a0d12', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#5a6478', marginBottom: 4 }}>Расстояние</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#ff66aa' }}>
            {(telemetry.distance / 100).toFixed(1)}
            <span style={{ fontSize: 12, color: '#5a6478', marginLeft: 4 }}>м</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 10, background: '#0a0d12', borderRadius: 8 }}>
        <div style={{ fontSize: 11, color: '#5a6478', marginBottom: 6 }}>График скорости</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60 }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const h = Math.random() * 100;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: `linear-gradient(to top, #00ff99, #00ccff)`,
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.6 + (i / 60)
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TelemetryPanel;