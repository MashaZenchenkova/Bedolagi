import React from 'react'
import MapPanel2D from './MapPanel2D'
import MapPanel3D from './MapPanel3D'
import TelemetryPanel from './TelemetryPanel'
import ScanCounter from './ScanCounter'
import './Widget.css'

export default function Widget({ 
  card, 
  editMode, 
  onRemove, 
  onDragStart, 
  onResizeStart,
  isDragging,
  isResizing 
}) {
  function renderContent() {
    switch (card.type) {
      case 'value':
        return <TelemetryPanel />
      
      case 'scanCounter':
        return <ScanCounter />
      
      case 'lidar2d':
        return <MapPanel2D />
      
      case 'lidar3d':
        return <MapPanel3D />
      
      default:
        return <div>Неизвестный тип карточки: {card.type}</div>
    }
  }

  return (
    <div 
      className={`widget ${editMode ? 'edit-mode' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        left: card.x,
        top: card.y,
        width: card.width,
        height: card.height,
      }}
    >
      <div 
        className="widget-header"
        onMouseDown={editMode ? onDragStart : undefined}
        style={{ cursor: editMode ? 'move' : 'default' }}
      >
        <div className="widget-title">{card.label}</div>
        {editMode && (
          <button className="widget-remove" onClick={() => onRemove(card.id)}>
            ✕
          </button>
        )}
      </div>
      <div className="widget-body">
        {renderContent()}
      </div>
      {editMode && (
        <div 
          className="widget-resize-handle"
          onMouseDown={onResizeStart}
        />
      )}
    </div>
  )
}