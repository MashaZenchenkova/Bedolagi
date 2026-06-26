import { useState, useEffect, useRef } from 'react'
import './Button.css'
import './Button2.css'
import './ScanDisplay.css'
import './ScanCounter.css'

function Button({ onClick }) {
  return (
    <button className="my-button" onClick={onClick}>
      Предыдущий скан
    </button>
  )
}

function Button2({ onClick }) {
  return (
    <button className="my-button2" onClick={onClick}>
      Следующий скан
    </button>
  )
}

function ScanDisplay({ scanNumber }) {
  return (
    <div className="scan-display">
      <span className="scan-label">Скан:</span>
      <span className="scan-number">{scanNumber}</span>
    </div>
  )
}

function ScanCounter() {
  const [scanNumber, setScanNumber] = useState(0)
  const containerRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])
  const baseWidth = 300
  const baseHeight = 200
  const scale = Math.min(size.width / baseWidth, size.height / baseHeight, 1.5)
  const fontSize = Math.max(10, 13 * scale)
  const buttonPadding = `${Math.max(6, 8 * scale)}px ${Math.max(14, 18 * scale)}px`
  const gap = Math.max(8, 12 * scale)
  const borderRadius = Math.max(6, 8 * scale)

  function handlePrevious() {
    setScanNumber(prev => Math.max(0, prev - 1))
  }

  function handleNext() {
    setScanNumber(prev => prev + 1)
  }

  return (
    <div ref={containerRef} className="scan-counter-container">
      <div className="scan-counter-content" style={{ gap: gap }}>
        <div className="scan-counter-buttons" style={{ gap: gap }}>
          <Button onClick={handlePrevious} />
          <Button2 onClick={handleNext} />
        </div>
        <ScanDisplay scanNumber={scanNumber} />
      </div>
    </div>
  )
}

export default ScanCounter