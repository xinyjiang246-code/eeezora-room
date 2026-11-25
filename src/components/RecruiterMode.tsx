import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Lang } from '../content/types'
import { siteCopy } from '../content/site-copy'
import { RhinestoneTitle } from './RhinestoneTitle'

interface Props {
  lang: Lang
  onClose: () => void
  t: (bi: { en: string; zh: string }) => string
}

export function RecruiterMode({ lang, onClose, t }: Props) {
  const [active, setActive] = useState(siteCopy.recruiter.views[0].id)
  const view = siteCopy.recruiter.views.find((v) => v.id === active) ?? siteCopy.recruiter.views[0]

  return (
    <motion.div
      className="recruiter-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      role="dialog"
      aria-modal="true"
      aria-label={t(siteCopy.recruiter.title)}
    >
      <div className="recruiter-bg" />
      <div className="recruiter-grain" />

      <button className="recruiter-close" onClick={onClose} aria-label={t(siteCopy.close)}>✕ {t(siteCopy.close)}</button>

      <div className="recruiter-inner">
        <div className="recruiter-masthead">
          <span className="micro-label">{t(siteCopy.recruiter.label)} · {lang === 'en' ? '30 SECONDS' : '三十秒'}</span>
          <div className="recruiter-mark"><RhinestoneTitle text="eeeZora" size="section" className="recruiter-mark" /></div>
          <h1>{t(siteCopy.recruiter.title)}</h1>
          <p>{t(siteCopy.recruiter.note)}</p>
        </div>

        <div className="postcard">
          <div className="postcard-tabs" role="tablist">
            {siteCopy.recruiter.views.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={active === v.id}
                className={`postcard-tab ${active === v.id ? 'is-active' : ''}`}
                onClick={() => setActive(v.id)}
              >
                {t(v.label)}
              </button>
            ))}
          </div>

          <motion.div
            className="postcard-body"
            key={view.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="postcard-stamp micro-label">{lang === 'en' ? 'VIEW' : '视角'} · {String(siteCopy.recruiter.views.indexOf(view) + 1).padStart(2, '0')} / 04</span>
            <h2>{t(view.headline)}</h2>
            <ul>
              {view.lines.map((line, i) => (
                <li key={i}><span className="bullet">{lang === 'en' ? '—' : '·'}</span>{t(line)}</li>
              ))}
            </ul>
            <a className="postcard-link" href={view.link}>
              {t(view.linkLabel)} <span aria-hidden="true">↗</span>
            </a>
          </motion.div>

          <div className="postcard-footer micro-label">
            <span>eeeZora</span>
            <span>{lang === 'en' ? 'ONE PERSON · MANY ANGLES' : '一个人 · 多个角度'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
