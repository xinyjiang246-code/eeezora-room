export type Lang = 'en' | 'zh'

export interface Bi {
  en: string
  zh: string
}

export type ObjectStatus = 'open' | 'draft' | 'locked' | 'private'

export type ObjectId =
  | 'monitor'
  | 'books'
  | 'papers'
  | 'window'
  | 'bag'
  | 'drawer'
  | 'lockedDoor'

export interface SheetBlock {
  kind: 'paragraph' | 'quote' | 'list' | 'meta'
  text?: Bi
  items?: Bi[]
}

export interface SheetItem {
  id: string
  title: Bi
  summary: Bi
  year?: string
  tags?: string[]
  link?: string
  /** draft 状态时用于 "正在实验" 的说明 */
  note?: Bi
}

export interface SheetData {
  intro: Bi
  items: SheetItem[]
  outro?: Bi
}

export interface RecruiterView {
  id: string
  label: Bi
  headline: Bi
  lines: Bi[]
  linkLabel: Bi
  link: string
}

export interface ObjectConfig {
  id: ObjectId
  status: ObjectStatus
  category: string
  title: Bi
  hint: Bi
  /** 纸页标题 */
  sheetTitle: Bi
  content: SheetData
  /** 场景中的热点位置（百分比，相对底图） */
  hotspot: { x: number; y: number; w: number; h: number }
  /** 纸页从哪个方向展开 */
  sheetSide: 'left' | 'right' | 'center'
  image?: string
}

export interface SiteCopy {
  brand: string
  tagline: Bi
  enter: Bi
  languageToggle: string
  recruiter: { label: Bi; title: Bi; note: Bi; views: RecruiterView[] }
  locked: Bi
  back: Bi
  close: Bi
  statusLabels: Record<ObjectStatus, Bi>
}
