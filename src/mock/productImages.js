export const PRODUCT_IMAGE_THEMES = {
  'p-001': { kind: 'headphones', primary: '#111827', accent: '#67E8F9', glow: '#E0F2FE' },
  'p-002': { kind: 'dock', primary: '#334155', accent: '#94A3B8', glow: '#E2E8F0' },
  'p-003': { kind: 'mouse', primary: '#0F766E', accent: '#99F6E4', glow: '#CCFBF1' },
  'p-004': { kind: 'projector', primary: '#1E293B', accent: '#F59E0B', glow: '#FEF3C7' },
  'p-005': { kind: 'lamp', primary: '#92400E', accent: '#FDE68A', glow: '#FFFBEB' },
  'p-006': { kind: 'storage', primary: '#475569', accent: '#BAE6FD', glow: '#F0F9FF' },
  'p-007': { kind: 'textile', primary: '#9A3412', accent: '#FED7AA', glow: '#FFF7ED' },
  'p-008': { kind: 'diffuser', primary: '#7C3AED', accent: '#DDD6FE', glow: '#F5F3FF' },
  'p-009': { kind: 'coffee', primary: '#78350F', accent: '#FDBA74', glow: '#FFF7ED' },
  'p-010': { kind: 'coffee', primary: '#431407', accent: '#FCD34D', glow: '#FEFCE8' },
  'p-011': { kind: 'snack', primary: '#854D0E', accent: '#FACC15', glow: '#FEF9C3' },
  'p-012': { kind: 'snack', primary: '#4D7C0F', accent: '#BEF264', glow: '#F7FEE7' },
  'p-013': { kind: 'bottle', primary: '#0F766E', accent: '#A7F3D0', glow: '#ECFDF5' },
  'p-014': { kind: 'towel', primary: '#64748B', accent: '#E2E8F0', glow: '#F8FAFC' },
  'p-015': { kind: 'massager', primary: '#1F2937', accent: '#FCA5A5', glow: '#FEF2F2' },
  'p-016': { kind: 'mat', primary: '#065F46', accent: '#6EE7B7', glow: '#ECFDF5' },
  'p-017': { kind: 'backpack', primary: '#172554', accent: '#93C5FD', glow: '#EFF6FF' },
  'p-018': { kind: 'bag', primary: '#7F1D1D', accent: '#FCA5A5', glow: '#FEF2F2' },
  'p-019': { kind: 'charger', primary: '#0F172A', accent: '#C4B5FD', glow: '#F5F3FF' },
  'p-020': { kind: 'meter', primary: '#0E7490', accent: '#A5F3FC', glow: '#ECFEFF' },
  'p-021': { kind: 'cup', primary: '#92400E', accent: '#FCD34D', glow: '#FFFBEB' },
  'p-022': { kind: 'cream', primary: '#BE123C', accent: '#FDA4AF', glow: '#FFF1F2' },
  'p-023': { kind: 'bench', primary: '#111827', accent: '#86EFAC', glow: '#F0FDF4' },
  'p-024': { kind: 'wallet', primary: '#3F3F46', accent: '#D4D4D8', glow: '#FAFAFA' },
  'p-025': { kind: 'cable', primary: '#1E293B', accent: '#93C5FD', glow: '#EFF6FF' },
  'p-026': { kind: 'nightLight', primary: '#92400E', accent: '#FDE68A', glow: '#FEFCE8' },
  'p-027': { kind: 'gift', primary: '#7C2D12', accent: '#FDBA74', glow: '#FFF7ED' },
  'p-028': { kind: 'sponge', primary: '#CA8A04', accent: '#FEF08A', glow: '#FEFCE8' },
  'p-029': { kind: 'towel', primary: '#0369A1', accent: '#7DD3FC', glow: '#F0F9FF' },
  'p-030': { kind: 'sleeve', primary: '#18181B', accent: '#A1A1AA', glow: '#FAFAFA' },
};

const SHAPES = {
  headphones:
    '<circle cx="212" cy="244" r="44" fill="var(--accent)"/><circle cx="428" cy="244" r="44" fill="var(--accent)"/><path d="M208 236c0-76 44-124 112-124s112 48 112 124" fill="none" stroke="var(--primary)" stroke-width="28" stroke-linecap="round"/><rect x="178" y="238" width="68" height="118" rx="28" fill="var(--primary)"/><rect x="394" y="238" width="68" height="118" rx="28" fill="var(--primary)"/>',
  dock:
    '<rect x="166" y="204" width="308" height="154" rx="42" fill="var(--primary)"/><rect x="202" y="244" width="236" height="36" rx="18" fill="var(--accent)"/><circle cx="232" cy="318" r="14" fill="var(--accent)"/><circle cx="282" cy="318" r="14" fill="var(--accent)"/><circle cx="332" cy="318" r="14" fill="var(--accent)"/>',
  mouse:
    '<path d="M320 130c76 0 118 58 118 150s-42 150-118 150-118-58-118-150 42-150 118-150Z" fill="var(--primary)"/><path d="M320 150v92" stroke="var(--accent)" stroke-width="14" stroke-linecap="round"/><rect x="304" y="178" width="32" height="58" rx="16" fill="var(--accent)"/>',
  projector:
    '<rect x="160" y="190" width="320" height="190" rx="44" fill="var(--primary)"/><circle cx="250" cy="285" r="58" fill="var(--accent)"/><circle cx="250" cy="285" r="32" fill="var(--glow)"/><path d="M326 256h94M326 306h70" stroke="var(--accent)" stroke-width="18" stroke-linecap="round"/>',
  lamp:
    '<path d="M290 120h112l-44 116h-112l44-116Z" fill="var(--accent)"/><path d="M304 232 218 350M344 232 432 350" stroke="var(--primary)" stroke-width="18" stroke-linecap="round"/><rect x="210" y="350" width="236" height="28" rx="14" fill="var(--primary)"/>',
  storage:
    '<rect x="172" y="156" width="296" height="236" rx="36" fill="var(--primary)"/><rect x="204" y="190" width="232" height="48" rx="18" fill="var(--accent)"/><rect x="204" y="262" width="232" height="48" rx="18" fill="var(--accent)"/><rect x="204" y="334" width="232" height="28" rx="14" fill="var(--accent)"/>',
  textile:
    '<path d="M164 210c62-48 120-48 174 0 42 38 88 38 138 0v146c-50 38-96 38-138 0-54-48-112-48-174 0V210Z" fill="var(--primary)"/><path d="M198 250h242M198 306h242" stroke="var(--accent)" stroke-width="14" stroke-linecap="round"/>',
  diffuser:
    '<path d="M232 210h176l-28 168H260l-28-168Z" fill="var(--primary)"/><rect x="248" y="168" width="144" height="54" rx="27" fill="var(--accent)"/><path d="M274 126c-28 22 28 32 0 58M328 116c-30 26 30 36 0 72M382 126c-28 22 28 32 0 58" stroke="var(--accent)" stroke-width="12" stroke-linecap="round"/>',
  coffee:
    '<rect x="204" y="152" width="232" height="250" rx="28" fill="var(--primary)"/><rect x="232" y="184" width="176" height="52" rx="16" fill="var(--accent)"/><path d="M252 282h136" stroke="var(--accent)" stroke-width="18" stroke-linecap="round"/>',
  snack:
    '<path d="M214 130h212l-30 300H244L214 130Z" fill="var(--primary)"/><path d="M240 178h160M250 238h140M260 298h120" stroke="var(--accent)" stroke-width="16" stroke-linecap="round"/>',
  bottle:
    '<rect x="256" y="172" width="128" height="240" rx="38" fill="var(--primary)"/><rect x="278" y="118" width="84" height="70" rx="24" fill="var(--accent)"/><rect x="282" y="252" width="76" height="82" rx="24" fill="var(--accent)"/>',
  towel:
    '<rect x="184" y="154" width="272" height="232" rx="38" fill="var(--primary)"/><path d="M222 212h196M222 274h196M222 336h150" stroke="var(--accent)" stroke-width="16" stroke-linecap="round"/>',
  massager:
    '<rect x="196" y="188" width="248" height="84" rx="42" fill="var(--primary)"/><rect x="286" y="250" width="68" height="150" rx="34" fill="var(--primary)"/><circle cx="190" cy="230" r="34" fill="var(--accent)"/><circle cx="450" cy="230" r="34" fill="var(--accent)"/>',
  mat:
    '<path d="M180 188h220c44 0 80 36 80 80s-36 80-80 80H180c-20 0-36-16-36-36v-88c0-20 16-36 36-36Z" fill="var(--primary)"/><circle cx="400" cy="268" r="52" fill="var(--accent)"/>',
  backpack:
    '<rect x="220" y="156" width="200" height="248" rx="52" fill="var(--primary)"/><path d="M260 166c10-44 110-44 120 0" fill="none" stroke="var(--accent)" stroke-width="20" stroke-linecap="round"/><rect x="254" y="278" width="132" height="84" rx="28" fill="var(--accent)"/>',
  bag:
    '<rect x="184" y="202" width="272" height="178" rx="46" fill="var(--primary)"/><path d="M260 210c0-48 120-48 120 0" fill="none" stroke="var(--accent)" stroke-width="20" stroke-linecap="round"/><path d="M226 288h188" stroke="var(--accent)" stroke-width="16" stroke-linecap="round"/>',
  charger:
    '<circle cx="320" cy="270" r="112" fill="var(--primary)"/><circle cx="320" cy="270" r="62" fill="var(--accent)"/><path d="M320 178v-42M320 404v-42" stroke="var(--primary)" stroke-width="18" stroke-linecap="round"/>',
  meter:
    '<rect x="200" y="156" width="240" height="240" rx="56" fill="var(--primary)"/><circle cx="320" cy="276" r="70" fill="var(--accent)"/><path d="M320 276h44M320 276v-54" stroke="var(--glow)" stroke-width="14" stroke-linecap="round"/>',
  cup:
    '<rect x="238" y="146" width="164" height="262" rx="42" fill="var(--primary)"/><rect x="262" y="118" width="116" height="42" rx="21" fill="var(--accent)"/><path d="M402 226h28c38 0 38 72 0 72h-28" fill="none" stroke="var(--accent)" stroke-width="20" stroke-linecap="round"/>',
  cream:
    '<rect x="246" y="164" width="148" height="240" rx="42" fill="var(--primary)"/><rect x="274" y="118" width="92" height="62" rx="22" fill="var(--accent)"/><path d="M282 270h76" stroke="var(--accent)" stroke-width="16" stroke-linecap="round"/>',
  bench:
    '<rect x="174" y="184" width="292" height="70" rx="24" fill="var(--primary)"/><path d="M224 254v124M416 254v124M206 378h228" stroke="var(--accent)" stroke-width="20" stroke-linecap="round"/>',
  wallet:
    '<rect x="178" y="190" width="284" height="192" rx="38" fill="var(--primary)"/><rect x="218" y="236" width="206" height="58" rx="22" fill="var(--accent)"/><circle cx="402" cy="324" r="14" fill="var(--accent)"/>',
  cable:
    '<path d="M210 184c-80 92 30 206 120 116 80-80 194 12 100 98" fill="none" stroke="var(--primary)" stroke-width="26" stroke-linecap="round"/><rect x="188" y="154" width="72" height="68" rx="20" fill="var(--accent)"/><rect x="392" y="348" width="72" height="68" rx="20" fill="var(--accent)"/>',
  nightLight:
    '<path d="M320 128c74 0 134 60 134 134S394 396 320 396 186 336 186 262s60-134 134-134Z" fill="var(--primary)"/><path d="M360 166c-42 14-72 54-72 100s30 86 72 100c-72 12-134-44-134-104s62-116 134-96Z" fill="var(--accent)"/>',
  gift:
    '<rect x="188" y="220" width="264" height="176" rx="28" fill="var(--primary)"/><rect x="300" y="220" width="40" height="176" fill="var(--accent)"/><rect x="170" y="180" width="300" height="58" rx="24" fill="var(--accent)"/><path d="M300 180c-74-66-102 22 0 0ZM340 180c74-66 102 22 0 0Z" fill="var(--primary)"/>',
  sponge:
    '<rect x="194" y="174" width="252" height="222" rx="54" fill="var(--primary)"/><circle cx="260" cy="244" r="18" fill="var(--accent)"/><circle cx="332" cy="280" r="18" fill="var(--accent)"/><circle cx="384" cy="226" r="18" fill="var(--accent)"/>',
  sleeve:
    '<rect x="176" y="166" width="288" height="228" rx="36" fill="var(--primary)"/><path d="M210 214h220M210 318h220" stroke="var(--accent)" stroke-width="18" stroke-linecap="round"/><rect x="240" y="252" width="160" height="32" rx="16" fill="var(--accent)"/>',
};

export function createProductImage(productId, productName) {
  const theme = PRODUCT_IMAGE_THEMES[productId] || PRODUCT_IMAGE_THEMES['p-001'];
  const shape = SHAPES[theme.kind] || SHAPES.headphones;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" role="img" aria-label="${productName} product image" style="--primary:${theme.primary};--accent:${theme.accent};--glow:${theme.glow}">
    <rect width="640" height="480" rx="54" fill="${theme.glow}"/>
    <circle cx="136" cy="96" r="88" fill="${theme.accent}" opacity=".28"/>
    <circle cx="520" cy="386" r="112" fill="${theme.primary}" opacity=".12"/>
    <g filter="url(#shadow)">${shape}</g>
    <defs><filter id="shadow" x="80" y="70" width="480" height="380" filterUnits="userSpaceOnUse"><feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#0f172a" flood-opacity=".18"/></filter></defs>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}#${theme.kind}`;
}
