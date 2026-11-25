import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ---------- eeeZora 水钻哥特字标（小尺寸版，算法同主站 RhinestoneTitle） ----------
function buildRhinestoneMark() {
  const fs = 100, width = Math.round(fs * 2.55), height = Math.round(fs * 0.97)
  const baseline = Math.round(fs * 0.82), strokeW = fs * 0.052
  const tile = fs * 0.080 * 1.12, gemR = fs * 0.0155 * 1.45, tracking = -fs * 0.010
  const textLen = Math.round(width * 0.94)
  const gem = (cx: number, cy: number, R: number, rot = 0) => {
    const pt = (rad: number, i: number) => {
      const a = ((22.5 + 45 * i + rot) * Math.PI) / 180
      return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`
    }
    const outer = Array.from({ length: 8 }, (_, i) => pt(R, i))
    const inner = Array.from({ length: 8 }, (_, i) => pt(R * 0.52, i))
    let s = `<circle cx="${cx}" cy="${cy}" r="${(R * 1.06).toFixed(1)}" fill="#5f6b74"/>`
    const light = (225 * Math.PI) / 180
    for (let i = 0; i < 8; i++) {
      const a = ((45 + 45 * i + 22.5 + rot) * Math.PI) / 180
      const lum = 0.5 + 0.5 * Math.cos(a - light)
      const v = Math.round(95 + 160 * lum)
      s += `<polygon points="${outer[i]} ${outer[(i + 1) % 8]} ${inner[(i + 1) % 8]} ${inner[i]}" fill="rgb(${v},${Math.min(255, v + 6)},${Math.min(255, v + 12)})"/>`
    }
    s += `<polygon points="${inner.join(' ')}" fill="#f7fbff"/>`
    const q = R * 0.12, ss = R * 0.5
    s += `<path d="M ${cx},${cy - ss} L ${cx + q},${cy - q} L ${cx + ss},${cy} L ${cx + q},${cy + q} L ${cx},${cy + ss} L ${cx - q},${cy + q} L ${cx - ss},${cy} L ${cx - q},${cy - q} Z" fill="#fff"/>`
    s += `<circle cx="${(cx - R * 0.28).toFixed(1)}" cy="${(cy - R * 0.3).toFixed(1)}" r="${(R * 0.2).toFixed(1)}" fill="#fff"/>`
    return s
  }
  const textTag = (fill: string, stroke = '') =>
    `<text x="50%" y="${baseline}" text-anchor="middle" font-family="UnifrakturMaguntia,'Old English Text MT',serif" font-size="${fs}" letter-spacing="${tracking}" textLength="${textLen}" lengthAdjust="spacingAndGlyphs" fill="${fill}" ${stroke}>eeeZora</text>`
  const svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="eeeZora">
    <defs>
      <pattern id="eb" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">
        ${gem(tile * 0.28, tile * 0.28, gemR, 0)}${gem(tile * 0.78, tile * 0.72, gemR * 0.86, 22)}${gem(tile * 0.46, tile * 0.92, gemR * 0.7, 11)}
      </pattern>
      <mask id="em">${textTag('#fff')}</mask>
    </defs>
    ${textTag('#0a090d', `stroke="#f3f7f8" stroke-width="${strokeW}" stroke-linejoin="round" paint-order="stroke"`)}
    <rect width="${width}" height="${height}" fill="url(#eb)" mask="url(#em)"/>
  </svg>`
  document.getElementById('mark')!.innerHTML = svg
}
buildRhinestoneMark()

const canvas = document.getElementById('scene') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.9
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.background = new THREE.Color('#b9b4ac')
scene.fog = new THREE.Fog('#b9b4ac', 9, 22)

const camera = new THREE.PerspectiveCamera(31, innerWidth / innerHeight, 0.1, 100)
const HOME_POS = new THREE.Vector3(5.6, 4.3, 9.4)
const HOME_LOOK = new THREE.Vector3(0, 0.78, 0)
const INTRO_POS = new THREE.Vector3(7.9, 6.0, 13.2)
camera.position.copy(INTRO_POS)
camera.lookAt(HOME_LOOK)

let wantPos = HOME_POS.clone()
let wantLook = HOME_LOOK.clone()

const controls = new OrbitControls(camera, canvas)
controls.target.copy(HOME_LOOK)
controls.enableDamping = true
controls.dampingFactor = 0.16
controls.minDistance = 3.5
controls.maxDistance = 24
controls.maxPolarAngle = Math.PI / 2 - 0.06
controls.enablePan = false
controls.rotateSpeed = 0.42
controls.zoomSpeed = 0.7
controls.update()
controls.enabled = false
let orbitPos = HOME_POS.clone()
let orbitLook = HOME_LOOK.clone()

scene.add(new THREE.HemisphereLight('#ffffff', '#8f887d', 1.2))
const key = new THREE.DirectionalLight('#fff8ef', 1.75)
key.position.set(4, 8, 5)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.left = -6; key.shadow.camera.right = 6
key.shadow.camera.top = 6; key.shadow.camera.bottom = -6
key.shadow.camera.near = 0.5; key.shadow.camera.far = 22
key.shadow.bias = -0.0006
key.shadow.radius = 3
scene.add(key)
const fill = new THREE.DirectionalLight('#dfe8ff', 0.5)
fill.position.set(-5, 4, -3)
scene.add(fill)

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: '#b6b1a9', roughness: 1 })
)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

const MAT = {
  wood: new THREE.MeshStandardMaterial({ color: '#b17c49', roughness: 0.86 }),
  woodDark: new THREE.MeshStandardMaterial({ color: '#8a5a33', roughness: 0.88 }),
  woodEdge: new THREE.MeshStandardMaterial({ color: '#c3915e', roughness: 0.9 }),
  orange: new THREE.MeshStandardMaterial({ color: '#c9582b', roughness: 0.62 }),
  orangeDark: new THREE.MeshStandardMaterial({ color: '#a94522', roughness: 0.7 }),
  black: new THREE.MeshStandardMaterial({ color: '#262523', roughness: 0.55 }),
  ink: new THREE.MeshStandardMaterial({ color: '#191817', roughness: 0.7 }),
  white: new THREE.MeshStandardMaterial({ color: '#edeae2', roughness: 0.8 }),
  paper: new THREE.MeshStandardMaterial({ color: '#f6f2e8', roughness: 0.95 }),
  metal: new THREE.MeshStandardMaterial({ color: '#b8b7b2', roughness: 0.35, metalness: 0.55 }),
  brass: new THREE.MeshStandardMaterial({ color: '#b99254', roughness: 0.4, metalness: 0.5 }),
  cork: new THREE.MeshStandardMaterial({ color: '#b8905e', roughness: 0.95 }),
  leather: new THREE.MeshStandardMaterial({ color: '#a66534', roughness: 0.85 }),
  green: new THREE.MeshStandardMaterial({ color: '#6d8a5a', roughness: 0.9 }),
  greenDark: new THREE.MeshStandardMaterial({ color: '#4f6b44', roughness: 0.9 }),
  photoA: new THREE.MeshStandardMaterial({ color: '#7d8b8e', roughness: 0.9 }),
  photoB: new THREE.MeshStandardMaterial({ color: '#c5a77c', roughness: 0.9 }),
  photoC: new THREE.MeshStandardMaterial({ color: '#6f7d69', roughness: 0.9 }),
  photoD: new THREE.MeshStandardMaterial({ color: '#9a8d86', roughness: 0.9 }),
}

function box(w: number, h: number, d: number, mat: THREE.Material, r = 0.02) {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(r, Math.min(w, h, d) / 2)) : new THREE.BoxGeometry(w, h, d)
  const m = new THREE.Mesh(g, mat)
  m.castShadow = true; m.receiveShadow = true
  return m
}
function cyl(rt: number, rb: number, h: number, mat: THREE.Material, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat)
  m.castShadow = true; m.receiveShadow = true
  return m
}
function at(m: THREE.Object3D, x: number, y: number, z: number) { m.position.set(x, y, z); return m }

const room = new THREE.Group()
scene.add(room)

// ---------- desk ----------
const DESK_Y = 0.78
const top = box(3.5, 0.09, 1.5, MAT.wood, 0.035)
room.add(at(top, 0, DESK_Y, 0))
const apron = box(3.4, 0.11, 1.36, MAT.woodDark, 0.02)
room.add(at(apron, 0, DESK_Y - 0.1, 0))
for (const x of [-1.62, 1.62]) for (const z of [-0.64, 0.64]) {
  room.add(at(box(0.09, 0.72, 0.09, MAT.woodDark), x, 0.36, z))
}
const cab = box(0.78, 0.66, 1.3, MAT.wood, 0.03)
room.add(at(cab, -1.28, 0.35, 0))
for (let i = 0; i < 3; i++) {
  const dr = box(0.69, 0.19, 0.03, MAT.woodEdge, 0.01)
  room.add(at(dr, -1.28, 0.56 - i * 0.22, 0.665))
  const handle = box(0.2, 0.018, 0.018, MAT.black, 0.006)
  room.add(at(handle, -1.28, 0.57 - i * 0.22, 0.685))
}
const cabTop = box(0.8, 0.05, 1.32, MAT.woodEdge, 0.02)
room.add(at(cabTop, -1.28, 0.7, 0))

// ---------- laptop : low-poly 电脑，点屏幕进到「电脑里面」 ----------
function laptopScreenTexture() {
  const c = document.createElement('canvas')
  c.width = 640; c.height = 400
  const g = c.getContext('2d')!
  g.fillStyle = '#c9c3b6'; g.fillRect(0, 0, 640, 400)
  g.fillStyle = '#b4ae9f'; g.beginPath(); g.moveTo(0, 400); g.lineTo(0, 250); g.lineTo(230, 120); g.lineTo(430, 250); g.lineTo(640, 150); g.lineTo(640, 400); g.fill()
  g.fillStyle = '#9c9687'; g.beginPath(); g.moveTo(0, 400); g.lineTo(180, 300); g.lineTo(380, 400); g.fill()
  g.fillStyle = 'rgba(246,242,232,.9)'; g.fillRect(0, 0, 640, 26)
  g.fillStyle = '#3b3833'; g.font = '13px Georgia'; g.textAlign = 'left'; g.fillText('eeeZora', 14, 18)
  g.font = '11px Courier New'; g.fillText('Finder', 76, 18)
  g.textAlign = 'right'; g.fillText('Wed 25 Nov  16:44', 626, 18)
  g.textAlign = 'left'
  const folder = (x: number, y: number, label: string) => {
    g.fillStyle = '#b9915c'
    g.fillRect(x, y + 8, 74, 52)
    g.fillRect(x, y, 30, 12)
    g.fillStyle = '#d8b47f'; g.fillRect(x + 3, y + 11, 68, 4)
    g.fillStyle = '#2f2c28'; g.font = '12px Georgia'; g.textAlign = 'center'; g.fillText(label, x + 37, y + 74)
    g.textAlign = 'left'
  }
  folder(70, 96, 'Making'); folder(190, 96, 'Noticing'); folder(310, 96, 'Research'); folder(430, 96, 'About')
  folder(70, 208, 'Archive'); folder(190, 208, 'Now'); folder(310, 208, 'Later')
  g.fillStyle = 'rgba(246,242,232,.82)'; g.fillRect(150, 362, 340, 34)
  const dock = ['#c9582b', '#6d8a5a', '#7d8b8e', '#b8b7b2', '#2c2a27', '#b99254', '#9c6a3f', '#4f6b44']
  dock.forEach((col, i) => { g.fillStyle = col; g.fillRect(166 + i * 40, 368, 28, 22) })
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  return t
}
const laptop = new THREE.Group()
laptop.position.set(-0.42, DESK_Y + 0.045, 0.02)
laptop.rotation.y = 0.06
room.add(laptop)
const silver = new THREE.MeshStandardMaterial({ color: '#c9c9c6', roughness: 0.42, metalness: 0.35 })
const silverDark = new THREE.MeshStandardMaterial({ color: '#9e9e9b', roughness: 0.5, metalness: 0.3 })
const screenMat = new THREE.MeshBasicMaterial({ map: laptopScreenTexture() })
const BASE_W = 0.82, BASE_D = 0.56
laptop.add(at(box(BASE_W, 0.028, BASE_D, silver, 0.012), 0, 0.014, 0))
laptop.add(at(box(BASE_W - 0.06, 0.006, 0.16, silverDark, 0.004), 0, 0.03, 0.16))
for (let r = 0; r < 4; r++) for (let cI = 0; cI < 12; cI++) {
  laptop.add(at(box(0.045, 0.007, 0.038, silverDark, 0.002), -0.33 + cI * 0.06, 0.032, -0.19 + r * 0.075))
}
const lid = new THREE.Group()
lid.position.set(0, 0.025, -BASE_D / 2 + 0.02)
lid.rotation.x = -0.17
laptop.add(lid)
lid.add(at(box(BASE_W, 0.44, 0.022, silver, 0.012), 0, 0.22, 0))
const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(BASE_W - 0.05, 0.40), screenMat)
lid.add(at(screenFace, 0, 0.22, 0.0125))
const notch = box(0.07, 0.012, 0.004, MAT.ink, 0.002)
lid.add(at(notch, 0, 0.424, 0.013))

// ---------- vinyl player ----------
const vinyl = new THREE.Group()
vinyl.position.set(-1.42, DESK_Y + 0.045, 0.05)
room.add(vinyl)
vinyl.add(at(box(0.56, 0.07, 0.46, MAT.white, 0.025), 0, 0.035, 0))
const disc = cyl(0.17, 0.17, 0.012, MAT.ink, 32)
vinyl.add(at(disc, -0.06, 0.078, -0.02))
const discLabel = cyl(0.055, 0.055, 0.014, MAT.orange, 24)
vinyl.add(at(discLabel, -0.06, 0.08, -0.02))
const spindle = cyl(0.006, 0.006, 0.02, MAT.metal, 8)
vinyl.add(at(spindle, -0.06, 0.09, -0.02))
const armBase = cyl(0.025, 0.025, 0.02, MAT.metal, 12)
vinyl.add(at(armBase, 0.19, 0.085, -0.12))
const arm = box(0.018, 0.012, 0.27, MAT.metal, 0.004)
arm.rotation.y = -0.5
vinyl.add(at(arm, 0.13, 0.095, 0.01))
for (let i = 0; i < 3; i++) {
  const b = box(0.11, 0.022, 0.035, MAT.black, 0.005)
  vinyl.add(at(b, 0.1, 0.082, 0.15 - i * 0.045))
}

// ---------- paper stack ----------
const stack = new THREE.Group()
stack.position.set(0.05, DESK_Y + 0.045, -0.08)
room.add(stack)
for (let i = 0; i < 5; i++) {
  const p = box(0.34, 0.006, 0.44, MAT.paper, 0.001)
  p.rotation.y = (i - 2) * 0.012
  stack.add(at(p, 0, 0.004 + i * 0.007, 0))
}
const clip = box(0.16, 0.01, 0.03, MAT.brass, 0.003)
stack.add(at(clip, 0, 0.045, -0.17))

// ---------- 选择板：拍立得 / 便签 / 票根 / 截图，用红线串起每个选择 ----------
type PaperKind = 'polaroid' | 'note' | 'sheet' | 'shot' | 'ticket' | 'sticky'
function paperTexture(kind: PaperKind) {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 340
  const g = c.getContext('2d')!
  const ink = '#3b3833', grey = '#8d877c'
  const hand = (x0: number, y: number, w: number, seed: number) => {
    g.beginPath()
    g.moveTo(x0, y)
    for (let i = 1; i <= 6; i++) {
      const t = i / 6
      g.quadraticCurveTo(x0 + w * t - w / 12, y + (i % 2 ? -3 : 2), x0 + w * t, y)
    }
    g.stroke()
  }
  if (kind === 'sticky') {
    g.fillStyle = '#e9da85'; g.fillRect(0, 0, 256, 340)
    g.strokeStyle = 'rgba(120,104,52,.55)'; g.lineWidth = 3
    for (let i = 0; i < 5; i++) hand(28, 70 + i * 46, 196 - (i % 3) * 26, i)
    return finish(c)
  }
  if (kind === 'polaroid') {
    g.fillStyle = '#f9f6ef'; g.fillRect(0, 0, 256, 340)
    g.fillStyle = '#cbd2cd'; g.fillRect(20, 20, 216, 200)
    g.fillStyle = '#b7a992'; g.beginPath(); g.moveTo(20, 220); g.lineTo(20, 168); g.lineTo(96, 118); g.lineTo(150, 168); g.lineTo(236, 138); g.lineTo(236, 220); g.fill()
    g.fillStyle = '#efe8d8'; g.beginPath(); g.arc(186, 72, 26, 0, Math.PI * 2); g.fill()
    g.strokeStyle = '#6e685e'; g.lineWidth = 2.4
    hand(36, 252, 170, 1); hand(36, 282, 140, 2); hand(36, 312, 96, 3)
    return finish(c)
  }
  if (kind === 'shot') {
    g.fillStyle = '#ecede8'; g.fillRect(0, 0, 256, 340)
    g.fillStyle = '#d9dad4'; g.fillRect(0, 0, 256, 34)
    for (let i = 0; i < 3; i++) { g.fillStyle = '#b6b7b1'; g.beginPath(); g.arc(24 + i * 20, 17, 5, 0, Math.PI * 2); g.fill() }
    g.fillStyle = '#c8c9c3'; g.fillRect(18, 54, 220, 92)
    g.fillStyle = '#b3b4ae'; g.fillRect(18, 160, 150, 8); g.fillRect(18, 178, 200, 8); g.fillRect(18, 196, 168, 8)
    g.fillStyle = '#d5d6d0'; g.fillRect(18, 224, 108, 74); g.fillRect(134, 224, 104, 74)
    return finish(c)
  }
  if (kind === 'ticket') {
    g.fillStyle = '#f0e6cf'; g.fillRect(0, 0, 256, 340)
    g.strokeStyle = 'rgba(90,78,52,.45)'; g.lineWidth = 2; g.setLineDash([7, 7])
    g.beginPath(); g.moveTo(184, 12); g.lineTo(184, 328); g.stroke(); g.setLineDash([])
    g.fillStyle = '#5d5340'; g.font = 'bold 40px Georgia'; g.textAlign = 'left'
    g.fillText('07', 24, 66)
    g.fillStyle = grey; g.font = '11px Courier New'
    g.fillText('ADMIT ONE', 24, 96)
    g.strokeStyle = '#8b8270'; g.lineWidth = 2.2
    hand(24, 140, 130, 1); hand(24, 172, 100, 2); hand(24, 204, 116, 3)
    g.fillStyle = '#5d5340'; g.font = '10px Courier New'; g.textAlign = 'center'
    g.fillText('2026', 220, 176)
    return finish(c)
  }
  // note / sheet：米色横线纸 + 手写
  g.fillStyle = kind === 'sheet' ? '#f2ecdd' : '#f5f0e4'
  g.fillRect(0, 0, 256, 340)
  if (kind === 'sheet') {
    g.fillStyle = ink; g.fillRect(22, 34, 132, 9)
    g.fillStyle = grey; g.font = '10px Courier New'; g.textAlign = 'left'
    g.fillText('2026', 206, 42)
  }
  g.strokeStyle = 'rgba(120,112,96,.22)'; g.lineWidth = 1
  for (let i = 0; i < 9; i++) { const y = (kind === 'sheet' ? 82 : 56) + i * 26; g.beginPath(); g.moveTo(20, y); g.lineTo(236, y); g.stroke() }
  g.strokeStyle = '#5b564c'; g.lineWidth = 2.6
  const lines = kind === 'sheet' ? 7 : 8
  for (let i = 0; i < lines; i++) hand(26, (kind === 'sheet' ? 74 : 48) + i * 26, 190 - (i % 4) * 34, i)
  return finish(c)
}
function finish(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}
const paperMats = {
  polaroid: new THREE.MeshStandardMaterial({ map: paperTexture('polaroid'), roughness: 0.95 }),
  note: new THREE.MeshStandardMaterial({ map: paperTexture('note'), roughness: 0.95 }),
  sheet: new THREE.MeshStandardMaterial({ map: paperTexture('sheet'), roughness: 0.95 }),
  shot: new THREE.MeshStandardMaterial({ map: paperTexture('shot'), roughness: 0.95 }),
  ticket: new THREE.MeshStandardMaterial({ map: paperTexture('ticket'), roughness: 0.95 }),
  sticky: new THREE.MeshStandardMaterial({ map: paperTexture('sticky'), roughness: 0.95 }),
}

const board = new THREE.Group()
board.position.set(-0.9, 0.18, -3.15)
board.rotation.y = 0.32
room.add(board)
const BOARD_W = 3.9, BOARD_H = 2.5, BOARD_CY = 1.42
const bFrame = box(BOARD_W, BOARD_H, 0.09, MAT.woodDark, 0.02)
board.add(at(bFrame, 0, BOARD_CY, 0))
const bCork = box(BOARD_W - 0.14, BOARD_H - 0.14, 0.012, MAT.cork, 0.002)
board.add(at(bCork, 0, BOARD_CY, 0.052))
for (const sx of [-1, 1]) board.add(at(box(0.09, 0.28, 0.09, MAT.woodDark), sx * 1.2, 0.14, -0.03))

const pinRed = new THREE.MeshStandardMaterial({ color: '#9c2f24', roughness: 0.4 })
const pinDark = new THREE.MeshStandardMaterial({ color: '#2c2a27', roughness: 0.5 })
const lineMat = new THREE.MeshBasicMaterial({ color: '#9d3227' })
const stringMat = new THREE.MeshBasicMaterial({ color: '#d9c39b' })

type NoteSpec = { kind: keyof typeof paperMats; x: number; y: number; w: number; h: number; rot: number }
const notes: NoteSpec[] = [
  { kind: 'polaroid', x: -1.25, y: 1.72, w: 0.42, h: 0.56, rot: -0.06 },
  { kind: 'note', x: -0.62, y: 1.86, w: 0.44, h: 0.58, rot: 0.04 },
  { kind: 'shot', x: 0.15, y: 1.92, w: 0.4, h: 0.53, rot: -0.03 },
  { kind: 'polaroid', x: 1.02, y: 1.78, w: 0.4, h: 0.54, rot: 0.07 },
  { kind: 'sheet', x: -1.32, y: 0.98, w: 0.48, h: 0.62, rot: 0.05 },
  { kind: 'sticky', x: -0.68, y: 1.12, w: 0.3, h: 0.3, rot: -0.09 },
  { kind: 'note', x: -0.18, y: 1.05, w: 0.42, h: 0.56, rot: 0.02 },
  { kind: 'sticky', x: 0.42, y: 1.18, w: 0.29, h: 0.29, rot: 0.06 },
  { kind: 'polaroid', x: 1.18, y: 0.98, w: 0.38, h: 0.5, rot: -0.05 },
  { kind: 'sticky', x: -1.05, y: 0.42, w: 0.3, h: 0.3, rot: 0.03 },
  { kind: 'sheet', x: -0.35, y: 0.42, w: 0.46, h: 0.6, rot: -0.04 },
  { kind: 'shot', x: 0.55, y: 0.46, w: 0.4, h: 0.53, rot: 0.08 },
  { kind: 'ticket', x: 1.3, y: 0.38, w: 0.3, h: 0.4, rot: -0.07 },
]
const pinPoints: THREE.Vector3[] = []
notes.forEach((n, i) => {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(n.w, n.h), paperMats[n.kind])
  p.position.set(n.x, n.y, 0.064 + (i % 3) * 0.001)
  p.rotation.z = n.rot
  p.castShadow = true
  board.add(p)
  const px = n.x - Math.sin(n.rot) * n.h * 0.42
  const py = n.y + Math.cos(n.rot) * n.h * 0.42
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), i % 4 === 0 ? pinDark : pinRed)
  pin.position.set(px, py, 0.072)
  board.add(pin)
  pinPoints.push(new THREE.Vector3(px, py, 0.073))
})
function thread(a: number, b: number, mat: THREE.Material, sag = 0.08) {
  const p1 = pinPoints[a], p2 = pinPoints[b]
  const mid = p1.clone().lerp(p2, 0.5)
  mid.y -= sag
  mid.z += 0.012
  const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.0035, 5, false), mat)
  board.add(mesh)
}
;[[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 3],
  [4, 9], [9, 10], [10, 11], [11, 12], [1, 6], [6, 10], [2, 7], [7, 11], [0, 9], [3, 12]]
  .forEach((pair, i) => thread(pair[0], pair[1], i % 4 === 0 ? stringMat : lineMat, i % 2 ? 0.07 : 0.13))

// ---------- desk lamp ----------
const lamp = new THREE.Group()
lamp.position.set(1.48, DESK_Y + 0.045, -0.3)
room.add(lamp)
lamp.add(at(cyl(0.115, 0.13, 0.025, MAT.white, 24), 0, 0.012, 0))
const lampArm = cyl(0.014, 0.014, 0.46, MAT.white, 12)
lampArm.rotation.z = -0.22
lamp.add(at(lampArm, 0.035, 0.24, 0))
const lampArm2 = cyl(0.013, 0.013, 0.3, MAT.white, 12)
lampArm2.rotation.z = 1.05
lamp.add(at(lampArm2, -0.1, 0.43, 0))
const shade = cyl(0.058, 0.16, 0.19, MAT.white, 24)
shade.rotation.z = 0.42
lamp.add(at(shade, -0.22, 0.49, 0))
const bulb = new THREE.PointLight('#ffdca8', 1.15, 2.2, 2)
bulb.position.set(-0.27, 0.43, 0.02)
lamp.add(bulb)
lamp.add(at(cyl(0.05, 0.05, 0.012, new THREE.MeshBasicMaterial({ color: '#fff2d5' }), 16), -0.27, 0.4, 0.02))

// ---------- notebook / pen ----------
const book = new THREE.Group()
book.position.set(0.72, DESK_Y + 0.045, 0.33)
room.add(book)
const cover = box(0.5, 0.018, 0.36, MAT.leather, 0.008)
book.add(at(cover, 0, 0.01, 0))
const pages = box(0.46, 0.012, 0.33, MAT.paper, 0.003)
book.add(at(pages, 0.01, 0.023, 0))
const pen = cyl(0.008, 0.008, 0.26, MAT.black, 10)
pen.rotation.set(Math.PI / 2, 0, 0.3)
book.add(at(pen, 0.12, 0.032, 0.02))

// ---------- mug ----------
const mug = new THREE.Group()
mug.position.set(0.14, DESK_Y + 0.045, 0.42)
room.add(mug)
mug.add(at(cyl(0.055, 0.05, 0.11, MAT.white, 20), 0, 0.055, 0))
const coffee = cyl(0.048, 0.048, 0.004, MAT.black, 20)
mug.add(at(coffee, 0, 0.108, 0))
const handle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.009, 8, 16, Math.PI * 1.25), MAT.white)
handle.rotation.y = Math.PI / 2
handle.castShadow = true
mug.add(at(handle, 0.065, 0.06, 0))

// ---------- plant ----------
const plant = new THREE.Group()
plant.position.set(-1.75, DESK_Y + 0.045, -0.42)
room.add(plant)
plant.add(at(cyl(0.09, 0.07, 0.11, MAT.white, 16), 0, 0.055, 0))
plant.add(at(cyl(0.08, 0.08, 0.012, MAT.woodDark, 16), 0, 0.11, 0))
for (let i = 0; i < 7; i++) {
  const a = (i / 7) * Math.PI * 2
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), i % 2 ? MAT.green : MAT.greenDark)
  leaf.scale.set(0.55, 1.35, 0.55)
  leaf.rotation.z = Math.cos(a) * 0.6
  leaf.rotation.x = Math.sin(a) * 0.6
  leaf.castShadow = true
  plant.add(at(leaf, Math.cos(a) * 0.055, 0.18 + (i % 3) * 0.025, Math.sin(a) * 0.055))
}

// ---------- chair : 初始塞在桌下，点一下滑出来 ----------
const chair = new THREE.Group()
const CHAIR_IN = new THREE.Vector3(1.52, 0, 0.1)
const CHAIR_OUT = new THREE.Vector3(2.42, 0, 1.02)
const CHAIR_IN_ROT = -Math.PI / 2
const CHAIR_OUT_ROT = -0.62
chair.position.copy(CHAIR_IN)
chair.rotation.y = CHAIR_IN_ROT
room.add(chair)
chair.add(at(box(0.52, 0.1, 0.5, MAT.leather, 0.04), 0, 0.52, 0))
const back = box(0.5, 0.5, 0.09, MAT.leather, 0.04)
back.rotation.x = -0.12
chair.add(at(back, 0, 0.8, -0.23))
for (const x of [-0.23, 0.23]) chair.add(at(box(0.035, 0.14, 0.035, MAT.metal, 0.01), x, 0.62, -0.2))
chair.add(at(cyl(0.035, 0.035, 0.36, MAT.metal, 12), 0, 0.3, 0))
for (let i = 0; i < 5; i++) {
  const a = (i / 5) * Math.PI * 2
  const leg = box(0.32, 0.035, 0.05, MAT.black, 0.012)
  leg.rotation.y = -a
  chair.add(at(leg, Math.cos(a) * 0.16, 0.11, Math.sin(a) * 0.16))
  const wheel = cyl(0.035, 0.035, 0.025, MAT.black, 12)
  wheel.rotation.z = Math.PI / 2
  chair.add(at(wheel, Math.cos(a) * 0.31, 0.045, Math.sin(a) * 0.31))
}

// ---------- interaction ----------
type SheetTab = { label: string; title: string; sub: string; body: string; meta?: string[] }
type Hotspot = { obj: THREE.Object3D; label: string; pos: THREE.Vector3; look: THREE.Vector3; tabs: SheetTab[]; kind?: 'computer' }
const hotspots: Hotspot[] = [
  {
    obj: laptop, label: 'OPEN DESKTOP', kind: 'computer', pos: new THREE.Vector3(-0.4, 1.95, 2.1), look: new THREE.Vector3(-0.42, 1.05, 0.02),
    tabs: [],
  },
  {
    obj: vinyl, label: 'EXPERIENCE', pos: new THREE.Vector3(-1.25, 1.45, 1.35), look: new THREE.Vector3(-1.42, 1.05, 0.05),
    tabs: [
      { label: '01 · Now', title: 'AI Engineer', sub: 'Stockholm · 2026 — present',
        body: 'Building tools for small teams. Most of the work lives between a research question and a thing someone can actually click.',
        meta: ['AI', 'Product'] },
      { label: '02 · Before', title: 'Research intern', sub: '2025',
        body: 'Interviews, coding, and the slow work of turning what people say into what a product should do.',
        meta: ['Research'] },
    ],
  },
  {
    obj: board, label: 'CHOICES', pos: new THREE.Vector3(-0.2, 2.1, -0.2), look: new THREE.Vector3(-0.9, 1.6, -3.15),
    tabs: [
      { label: '01 · The thread', title: 'A thread of choices', sub: '2019 — now',
        body: 'Every card here is a choice, and every red thread is what one choice made possible. Read it left to right and it is not a timeline — it is a reason.',
        meta: ['Choices', 'Threads'] },
      { label: '02 · About me', title: 'About me', sub: '2026-11-25',
        body: 'Hi, I am Xinyi (Emilia). I notice small things, make a few of them touchable, and test whether they hold up. Beyond work I take photographs, swim, and get lost on foot.',
        meta: ['Hello', 'Currently here'] },
      { label: '03 · Elsewhere', title: 'Elsewhere', sub: 'Links',
        body: 'Somewhere else on the internet: email, GitHub, and a photo album that updates less often than I would like.',
        meta: ['Email', 'GitHub', 'Photos'] },
    ],
  },
  {
    obj: stack, label: 'NOTES', pos: new THREE.Vector3(0.05, 1.4, 1.4), look: new THREE.Vector3(0.05, 1.05, -0.08),
    tabs: [
      { label: '01 · On attention', title: 'On attention', sub: 'Running note · 2026',
        body: 'A running note on what deserves to be noticed when everything asks to be seen. Currently: the pause before someone answers.',
        meta: ['Note'] },
    ],
  },
  {
    obj: book, label: 'FIELD NOTES', pos: new THREE.Vector3(0.72, 1.45, 1.6), look: new THREE.Vector3(0.72, 1.08, 0.33),
    tabs: [
      { label: '01 · Films that linger', title: 'Films that linger', sub: 'List · 2025',
        body: 'A small list of films I keep returning to, and the one image I take from each one.',
        meta: ['Film', 'List'] },
    ],
  },
  {
    obj: lamp, label: 'A QUIET CORNER', pos: new THREE.Vector3(1.35, 1.5, 1.3), look: new THREE.Vector3(1.3, 1.25, -0.3),
    tabs: [
      { label: '01 · Light', title: 'Turn the lamp on', sub: 'A small detail',
        body: 'This corner is still being written. Leave it dark for now — some things are better left unfinished.',
        meta: ['Later'] },
    ],
  },
]

// ---------- 电脑里的档案柜：文件夹 → 档案 → 详情 ----------
type Dossier = { date: string; title: string; tag: string; text: string }
type FolderData = { name: string; closed?: boolean; files: Dossier[] }
const folders: FolderData[] = [
  { name: 'Making', files: [
    { date: '2026.11', title: 'Room of Small Things', tag: 'SITE', text: 'An interactive personal site where every object opens a story. Built with React, GSAP and a lot of patience. This desktop is one of those objects — you are inside it now.' },
    { date: '2026.08', title: 'A Quiet Interface', tag: 'PROTOTYPE', text: 'A prototype about slowing down: no badges, no counters, only what the moment needs. The fewer things it shows, the longer you stay.' },
    { date: '2025.12', title: 'Notes turned into Tools', tag: 'TOOLING', text: 'Small utilities born from repeated notes — the note kept asking to become a button, so eventually I let it.' },
  ] },
  { name: 'Noticing', files: [
    { date: '2026.10', title: 'On attention', tag: 'NOTE', text: 'A running note on what deserves to be noticed when everything asks to be seen. Currently: the pause before someone answers.' },
    { date: '2026.06', title: 'Films that linger', tag: 'LIST', text: 'A small list of films I keep returning to, and the one image I take from each one.' },
    { date: '2025.09', title: 'Field recordings', tag: 'SOUND', text: 'Overheard fragments — a station announcement, a corridor, someone practising scales.' },
  ] },
  { name: 'Research', files: [
    { date: '2026.09', title: 'Talking without leading', tag: 'METHOD', text: 'A short method note on asking better questions and being comfortable with silence.' },
    { date: '2026.04', title: 'Competitor field notes', tag: 'TEARDOWN', text: 'Not a feature matrix — what a product feels like after twenty minutes of use.' },
  ] },
  { name: 'About', files: [
    { date: '2026.11', title: 'Hello', tag: 'INTRO', text: 'I notice small things, make a few of them touchable, and test whether they hold up.' },
    { date: '2026.11', title: 'Now', tag: 'CURRENT', text: 'Working at the edge of research, product and AI — mostly on making things feel human.' },
  ] },
  { name: 'Archive', files: [
    { date: '2025.07', title: 'First sketch of this room', tag: 'OLD', text: 'The earliest version had a door you had to push open. Some of it is still here.' },
    { date: '2025.03', title: 'A list of small ideas', tag: 'OLD', text: 'Things I wrote down and forgot about, then found again while cleaning up.' },
  ] },
  { name: 'Now', files: [
    { date: 'WEEK 47', title: 'Currently making', tag: 'NOW', text: 'Turning this desk into a place you can walk around. Dragging the view is the newest thing.' },
  ] },
  { name: 'Later', closed: true, files: [
    { date: '—', title: 'Not for display', tag: 'PRIVATE', text: 'This drawer is turned face down. The contents are not decided yet.' },
  ] },
]

// 椅子滑出状态
let chairOut = false
let chairTarget = CHAIR_IN.clone()
let chairRotTarget = CHAIR_IN_ROT
function toggleChair() {
  chairOut = !chairOut
  chairTarget.copy(chairOut ? CHAIR_OUT : CHAIR_IN)
  chairRotTarget = chairOut ? CHAIR_OUT_ROT : CHAIR_IN_ROT
  const t = document.getElementById('tag')!
  t.textContent = chairOut ? 'PULLED OUT' : 'TUCKED IN'
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 900)
}

const desktop = document.getElementById('desktop')!
const foldersEl = document.getElementById('folders')!
const sideList = document.getElementById('sideList')!
const crumb = document.getElementById('crumb')!
const filesPanel = document.getElementById('files')!
const fileList = document.getElementById('fileList')!
const detailPanel = document.getElementById('detail')!

function renderDesktop() {
  foldersEl.innerHTML = ''
  sideList.innerHTML = ''
  folders.forEach(f => {
    const side = document.createElement('div')
    side.className = 'side-item'
    side.innerHTML = `<span class="ico"></span>${f.name}`
    side.onclick = () => openFolder(f)
    sideList.appendChild(side)
    const el = document.createElement('div')
    el.className = 'folder' + (f.closed ? ' closed' : '')
    el.innerHTML = `<div class="glyph"></div><div class="name">${f.name}</div><div class="count">${f.files.length} item${f.files.length === 1 ? '' : 's'}</div>`
    el.onclick = () => openFolder(f)
    foldersEl.appendChild(el)
  })
  crumb.textContent = 'MACINTOSH HD › FINDER'
  foldersEl.style.display = 'grid'
  filesPanel.classList.remove('show')
  detailPanel.classList.remove('show')
}
function openFolder(f: FolderData) {
  crumb.textContent = `MACINTOSH HD › ${f.name.toUpperCase()}`
  foldersEl.style.display = 'none'
  detailPanel.classList.remove('show')
  filesPanel.classList.add('show')
  fileList.innerHTML = ''
  f.files.forEach(d => {
    const row = document.createElement('div')
    row.className = 'file-row'
    row.innerHTML = `<span class="date">${d.date}</span><span class="t">${d.title}</span><span class="tagm">${d.tag}</span>`
    row.onclick = () => {
      detailPanel.classList.add('show')
      filesPanel.classList.remove('show')
      crumb.textContent = `${f.name.toUpperCase()} › ${d.title.toUpperCase()}`
      ;(document.getElementById('detailTitle')!).textContent = d.title
      ;(document.getElementById('detailSub')!).textContent = `${d.date}  ·  ${d.tag}`
      ;(document.getElementById('detailBody')!).textContent = d.text
    }
    fileList.appendChild(row)
  })
}
document.getElementById('fileBack')!.onclick = renderDesktop
document.getElementById('detailBack')!.onclick = () => {
  detailPanel.classList.remove('show'); filesPanel.classList.add('show')
  const name = crumb.textContent!.split(' › ')[0]
  crumb.textContent = `${name} › FILES`
}
document.getElementById('osclose')!.onclick = () => closeSheet()

const tag = document.getElementById('tag')!
const paperWrap = document.getElementById('paperWrap')!
const tabsEl = document.getElementById('tabs')!
const paperTitle = document.getElementById('paperTitle')!
const paperSub = document.getElementById('paperSub')!
const paperBody = document.getElementById('paperBody')!
let active: Hotspot | null = null
let activeTab = 0
let returning = false

function renderSheet(h: Hotspot, index = 0) {
  if (!active) {
    orbitPos.copy(camera.position)
    orbitLook.copy(controls.target)
    controls.enabled = false
    const damp = controls.enableDamping
    controls.enableDamping = false
    controls.update()
    controls.enableDamping = damp
  }
  returning = false
  active = h
  activeTab = index
  wantPos.copy(h.pos)
  wantLook.copy(h.look)
  if (h.kind === 'computer') {
    renderDesktop()
    desktop.classList.add('show')
    paperWrap.classList.remove('show')
  } else {
    tabsEl.innerHTML = ''
    h.tabs.forEach((t, i) => {
      const b = document.createElement('button')
      b.textContent = t.label
      if (i === index) b.className = 'on'
      b.onclick = () => renderSheet(h, i)
      tabsEl.appendChild(b)
    })
    const t = h.tabs[index]
    paperTitle.textContent = t.title
    paperSub.textContent = t.sub
    paperBody.innerHTML = `<p>${t.body}</p>${t.meta ? `<div class="rule"></div><div class="meta">${t.meta.map(m => `<span>${m}</span>`).join('')}</div>` : ''}`
    paperWrap.classList.add('show')
    desktop.classList.remove('show')
  }
  const navKey = h.kind === 'computer' ? 'laptop' : h.label === 'EXPERIENCE' ? 'vinyl' : h.label === 'CHOICES' ? 'board' : ''
  document.querySelectorAll('.nav button').forEach(el => el.classList.toggle('on', (el as HTMLElement).dataset.open === navKey))
}

function closeSheet() {
  if (!active) return
  active = null
  paperWrap.classList.remove('show')
  desktop.classList.remove('show')
  wantPos.copy(orbitPos)
  wantLook.copy(orbitLook)
  returning = true
  document.querySelectorAll('.nav button').forEach(el => el.classList.remove('on'))
}

document.getElementById('close')!.addEventListener('click', closeSheet)
paperWrap.addEventListener('click', e => { if (e.target === paperWrap) closeSheet() })
document.getElementById('brand')!.addEventListener('click', closeSheet)
document.querySelectorAll<HTMLButtonElement>('.nav button').forEach(b => {
  b.onclick = () => {
    const map: Record<string, string> = { laptop: 'COMPUTER', vinyl: 'EXPERIENCE', board: 'CHOICES' }
    const key = map[b.dataset.open!]
    const h = key === 'COMPUTER' ? hotspots.find(x => x.kind === 'computer') : hotspots.find(x => x.label === key)
    if (h) renderSheet(h)
  }
})
addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet() })

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
const allHotObjects = [...hotspots.map(h => h.obj), chair]
let hovered: THREE.Object3D | null = null

function hitTest(ev: PointerEvent) {
  pointer.x = (ev.clientX / innerWidth) * 2 - 1
  pointer.y = -(ev.clientY / innerHeight) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  return raycaster.intersectObjects(allHotObjects, true)[0]?.object ?? null
}
function isChair(o: THREE.Object3D | null) {
  let r = o
  while (r && r !== chair) r = r.parent
  return r === chair
}
canvas.addEventListener('pointermove', ev => {
  if (active) { tag.classList.remove('show'); return }
  const hit = hitTest(ev)
  hovered = hit
  canvas.style.cursor = hit ? 'pointer' : 'default'
  if (isChair(hit)) {
    const p = chair.position.clone(); p.y += 1; p.project(camera)
    tag.textContent = chairOut ? 'PUSH IN' : 'PULL OUT'
    tag.style.left = `${((p.x + 1) / 2) * innerWidth}px`
    tag.style.top = `${((-p.y + 1) / 2) * innerHeight}px`
    tag.classList.add('show')
  } else if (hit) {
    let root: THREE.Object3D = hit
    while (root.parent && !allHotObjects.includes(root)) root = root.parent
    const h = hotspots.find(x => x.obj === root)
    if (h) {
      const p = new THREE.Vector3()
      root.getWorldPosition(p)
      p.y += root === board ? BOARD_CY + BOARD_H / 2 : 0.55
      p.project(camera)
      tag.textContent = h.label
      tag.style.left = `${((p.x + 1) / 2) * innerWidth}px`
      tag.style.top = `${((-p.y + 1) / 2) * innerHeight}px`
      tag.classList.add('show')
    }
  } else tag.classList.remove('show')
})
let downX = 0, downY = 0, downT = 0
canvas.addEventListener('pointerdown', ev => { downX = ev.clientX; downY = ev.clientY; downT = Date.now() })
canvas.addEventListener('click', ev => {
  if (active) return
  if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 6) return
  if (Date.now() - downT > 600) return
  const hit = hitTest(ev)
  if (!hit) return
  if (isChair(hit)) { toggleChair(); return }
  let root: THREE.Object3D = hit
  while (root.parent && !allHotObjects.includes(root)) root = root.parent
  const h = hotspots.find(x => x.obj === root)
  if (h) { tag.classList.remove('show'); renderSheet(h) }
})

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

const lookNow = HOME_LOOK.clone()
function animate() {
  requestAnimationFrame(animate)
  if (active || returning) {
    camera.position.lerp(wantPos, 0.075)
    lookNow.lerp(wantLook, 0.075)
    camera.lookAt(lookNow)
    if (returning && camera.position.distanceTo(wantPos) < 0.02 && lookNow.distanceTo(wantLook) < 0.02) {
      camera.position.copy(orbitPos)
      lookNow.copy(orbitLook)
      camera.lookAt(lookNow)
      controls.target.copy(orbitLook)
      controls.enabled = true
      const damp = controls.enableDamping
      controls.enableDamping = false
      controls.update()
      controls.enableDamping = damp
      returning = false
    }
  } else {
    controls.update()
  }
  chair.position.lerp(chairTarget, 0.075)
  chair.rotation.y += (chairRotTarget - chair.rotation.y) * 0.075
  renderer.render(scene, camera)
}
animate()
;(window as unknown as Record<string, unknown>).__demo = { camera, controls, get active() { return active }, get returning() { return returning } }
const qs = new URLSearchParams(location.search)

// ---------- 封面：先见名字，点击进屋 ----------
const intro = document.getElementById('intro')
let entered = false
function enterScene() {
  if (entered) return
  entered = true
  if (intro) { intro.classList.add('gone'); setTimeout(() => intro.remove(), 900) }
  document.body.classList.add('ready')
  wantPos.copy(HOME_POS)
  wantLook.copy(HOME_LOOK)
  returning = true
}
if (intro && !qs.has('skipintro')) {
  intro.addEventListener('click', enterScene)
  addEventListener('keydown', e => {
    if (!entered && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); enterScene() }
  })
} else {
  camera.position.copy(HOME_POS)
  enterScene()
}

const deepLink = qs.get('open')
if (deepLink) {
  const map: Record<string, string> = { experience: 'EXPERIENCE', about: 'CHOICES', choices: 'CHOICES' }
  const target = deepLink === 'laptop' || deepLink === 'projects'
    ? hotspots.find(h => h.kind === 'computer')
    : hotspots.find(h => h.label === (map[deepLink] ?? deepLink.toUpperCase()))
  if (target) setTimeout(() => renderSheet(target, Number(qs.get('tab') ?? 0)), 900)
}
