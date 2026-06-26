import React, { useState, useEffect, useRef } from 'react'
import Widget from './Widget'
import './Dashboard.css'

const CARD_TYPES = [
  { type: 'value', label: 'Телеметрия', icon: '📊' },
  { type: 'scanCounter', label: 'Счетчик сканов', icon: '🔢' },
  { type: 'lidar2d', label: 'Карта 2D', icon: '🗺️' },
  { type: 'lidar3d', label: 'Карта 3D', icon: '🌐' },
]

function AddCardModal({ onAdd, onClose, existingCards }) {
  const availableTypes = CARD_TYPES.filter(
    t => !existingCards.some(c => c.type === t.type)
  )

  const [type, setType] = useState(availableTypes[0]?.type || 'value')

  useEffect(() => {
    if (!availableTypes.some(t => t.type === type)) {
      setType(availableTypes[0]?.type || 'value')
    }
  }, [availableTypes, type])

  function handleAdd() {
    const typeInfo = CARD_TYPES.find(t => t.type === type)
    const label = typeInfo ? typeInfo.label : type

    onAdd({
      id: Date.now(),
      type,
      label,
      x: 0,
      y: 0,
      width: 300,
      height: 250,
    })
    onClose()
  }

  if (availableTypes.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h3>Добавить карточку</h3>
          <div className="empty-modal">
            <p>Все типы карточек уже добавлены</p>
          </div>
          <div className="modal-buttons">
            <button className="modal-btn-cancel" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Добавить карточку</h3>
        <div className="card-type-grid">
          {availableTypes.map(t => (
            <div
              key={t.type}
              className={`card-type-option ${type === t.type ? 'selected' : ''}`}
              onClick={() => setType(t.type)}
            >
              <div className="card-type-icon">{t.icon}</div>
              <div className="card-type-label">{t.label}</div>
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button className="modal-btn-cancel" onClick={onClose}>
            Отмена
          </button>
          <button className="modal-btn-add" onClick={handleAdd}>
            Добавить
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [cards, setCards] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [resizingId, setResizingId] = useState(null)
  const dragStart = useRef({ x: 0, y: 0, cardX: 0, cardY: 0 })
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 })

  function addCard(card) {
    const offset = cards.length * 20
    setCards(prev => [...prev, { ...card, x: offset, y: offset }])
  }

  function removeCard(id) {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  function updateCard(id, updates) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  function handleDragStart(e, card) {
    if (!editMode) return
    e.preventDefault()
    setDraggingId(card.id)
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      cardX: card.x,
      cardY: card.y,
    }
  }

  function handleDragMove(e) {
    if (!draggingId) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    updateCard(draggingId, {
      x: Math.max(0, dragStart.current.cardX + dx),
      y: Math.max(0, dragStart.current.cardY + dy),
    })
  }

  function handleDragEnd() {
    setDraggingId(null)
  }

  function handleResizeStart(e, card) {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    setResizingId(card.id)
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: card.width,
      height: card.height,
    }
  }

  function handleResizeMove(e) {
    if (!resizingId) return
    const dx = e.clientX - resizeStart.current.x
    const dy = e.clientY - resizeStart.current.y
    updateCard(resizingId, {
      width: Math.max(250, resizeStart.current.width + dx),
      height: Math.max(200, resizeStart.current.height + dy),
    })
  }

  function handleResizeEnd() {
    setResizingId(null)
  }

  useEffect(() => {
    if (draggingId || resizingId) {
      window.addEventListener('mousemove', draggingId ? handleDragMove : handleResizeMove)
      window.addEventListener('mouseup', draggingId ? handleDragEnd : handleResizeEnd)
      return () => {
        window.removeEventListener('mousemove', draggingId ? handleDragMove : handleResizeMove)
        window.removeEventListener('mouseup', draggingId ? handleDragEnd : handleResizeEnd)
      }
    }
  }, [draggingId, resizingId])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">Dashboard</div>
        <div className="dashboard-controls">
          {editMode && (
            <button className="btn-add" onClick={() => setShowModal(true)}>
              + Добавить
            </button>
          )}
          <button
            className={`btn-edit ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '✓ Готово' : '✏️ Изменить'}
          </button>
        </div>
      </div>

      <div className="cards-container">
        {cards.map(card => (
          <Widget
            key={card.id}
            card={card}
            editMode={editMode}
            onRemove={removeCard}
            onDragStart={(e) => handleDragStart(e, card)}
            onResizeStart={(e) => handleResizeStart(e, card)}
            isDragging={draggingId === card.id}
            isResizing={resizingId === card.id}
          />
        ))}
      </div>

      {cards.length === 0 && !editMode && (
        <div className="empty-state">
          <p>Дашборд пуст</p>
          <p>Включите режим редактирования, чтобы добавить карточки</p>
        </div>
      )}

      {showModal && (
        <AddCardModal
          onAdd={addCard}
          onClose={() => setShowModal(false)}
          existingCards={cards}
        />
      )}
    </div>
  )
}