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

  const scale = Math.min(size.width / 300, size.height / 200, 1.5)
  const gap = Math.max(8, 12 * scale)

  function handlePrevious() {
    setScanNumber(prev => Math.max(0, prev - 1))
  }

  function handleNext() {
    setScanNumber(prev => prev + 1)
  }

  return (
    <div ref={containerRef} className="scan-counter-container">
      <div className="scan-counter-content" style={{ gap: gap }}>
        <div className="scan-counter-buttons">
          <Button onClick={handlePrevious} />
          <Button2 onClick={handleNext} />
        </div>
        <ScanDisplay scanNumber={scanNumber} />
      </div>
    </div>
  )
}

export default ScanCounter