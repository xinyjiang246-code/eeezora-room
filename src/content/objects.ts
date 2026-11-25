import type { ObjectConfig } from './types'

/**
 * 物件 = 模块。每个物件读自己这一份配置。
 * 增加一个 demo：在 content 里加一份，绑定给某个物件即可，不用改动画/布局代码。
 * hotspot 坐标是相对 1536×864 底图的百分比。
 */
export const objects: ObjectConfig[] = [
  {
    id: 'monitor',
    status: 'open',
    category: 'making',
    title: { en: 'The old monitor', zh: '老显示器' },
    hint: { en: 'screen glows', zh: '屏幕亮起' },
    sheetTitle: { en: 'Making', zh: '做过的东西' },
    sheetSide: 'left',
    hotspot: { x: 29, y: 39, w: 17, h: 26 },
    image: '/assets/obj-monitor.webp',
    content: {
      intro: {
        en: 'Things I built to see whether an idea can survive contact with a screen.',
        zh: '我做一些东西，只是想知道一个想法碰到屏幕之后还能不能活。',
      },
      items: [
        {
          id: 'm1',
          title: { en: 'Room of Small Things', zh: '小东西的房间' },
          summary: {
            en: 'An interactive personal site where every object opens a story. Built with React, GSAP and a lot of patience.',
            zh: '一个可交互的个人网站，每件物品都能打开一段故事。用 React、GSAP 和很多耐心做的。',
          },
          year: '2026',
          tags: ['React', 'GSAP', 'Interaction'],
          link: 'https://example.com',
        },
        {
          id: 'm2',
          title: { en: 'A Quiet Interface', zh: '安静的界面' },
          summary: {
            en: 'A prototype about slowing down: no badges, no counters, only what the moment needs.',
            zh: '一个关于慢下来的原型：没有角标，没有计数，只有此刻需要的东西。',
          },
          year: '2025',
          tags: ['Prototype', 'Product'],
        },
        {
          id: 'm3',
          title: { en: 'Notes turned into Tools', zh: '把笔记变成工具' },
          summary: {
            en: 'Small utilities born from repeated notes — the note kept asking to become a button.',
            zh: '从小笔记里长出来的小工具——写着写着，那句话就想变成一个按钮。',
          },
          year: '2025',
          tags: ['Tooling', 'AI'],
        },
      ],
      outro: {
        en: 'More experiments are still warming up on the desk.',
        zh: '还有几个实验，正在桌上慢慢预热。',
      },
    },
  },
  {
    id: 'books',
    status: 'open',
    category: 'noticing',
    title: { en: 'The book stack', zh: '床边书堆' },
    hint: { en: 'pull a page', zh: '抽出一页' },
    sheetTitle: { en: 'Noticing', zh: '看见的东西' },
    sheetSide: 'right',
    hotspot: { x: 60, y: 47, w: 10, h: 16 },
    image: '/assets/obj-books.webp',
    content: {
      intro: {
        en: 'Notes, films, albums, overheard sentences. Things that stayed longer than they should have.',
        zh: '笔记、电影、专辑、偶然听到的一句话。它们停留的时间，比该停留的久了一点。',
      },
      items: [
        {
          id: 'n1',
          title: { en: 'On attention', zh: '关于注意力' },
          summary: {
            en: 'A running note on what deserves to be noticed when everything asks to be seen.',
            zh: '一份持续更新的笔记：当所有东西都要求被看见，什么才值得被注意。',
          },
          year: '2026',
          tags: ['Note'],
        },
        {
          id: 'n2',
          title: { en: 'Films that linger', zh: '不肯散场的电影' },
          summary: {
            en: 'A small list of films I keep returning to, and the one image I take from each.',
            zh: '一份小小的片单，和每部电影留在我这儿的那一帧。',
          },
          year: '2025',
          tags: ['Film', 'List'],
        },
        {
          id: 'n3',
          title: { en: 'Field recordings', zh: '田野录音' },
          summary: {
            en: 'Overheard fragments — a station announcement, a corridor, someone practising scales.',
            zh: '偶然听见的片段——车站广播、走廊、有人在练音阶。',
          },
          year: '2025',
          tags: ['Sound'],
        },
      ],
    },
  },
  {
    id: 'papers',
    status: 'open',
    category: 'research',
    title: { en: 'Sheets on the desk', zh: '桌面稿纸' },
    hint: { en: 'sheets spread out', zh: '稿纸散开' },
    sheetTitle: { en: 'Research', zh: '研究' },
    sheetSide: 'left',
    hotspot: { x: 43, y: 52, w: 13, h: 15 },
    image: '/assets/obj-papers.webp',
    content: {
      intro: {
        en: 'Method, user insight, competitor teardown. The unglamorous pages behind every decision.',
        zh: '方法、用户洞察、竞品拆解。每个决定背后那些不好看的纸。',
      },
      items: [
        {
          id: 'r1',
          title: { en: 'Talking to users without leading them', zh: '不引导用户的访谈' },
          summary: {
            en: 'A short method note on asking better questions and being comfortable with silence.',
            zh: '一份简短的方法笔记：怎么问更好的问题，以及怎么受得了沉默。',
          },
          year: '2026',
          tags: ['Method', 'Interview'],
        },
        {
          id: 'r2',
          title: { en: 'Competitor field notes', zh: '竞品田野笔记' },
          summary: {
            en: 'Not a feature matrix — what a product feels like after twenty minutes of use.',
            zh: '不是功能对照表——是用二十分钟之后，一个产品留给人的感觉。',
          },
          year: '2025',
          tags: ['Teardown'],
        },
      ],
    },
  },
  {
    id: 'window',
    status: 'open',
    category: 'outward',
    title: { en: 'The window', zh: '窗户' },
    hint: { en: 'look outward', zh: '向外看' },
    sheetTitle: { en: 'Looking outward', zh: '向外看' },
    sheetSide: 'right',
    hotspot: { x: 82, y: 8, w: 17, h: 48 },
    content: {
      intro: {
        en: 'AI, going global, and long-horizon questions. Things I watch more than I understand.',
        zh: 'AI、出海、长期的问题。我看着它们的时间，比理解它们的时间长。',
      },
      items: [
        {
          id: 'w1',
          title: { en: 'What changes when the tool changes', zh: '工具变了之后' },
          summary: {
            en: 'Observations on how new tools shift what a small team dares to attempt.',
            zh: '关于新工具如何改变一个小团队「敢做什么」的观察。',
          },
          year: '2026',
          tags: ['AI'],
        },
        {
          id: 'w2',
          title: { en: 'Notes on going global', zh: '出海笔记' },
          summary: {
            en: 'Small framings from reading products made for people I am not.',
            zh: '读那些不是为我做的产品时，记下的一些小小的观察角度。',
          },
          year: '2025',
          tags: ['Global'],
        },
      ],
    },
  },
  {
    id: 'bag',
    status: 'open',
    category: 'about',
    title: { en: 'Canvas bag', zh: '帆布包' },
    hint: { en: 'what I carry', zh: '我带着的东西' },
    sheetTitle: { en: 'About', zh: '关于我' },
    sheetSide: 'left',
    hotspot: { x: 66, y: 50, w: 9, h: 25 },
    image: '/assets/obj-bag.webp',
    content: {
      intro: {
        en: 'A short introduction, packed lightly.',
        zh: '一个简单的自我介绍，装得很轻。',
      },
      items: [
        {
          id: 'a1',
          title: { en: 'Hello', zh: '你好' },
          summary: {
            en: 'I notice small things, make a few of them touchable, and test whether they hold up.',
            zh: '我注意一些小东西，把它们中的几个做成可以触碰的样子，再看看它们结不结实。',
          },
          tags: ['Intro'],
        },
        {
          id: 'a2',
          title: { en: 'What I am doing now', zh: '现在在做什么' },
          summary: {
            en: 'Working at the edge of research, product and AI — mostly on making things feel human.',
            zh: '在研究、产品和 AI 的交界处工作——大多时候在想办法让东西更像人做的。',
          },
          tags: ['Now'],
        },
      ],
      outro: {
        en: 'The rest is still in the room.',
        zh: '剩下的，都还在这间屋子里。',
      },
    },
  },
  {
    id: 'drawer',
    status: 'open',
    category: 'recruiter',
    title: { en: 'Old envelopes', zh: '旧信封' },
    hint: { en: 'open the drawer', zh: '拉开抽屉' },
    sheetTitle: { en: 'For recruiters', zh: '给招聘方' },
    sheetSide: 'right',
    hotspot: { x: 25, y: 70, w: 15, h: 18 },
    image: '/assets/obj-drawer.webp',
    content: {
      intro: {
        en: 'A shorter way in. Four angles on the same work, so you can find the one that matters to you.',
        zh: '一条更短的路。同一段经历的四个角度，你可以只看与你有关的那个。',
      },
      items: [
        {
          id: 'rc1',
          title: { en: 'Four perspectives', zh: '四个视角' },
          summary: {
            en: 'Build / AI Product · Research · Content & Global · Strategy',
            zh: '构建 / AI 产品 · 研究 · 内容与出海 · 策略',
          },
          tags: ['Recruiter'],
        },
      ],
    },
  },
  {
    id: 'lockedDoor',
    status: 'locked',
    category: 'later',
    title: { en: 'The locked door', zh: '锁着的门' },
    hint: { en: 'not yet', zh: '还没到' },
    sheetTitle: { en: 'Still becoming', zh: '还在长' },
    sheetSide: 'center',
    hotspot: { x: 3, y: 12, w: 17, h: 58 },
    content: {
      intro: {
        en: 'This room is still becoming.',
        zh: '这里还在慢慢长出来。',
      },
      items: [],
    },
  },
]

export const objectById = (id: string) => objects.find((o) => o.id === id)
