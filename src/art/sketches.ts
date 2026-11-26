/** A colouring picture: tappable regions (drawn in order) plus non-tappable line details. */
export interface Sketch {
  id: string;
  regions: { id: string; d: string }[];
  /** Extra line art drawn on top (eyes, lines); not tappable. */
  outline: string;
}

const rect = (x: number, y: number, w: number, h: number, r = 0) =>
  r ? `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`
    : `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

/** All pictures use a 400×300 viewBox. Regions are big enough for small fingers. */
export const SKETCHES: readonly Sketch[] = [
  {
    id: 'rumah',
    regions: [
      { id: 'tanah', d: rect(0, 262, 400, 38) },
      { id: 'matahari', d: circle(352, 52, 34) },
      { id: 'dinding', d: rect(96, 138, 208, 128) },
      { id: 'atap', d: 'M72 142 L200 44 L328 142 Z' },
      { id: 'pintu', d: rect(176, 190, 48, 76, 8) },
      { id: 'jendela-kiri', d: rect(116, 164, 44, 40, 4) },
      { id: 'jendela-kanan', d: rect(240, 164, 44, 40, 4) },
    ],
    outline: 'M138 164 V204 M116 184 H160 M262 164 V204 M240 184 H284',
  },
  {
    id: 'mobil',
    regions: [
      { id: 'jalan', d: rect(0, 252, 400, 48) },
      { id: 'badan', d: 'M40 210 Q40 160 80 156 L320 156 Q362 160 362 210 L362 226 Q362 236 352 236 L50 236 Q40 236 40 226 Z' },
      { id: 'atap', d: 'M110 158 L148 98 L262 98 L300 158 Z' },
      { id: 'kaca', d: 'M134 152 L158 112 L252 112 L276 152 Z' },
      { id: 'roda-kiri', d: circle(110, 238, 32) },
      { id: 'roda-kanan', d: circle(290, 238, 32) },
      { id: 'lampu', d: circle(346, 188, 14) },
    ],
    outline: 'M205 112 V152 M110 238 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M290 238 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0',
  },
  {
    id: 'kupu',
    regions: [
      { id: 'sayap-kiri-atas', d: 'M196 140 Q150 20 70 50 Q20 80 60 140 Q100 170 196 150 Z' },
      { id: 'sayap-kanan-atas', d: 'M204 140 Q250 20 330 50 Q380 80 340 140 Q300 170 204 150 Z' },
      { id: 'sayap-kiri-bawah', d: 'M196 160 Q120 160 90 210 Q90 270 150 260 Q190 240 196 175 Z' },
      { id: 'sayap-kanan-bawah', d: 'M204 160 Q280 160 310 210 Q310 270 250 260 Q210 240 204 175 Z' },
      { id: 'badan', d: rect(186, 92, 28, 170, 14) },
    ],
    outline: 'M194 96 Q176 60 160 54 M206 96 Q224 60 240 54',
  },
  {
    id: 'ikan',
    regions: [
      { id: 'air', d: rect(0, 0, 400, 300) },
      { id: 'ekor', d: 'M276 150 L360 92 L360 208 Z' },
      { id: 'sirip-atas', d: 'M140 90 Q190 30 240 96 Z' },
      { id: 'sirip-bawah', d: 'M160 206 Q190 250 226 204 Z' },
      { id: 'badan', d: ellipse(180, 150, 110, 70) },
      { id: 'gelembung', d: circle(60, 70, 26) },
    ],
    outline: 'M108 140 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M120 176 q14 10 28 0 M230 110 q22 40 0 80',
  },
  {
    id: 'bunga',
    regions: [
      { id: 'pot', d: 'M140 224 H260 L244 292 H156 Z' },
      { id: 'batang', d: rect(194, 120, 12, 106) },
      { id: 'daun-kiri', d: 'M196 196 Q140 150 120 186 Q150 214 196 206 Z' },
      { id: 'daun-kanan', d: 'M204 176 Q260 130 280 166 Q250 194 204 186 Z' },
      { id: 'kelopak', d: 'M200 20 Q236 20 236 56 Q272 56 272 92 Q272 128 236 128 Q236 164 200 164 Q164 164 164 128 Q128 128 128 92 Q128 56 164 56 Q164 20 200 20 Z' },
      { id: 'putik', d: circle(200, 92, 28) },
    ],
    outline: '',
  },
  {
    id: 'kapal',
    regions: [
      { id: 'laut', d: 'M0 230 Q50 214 100 230 T200 230 T300 230 T400 230 V300 H0 Z' },
      { id: 'badan', d: 'M60 190 H340 L300 250 H100 Z' },
      { id: 'layar-besar', d: 'M206 40 L206 176 L310 176 Z' },
      { id: 'layar-kecil', d: 'M194 70 L194 176 L110 176 Z' },
      { id: 'bendera', d: 'M200 14 L240 26 L200 38 Z' },
      { id: 'matahari', d: circle(60, 60, 34) },
    ],
    outline: 'M200 14 V190',
  },
  {
    id: 'kue',
    regions: [
      { id: 'piring', d: ellipse(200, 270, 170, 22) },
      { id: 'kue-bawah', d: rect(80, 170, 240, 96, 12) },
      { id: 'kue-atas', d: rect(120, 100, 160, 74, 12) },
      { id: 'krim', d: 'M120 112 Q140 138 160 112 Q180 138 200 112 Q220 138 240 112 Q260 138 280 112 V100 H120 Z' },
      { id: 'lilin', d: rect(188, 44, 24, 56, 4) },
      { id: 'api', d: 'M200 6 Q218 26 210 38 Q200 46 190 38 Q182 26 200 6 Z' },
    ],
    outline: 'M80 214 Q110 236 140 214 Q170 236 200 214 Q230 236 260 214 Q290 236 320 214',
  },
  {
    id: 'balon-udara',
    regions: [
      { id: 'langit', d: rect(0, 0, 400, 300) },
      { id: 'balon', d: 'M200 20 C290 20 300 110 250 170 L230 196 H170 L150 170 C100 110 110 20 200 20 Z' },
      { id: 'garis-tengah', d: 'M200 20 C230 60 230 140 214 196 H186 C170 140 170 60 200 20 Z' },
      { id: 'keranjang', d: rect(170, 230, 60, 46, 6) },
      { id: 'awan', d: 'M300 250 Q300 226 324 228 Q334 206 358 216 Q384 214 382 240 Q396 254 378 264 H310 Q292 262 300 250 Z' },
    ],
    outline: 'M172 196 L176 230 M228 196 L224 230',
  },
  {
    id: 'pohon',
    regions: [
      { id: 'rumput', d: rect(0, 262, 400, 38) },
      { id: 'batang', d: 'M180 270 L188 160 H212 L220 270 Z' },
      { id: 'daun', d: 'M200 20 Q260 20 270 70 Q320 80 310 130 Q330 180 270 186 Q240 210 200 190 Q160 210 130 186 Q70 180 90 130 Q80 80 130 70 Q140 20 200 20 Z' },
      { id: 'buah-1', d: circle(150, 110, 18) },
      { id: 'buah-2', d: circle(240, 90, 18) },
      { id: 'buah-3', d: circle(210, 150, 18) },
      { id: 'burung', d: ellipse(320, 230, 30, 22) },
    ],
    outline: 'M336 224 l14 4 l-14 4 M314 224 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',
  },
  {
    id: 'payung',
    regions: [
      { id: 'hujan', d: rect(0, 0, 400, 300) },
      { id: 'payung', d: 'M50 150 Q60 30 200 26 Q340 30 350 150 Q325 130 300 150 Q275 130 250 150 Q225 130 200 150 Q175 130 150 150 Q125 130 100 150 Q75 130 50 150 Z' },
      { id: 'tengah', d: 'M200 26 Q160 90 150 150 Q175 130 200 150 Q225 130 250 150 Q240 90 200 26 Z' },
      { id: 'genangan', d: ellipse(200, 276, 140, 18) },
    ],
    outline: 'M200 150 V250 Q200 268 184 268 Q170 268 170 254 M60 30 l-6 16 M110 20 l-6 16 M300 20 l-6 16 M350 40 l-6 16 M40 200 l-6 16 M360 200 l-6 16',
  },
];
