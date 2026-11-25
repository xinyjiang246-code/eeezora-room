import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Atmosphere } from './components/Atmosphere'
import { Room } from './components/Room'
import { ContentSheet } from './components/ContentSheet'
import { RecruiterMode } from './components/RecruiterMode'
import { useLang } from './hooks/useLang'
import { useReducedMotion } from './hooks/useReducedMotion'
import { siteCopy } from './content/site-copy'
import { objects } from './content/objects'
import type { ObjectConfig } from './content/types'

type Stage = 'outside' | 'transition' | 'inside'

export default function App() {
  const { lang, toggle, t } = useLang()
  const reduced = useReducedMotion()
  const [stage, setStage] = useState<Stage>('outside')
  const [opened, setOpened] = useState<ObjectConfig | null>(null)
  const [recruiter, setRecruiter] = useState(false)

  const enter = () => {
    if (reduced) { setStage('inside'); return }
    setStage('transition')
    window.setTimeout(() => setStage('inside'), 1100)
  }

  const back = () => {
    setOpened(null)
    setRecruiter(false)
    if (reduced) { setStage('outside'); return }
    setStage('transition')
    window.setTimeout(() => setStage('outside'), 1100)
  }

  const openObject = (obj: ObjectConfig) => {
    if (obj.id === 'drawer') {
      setRecruiter(true)
      return
    }
    setOpened(obj)
  }

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        {stage === 'outside' && (
          <motion.div key="outside" className="stage-wrap" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Atmosphere
              tagline={siteCopy.tagline}
              enter={siteCopy.enter}
              brand={siteCopy.brand}
              lang={lang}
              onToggleLang={toggle}
              onEnter={enter}
            />
          </motion.div>
        )}

        {stage === 'transition' && (
          <motion.div
            key="transition"
            className="door-transition stage-wrap"
            initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0 }}
          >
            <div className="door-leaf door-leaf-left" />
            <div className="door-leaf door-leaf-right" />
            <div className="door-light" />
            <span className="micro-label door-transition-label">
              {lang === 'en' ? 'going in…' : '进去……'}
            </span>
          </motion.div>
        )}

        {stage === 'inside' && (
          <motion.div key="inside" className="stage-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0.3 : 0.9 }}>
            <Room
              objects={objects}
              lang={lang}
              opened={opened?.id ?? null}
              onOpen={openObject}
              onToggleLang={toggle}
              onBack={back}
              t={t}
            />
            <AnimatePresence>
              {opened && (
                <ContentSheet
                  key={opened.id}
                  object={opened}
                  lang={lang}
                  onClose={() => setOpened(null)}
                  onOpenRecruiter={() => { setOpened(null); setRecruiter(true) }}
                  t={t}
                />
              )}
              {recruiter && (
                <RecruiterMode key="recruiter" lang={lang} onClose={() => setRecruiter(false)} t={t} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
