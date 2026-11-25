import { motion } from 'framer-motion'
import type { Lang, ObjectConfig } from '../content/types'
import { RhinestoneTitle } from './RhinestoneTitle'
import { siteCopy } from '../content/site-copy'

interface Props {
  object: ObjectConfig
  lang: Lang
  onClose: () => void
  onOpenRecruiter: () => void
  t: (bi: { en: string; zh: string }) => string
}

export function ContentSheet({ object, lang, onClose, onOpenRecruiter, t }: Props) {
  const { content, sheetSide } = object
  const isLocked = object.status === 'locked'
  const isRecruiter = object.id === 'drawer'

  return (
    <>
      <motion.div
        className="sheet-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      <motion.aside
        className={`content-sheet side-${sheetSide} sheet-${object.id} ${isLocked ? 'is-locked' : ''}`}
        initial={{ opacity: 0, x: sheetSide === 'left' ? -38 : sheetSide === 'right' ? 38 : 0, y: sheetSide === 'center' ? 22 : 0, rotate: sheetSide === 'center' ? -1.5 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        exit={{ opacity: 0, x: sheetSide === 'left' ? -24 : sheetSide === 'right' ? 24 : 0, y: sheetSide === 'center' ? 14 : 0 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={t(object.sheetTitle)}
      >
        <div className="sheet-paper-grain" />

        {isLocked ? (
          <div className="locked-note">
            <span className="sealed-mark" aria-hidden="true">✕</span>
            <p className="locked-text">{t(siteCopy.locked)}</p>
            <span className="micro-label">— {object.category.toUpperCase()} —</span>
          </div>
        ) : (
          <>
            <header className="sheet-head">
              <div className="sheet-head-left">
                <span className="micro-label">{object.category.toUpperCase()} / {object.status.toUpperCase()}</span>
                <h2>{t(object.sheetTitle)}</h2>
              </div>
              <button className="sheet-close" onClick={onClose} aria-label={t(siteCopy.close)}>✕</button>
            </header>

            <p className="sheet-intro">{t(content.intro)}</p>

            {isRecruiter ? (
              <button className="recruiter-shortcut" onClick={onOpenRecruiter}>
                <span>{t(siteCopy.recruiter.title)}</span>
                <span aria-hidden="true">↗</span>
                <small>{t(siteCopy.recruiter.note)}</small>
              </button>
            ) : (
              <div className="sheet-items">
                {content.items.map((item, i) => (
                  <motion.article
                    key={item.id}
                    className="sheet-item"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.16 + i * 0.07 }}
                  >
                    <div className="sheet-item-top">
                      <span className="sheet-item-num">{String(i + 1).padStart(2, '0')}</span>
                      {item.year && <span className="micro-label">{item.year}</span>}
                    </div>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.summary)}</p>
                    {item.tags && (
                      <div className="sheet-tags">
                        {item.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                      </div>
                    )}
                    {item.link && (
                      <a className="sheet-link" href={item.link} target="_blank" rel="noreferrer">
                        {lang === 'en' ? 'visit' : '去看看'} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </motion.article>
                ))}
              </div>
            )}

            {content.outro && <p className="sheet-outro">{t(content.outro)}</p>}
          </>
        )}

        <div className="sheet-footer micro-label">
          <span>eeeZora · archive</span>
          <RhinestoneTitle text="eeeZora" size="section" className="sheet-mini-mark" />
        </div>
      </motion.aside>
    </>
  )
}
