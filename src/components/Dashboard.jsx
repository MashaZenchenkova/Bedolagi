import { useState } from 'react'
import './Dashboard.css'
import MapPanel2D from './MapPanel2D'
import MapPanel3D from './MapPanel3D'

const CARD_TYPES = [
  { type: 'button',  label: 'Кнопка',        icon: '⚡' },
  { type: 'toggle',  label: 'Переключатель',  icon: '🔘' },
  { type: 'slider',  label: 'Слайдер',        icon: '🎚️' },
  { type: 'value',   label: 'Значение',       icon: '📊' },
  { type: 'input',   label: 'Поле ввода',     icon: '✏️' },
  { type: 'lidar2d', label: 'Карта 2D',       icon: '🗺️' },
  { type: 'lidar3d', label: 'Карта 3D',       icon: '🌐' },
]

function CardButton({ card }) {
  return (
    <div className="card-inner">
      <div className="card-icon">⚡</div>
      <div className="card-label">{card.label}</div>
      <button className="card-action-btn">Нажать</button>
    </div>
  )
}

function CardToggle({ card }) {
  const [on, setOn] = useState(false)
  return (
    <div className="card-inner">
      <div className="card-icon">🔘</div>
      <div className="card-label">{card.label}</div>
      <div className="card-status">{on ? 'Включено' : 'Выключено'}</div>
      <button
        className={`card-toggle-btn ${on ? 'on' : ''}`}
        onClick={() => setOn(!on)}
      >
        {on ? 'ВКЛ' : 'ВЫКЛ'}
      </button>
    </div>
  )
}

function CardSlider({ card }) {
  const [val, setVal] = useState(50)
  return (
    <div className="card-inner">
      <div className="card-icon">🎚️</div>
      <div className="card-label">{card.label}</div>
      <div className="card-value">{val}</div>
      <input type="range" min={0} max={100} value={val}
        onChange={e => setVal(Number(e.target.value))} />
    </div>
  )
}

function CardValue({ card }) {
  return (
    <div className="card-inner">
      <div className="card-icon">📊</div>
      <div className="card-label">{card.label}</div>
      <div className="card-big-value">
        {card.unit ? `${card.value} ${card.unit}` : card.value ?? '—'}
      </div>
    </div>
  )
}

function CardInput({ card }) {
  const [val, setVal] = useState('')
  return (
    <div className="card-inner">
      <div className="card-icon">✏️</div>
      <div className="card-label">{card.label}</div>
      <input
        className="card-text-input"
        type="number"
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Значение"
      />
      <button className="card-action-btn">Отправить</button>
    </div>
  )
}

function CardLidar2D({ card }) {
  return (
    <div className="card-inner card-lidar">
      <div className="card-label">{card.label}</div>
      <MapPanel2D scale={0.058} />
    </div>
  )
}

function CardLidar3D({ card }) {
  return (
    <div className="card-inner card-lidar">
      <div className="card-label">{card.label}</div>
      <MapPanel3D scale={0.058} />
    </div>
  )
}

function Card({ card, editMode, onRemove }) {
  const components = {
    button:  CardButton,
    toggle:  CardToggle,
    slider:  CardSlider,
    value:   CardValue,
    input:   CardInput,
    lidar2d: CardLidar2D,
    lidar3d: CardLidar3D,
  }
  const Inner = components[card.type] ?? CardValue

  return (
    <div className={`card ${editMode ? 'card-edit' : ''} ${card.type === 'lidar2d' || card.type === 'lidar3d' ? 'card-wide' : ''}`}>
      {editMode && (
        <button className="card-remove" onClick={() => onRemove(card.id)}>✕</button>
      )}
      <Inner card={card} />
    </div>
  )
}

function AddCardModal({ onAdd, onClose }) {
  const [label, setLabel] = useState('')
  const [type, setType] = useState('button')

  function handleAdd() {
    if (!label.trim()) return
    onAdd({ id: Date.now(), type, label })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Добавить карточку</h3>

        <div className="card-type-grid">
          {CARD_TYPES.map(t => (
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

        <input
          className="modal-input"
          placeholder="Название карточки"
          value={label}
          onChange={e => setLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          autoFocus
        />

        <div className="modal-buttons">
          <button className="modal-btn-cancel" onClick={onClose}>Отмена</button>
          <button className="modal-btn-add" onClick={handleAdd}>Добавить</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [cards, setCards]         = useState([])
  const [editMode, setEditMode]   = useState(false)
  const [showModal, setShowModal] = useState(false)

  function addCard(card) {
    setCards(prev => [...prev, card])
  }

  function removeCard(id) {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="dashboard-title">Dashboard</span>
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

      <div className={`cards-grid ${editMode ? 'edit-mode' : ''}`}>
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            editMode={editMode}
            onRemove={removeCard}
          />
        ))}

        {editMode && (
          <div className="card-placeholder" onClick={() => setShowModal(true)}>
            <span>+</span>
          </div>
        )}

        {cards.length === 0 && !editMode && (
          <div className="empty-state">
            <p>Дашборд пуст</p>
            <button className="btn-edit" onClick={() => setEditMode(true)}>
              ✏️ Начать редактирование
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <AddCardModal
          onAdd={addCard}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
