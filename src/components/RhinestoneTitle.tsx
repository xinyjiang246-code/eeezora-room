interface Props {
  text: string
  className?: string
  size?: 'hero' | 'section'
}

/** 生成一颗圆形明亮式切割宝石（俯视）：8 个冠部切面 + 桌面 + 星芒 + 高光点 */
function gem(cx: number, cy: number, R: number, rot = 0) {
  const n = 8
  const pt = (rad: number, i: number) => {
    const a = ((22.5 + 45 * i + rot) * Math.PI) / 180
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)] as const
  }
  const outer = Array.from({ length: n }, (_, i) => pt(R, i))
  const inner = Array.from({ length: n }, (_, i) => pt(R * 0.52, i))

  const nodes: React.ReactElement[] = []
  // 外圈金属暗边
  nodes.push(<circle key="r" cx={cx} cy={cy} r={R * 1.06} fill="#5f6b74" />)
  // 切面：按中心方向与光源(左上 225°)夹角决定明暗，对比更硬更像钻
  const light = (225 * Math.PI) / 180
  for (let i = 0; i < n; i++) {
    const a = ((22.5 + 45 * i + 22.5 + rot) * Math.PI) / 180
    const lum = 0.5 + 0.5 * Math.cos(a - light)
    const v = Math.round(95 + 160 * lum)
    const col = `rgb(${v},${Math.min(255, v + 6)},${Math.min(255, v + 12)})`
    const o0 = outer[i], o1 = outer[(i + 1) % n], i1 = inner[(i + 1) % n], i0 = inner[i]
    const pts = `${o0[0]},${o0[1]} ${o1[0]},${o1[1]} ${i1[0]},${i1[1]} ${i0[0]},${i0[1]}`
    nodes.push(<polygon key={`f${i}`} points={pts} fill={col} />)
  }
  // 桌面
  nodes.push(<polygon key="t" points={inner.map(([x, y]) => `${x},${y}`).join(' ')} fill="#f7fbff" />)
  // 桌面内星芒
  const s = R * 0.5
  const q = R * 0.12
  nodes.push(
    <path
      key="s"
      d={`M ${cx},${cy - s} L ${cx + q},${cy - q} L ${cx + s},${cy} L ${cx + q},${cy + q} L ${cx},${cy + s} L ${cx - q},${cy + q} L ${cx - s},${cy} L ${cx - q},${cy - q} Z`}
      fill="#ffffff"
    />,
  )
  // 高光点
  nodes.push(<circle key="h" cx={cx - R * 0.28} cy={cy - R * 0.3} r={R * 0.2} fill="#ffffff" />)
  return nodes
}

/**
 * 水钻哥特字标。
 * 字形：UnifrakturMaguntia（Old English / Blackletter，Z 作 "3" 形）
 * 质感：深色字身 + 白色描边轮廓 + 字内宝石点阵（宝石只填字内，不压轮廓）
 * 参数按字号等比换算，大标题和小标记的质感保持一致。
 */
export function RhinestoneTitle({ text, className = '', size = 'hero' }: Props) {
  const hero = size === 'hero'
  const fontSize = hero ? 330 : 150
  const width = Math.round(fontSize * 2.55)
  const height = Math.round(fontSize * 0.97)
  const baseline = Math.round(fontSize * 0.82)

  const strokeW = fontSize * 0.052
  const dotBoost = hero ? 1 : 1.45
  const tile = fontSize * 0.080 * (hero ? 1 : 1.12)
  const gemR = fontSize * 0.0155 * dotBoost
  const tracking = -fontSize * 0.010
  const textLen = Math.round(width * 0.94)

  const uid = size
  const font = "UnifrakturMaguntia, 'Old English Text MT', 'Cormorant Garamond', serif"

  return (
    <svg
      className={`rhinestone-title ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={text}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* 宝石点阵：8 切面宝石交错排布，明暗不同避免机械感 */}
        <pattern
          id={`beads-${uid}`}
          width={tile}
          height={tile}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-7)"
        >
          {gem(tile * 0.28, tile * 0.28, gemR, 0)}
          {gem(tile * 0.78, tile * 0.72, gemR * 0.86, 22)}
          {gem(tile * 0.46, tile * 0.92, gemR * 0.7, 11)}
        </pattern>

        {/* 只取字内区域（无描边），宝石不覆盖白轮廓 */}
        <mask id={`inner-${uid}`}>
          <text
            x="50%"
            y={baseline}
            textAnchor="middle"
            fontFamily={font}
            fontSize={fontSize}
            letterSpacing={tracking}
            textLength={textLen}
            lengthAdjust="spacingAndGlyphs"
            fill="#ffffff"
          >
            {text}
          </text>
        </mask>

        {/* 整体冷光，模拟钻面反光 */}
        <filter id={`halo-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={fontSize * 0.012} result="b" />
          <feFlood floodColor="#eaf2f6" floodOpacity="0.3" />
          <feComposite in2="b" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#halo-${uid})`}>
        {/* 字身：深色填充 + 白色外描边 */}
        <text
          x="50%"
          y={baseline}
          textAnchor="middle"
          fontFamily={font}
          fontSize={fontSize}
          letterSpacing={tracking}
          textLength={textLen}
          lengthAdjust="spacingAndGlyphs"
          fill="#0a090d"
          stroke="#f3f7f8"
          strokeWidth={strokeW}
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          {text}
        </text>

        {/* 字内宝石 */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={`url(#beads-${uid})`}
          mask={`url(#inner-${uid})`}
        />
      </g>
    </svg>
  )
}
