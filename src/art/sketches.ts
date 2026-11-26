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
];
