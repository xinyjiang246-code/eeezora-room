import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { Lang, ObjectConfig } from '../content/types'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Props {
  objects: ObjectConfig[]
  lang: Lang
  opened: string | null
  onOpen: (obj: ObjectConfig) => void
  onToggleLang: () => void
  onBack: () => void
  t: (bi: { en: string; zh: string }) => string
}

export function Room({ objects, lang, opened, onOpen, onToggleLang, onBack, t }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const dx = (e.clientX / window.innerWidth - 0.5) * 2
    const dy = (e.clientY / window.innerHeight - 0.5) * 2
    ref.current.style.setProperty('--rx', String(dx))
    ref.current.style.setProperty('--ry', String(dy))
  }

  return (
    <div className={`room ${reduced ? 'is-reduced' : ''}`} ref={ref} onMouseMove={onMove}>
      <div className="room-bg" />
      <div className="room-atmosphere" />
      <div className="room-grain" />

      <div className="room-topbar">
        <button className="back-button" onClick={onBack} aria-label={t({ en: 'step back', zh: '退后一步' })}>
          <span aria-hidden="true">←</span> {t({ en: 'step back', zh: '退后一步' })}
        </button>
        <span className="room-index micro-label">ROOM 01 — BEDROOM / WORKTABLE</span>
        <button className="lang-toggle" onClick={onToggleLang} aria-label="Switch language">
          {lang === 'en' ? '中' : 'EN'}
        </button>
      </div>

      {/* 物件热点：真实可聚焦按钮 */}
      <div className="objects-layer">
        {objects.map((obj, i) => {
          const isOpen = opened === obj.id
          return (
            <motion.button
              key={obj.id}
              className={`object-hotspot object-${obj.id} ${isOpen ? 'is-open' : ''} status-${obj.status}`}
              style={{
                left: `${obj.hotspot.x}%`,
                top: `${obj.hotspot.y}%`,
                width: `${obj.hotspot.w}%`,
                height: `${obj.hotspot.h}%`,
              }}
              onClick={() => onOpen(obj)}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.7, delay: reduced ? 0 : 0.5 + i * 0.09 }}
              whileHover={reduced ? undefined : { y: -2 }}
              aria-label={`${t(obj.title)} — ${t(obj.hint)}`}
            >
              {obj.image && <img src={obj.image} alt="" className="object-img" draggable={false} />}
              <span className="object-hit-area" />
              <span className="object-label">
                <span className="object-label-title">{t(obj.title)}</span>
                <span className="object-label-hint">{t(obj.hint)}</span>
              </span>
              <span className="object-focus-ring" aria-hidden="true" />
            </motion.button>
          )
        })}
      </div>

      <div className="room-bottom-caption micro-label">
        {lang === 'en' ? 'EVERY OBJECT HOLDS A ROOM' : '每件物品里，都藏着一间屋子'}
      </div>
    </div>
  )
}
