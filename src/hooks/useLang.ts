import { useCallback, useEffect, useState } from 'react'
import type { Bi, Lang } from '../content/types'

const KEY = 'eeezora-lang'

export function useLang() {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored === 'en' || stored === 'zh') return stored
    } catch { /* private mode */ }
    return 'en'
  })

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
  }, [])

  const toggle = useCallback(() => setLang(lang === 'en' ? 'zh' : 'en'), [lang, setLang])
  const t = useCallback((bi: Bi) => bi[lang], [lang])

  return { lang, setLang, toggle, t }
}
