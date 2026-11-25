import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { Bi, Lang } from '../content/types'
import { RhinestoneTitle } from './RhinestoneTitle'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Props {
  tagline: Bi
  enter: Bi
  brand: string
  lang: Lang
  onToggleLang: () => void
  onEnter: () => void
}

export function Atmosphere({ tagline, enter, brand, lang, onToggleLang, onEnter }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const { innerWidth: w, innerHeight: h } = window
    const dx = (e.clientX / w - 0.5) * 2
    const dy = (e.clientY / h - 0.5) * 2
    ref.current.style.setProperty('--px', String(dx))
    ref.current.style.setProperty('--py', String(dy))
  }

  return (
    <div className={`atmosphere ${reduced ? 'is-reduced' : ''}`} ref={ref} onMouseMove={onMove}>
      <motion.div
        className="atmo-bg"
        initial={{ scale: 1.07, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.3 : 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="atmo-vignette" />
      <div className="atmo-grain" />

      <div className="atmo-ui-top">
        <span className="micro-label">VOL. 01 — {new Date().getFullYear()}</span>
        <button className="lang-toggle" onClick={onToggleLang} aria-label="Switch language">
          {lang === 'en' ? '中' : 'EN'}
        </button>
      </div>

      <div className="atmo-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.3 : 1.3, delay: reduced ? 0 : 0.5 }}
        >
          <RhinestoneTitle text={brand} size="hero" />
        </motion.div>
        <motion.p
          className="atmo-tagline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 1.1 }}
        >
          {tagline[lang]}
        </motion.p>
      </div>

      <motion.button
        className="enter-door"
        onClick={onEnter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduced ? 0 : 1.5 }}
        aria-label={enter[lang]}
      >
        <span className="enter-handle" aria-hidden="true" />
        <span className="enter-text">{enter[lang]}</span>
        <span className="enter-arrow" aria-hidden="true">→</span>
      </motion.button>

      <span className="atmo-hint micro-label">MOVE · CLICK · STAY A WHILE</span>
    </div>
  )
}
