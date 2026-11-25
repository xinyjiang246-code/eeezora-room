import type { SiteCopy } from './types'

export const siteCopy: SiteCopy = {
  brand: 'eeeZora',
  tagline: {
    en: 'small things I notice, make, and test',
    zh: '我收集仍在形成的事，也试着把它们做成可以触碰的东西。',
  },
  enter: { en: 'push the door open', zh: '推门进去' },
  languageToggle: 'EN / 中',
  back: { en: 'step back', zh: '退后一步' },
  close: { en: 'close', zh: '合上' },
  statusLabels: {
    open: { en: 'open', zh: '开放' },
    draft: { en: 'in progress', zh: '正在实验' },
    locked: { en: 'locked', zh: '未开放' },
    private: { en: 'private', zh: '私密' },
  },
  recruiter: {
    label: { en: 'For recruiters', zh: '给招聘方' },
    title: { en: 'A shorter way in', zh: '一条更短的路' },
    note: {
      en: 'Thirty seconds. Four angles. Same person.',
      zh: '三十秒，四个视角，还是同一个人。',
    },
    views: [
      {
        id: 'build',
        label: { en: 'Build / AI Product', zh: '构建 / AI 产品' },
        headline: {
          en: 'I turn fuzzy ideas into something people can click.',
          zh: '我把模糊的想法，做成别人能点开的东西。',
        },
        lines: [
          { en: 'AI product design · 0→1 prototypes', zh: 'AI 产品设计 · 从 0 到 1 的原型' },
          { en: 'User research → product decisions', zh: '用户研究 → 产品决策' },
          { en: 'Front-end implementation with React / TypeScript', zh: 'React / TypeScript 前端实现' },
        ],
        linkLabel: { en: 'see selected work', zh: '看自选作品' },
        link: 'mailto:hello@example.com?subject=Build%20%2F%20AI%20Product',
      },
      {
        id: 'research',
        label: { en: 'Research', zh: '研究' },
        headline: {
          en: 'I listen for what people mean, not only what they say.',
          zh: '我在听人没说出口的那部分。',
        },
        lines: [
          { en: 'User interviews · diary studies · contextual inquiry', zh: '用户访谈 · 日记研究 · 情境访谈' },
          { en: 'Insight synthesis and opportunity framing', zh: '洞察综合与机会定义' },
          { en: 'Competitive and desk research', zh: '竞品与案头研究' },
        ],
        linkLabel: { en: 'read research notes', zh: '读研究笔记' },
        link: 'mailto:hello@example.com?subject=Research',
      },
      {
        id: 'global',
        label: { en: 'Content & Global', zh: '内容与出海' },
        headline: {
          en: 'I write for people who are still deciding.',
          zh: '我写给还在犹豫的人看。',
        },
        lines: [
          { en: 'Bilingual editorial · EN / 中文', zh: '双语编辑 · 英文 / 中文' },
          { en: 'Narrative-led content and visual storytelling', zh: '叙事型内容与视觉表达' },
          { en: 'Overseas audience and community observation', zh: '海外受众与社区观察' },
        ],
        linkLabel: { en: 'see writing', zh: '看文字作品' },
        link: 'mailto:hello@example.com?subject=Content%20%26%20Global',
      },
      {
        id: 'strategy',
        label: { en: 'Strategy', zh: '策略' },
        headline: {
          en: 'I look for the small move that changes the shape.',
          zh: '我在找那个能改变形状的小动作。',
        },
        lines: [
          { en: 'Positioning · audience · narrative', zh: '定位 · 受众 · 叙事' },
          { en: 'From observation to a testable direction', zh: '从观察到可验证的方向' },
          { en: 'Structuring messy information into decisions', zh: '把混乱的信息整理成决策' },
        ],
        linkLabel: { en: 'ask for the full profile', zh: '索取完整简历' },
        link: 'mailto:hello@example.com?subject=Strategy',
      },
    ],
  },
  locked: {
    en: 'This room is still becoming.',
    zh: '这里还在慢慢长出来。',
  },
}
