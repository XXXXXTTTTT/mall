# Shop iOS Icon Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/shop` as a mobile-first, iOS-inspired, icon-driven storefront while preserving every frontend requirement from `README.md`.

**Architecture:** Add focused shop UI primitives first, then refactor page groups in dependency order: shell and browse pages, product detail, transaction flow, then account/order/address pages. All visual changes stay in JSX/Tailwind and existing shop components; services, storage keys, and business semantics remain unchanged.

**Tech Stack:** React 18, React Router 6, Tailwind CSS 4 classes in JSX, Vitest, Testing Library, existing mock services in `src/mock/mockService.js`.

---

## Design Inputs
- Spec: `docs/superpowers/specs/2026-06-11-shop-ios-icon-redesign.md`.
- Functional contract: `README.md`.
- Visual contract: `task_ui.md`.
- No new dependency.
- No new `localStorage` key.
- Preserve existing accessible names used by tests unless a task explicitly updates the test first.

## File Structure

### Create
- `src/components/shop/ShopIcon.jsx`: inline SVG icon registry used by all shop pages.
- `src/components/shop/IconButton.jsx`: 44px icon-only button/link primitive.
- `src/components/shop/GlassBar.jsx`: reusable glass top/bottom surface.
- `src/components/shop/IOSCard.jsx`: card wrapper with shop surface styling.
- `src/components/shop/SettingRow.jsx`: iOS settings-style row.
- `src/components/shop/MetricTile.jsx`: user metric card.
- `src/components/shop/ProductTag.jsx`: visual product tags for 热门, 新品, 限时特惠, 精选.
- `src/components/shop/HeroCarousel.jsx`: homepage carousel using existing online products.

### Modify
- `src/components/shop/StatusTag.jsx`: convert to icon-led visual status tag while keeping export name `StatusTag`.
- `src/components/shop/EmptyState.jsx`: replace dot placeholder with semantic icon.
- `src/components/shop/QuantityStepper.jsx`: enforce 44px touch targets.
- `src/components/shop/SectionHeader.jsx`: convert action link to chevron icon-led link.
- `src/components/shop/ProductCard.jsx`: update product tile to retina card, use `ProductTag`.
- `src/components/shop/shopComponents.test.jsx`: test shared visual primitives and preserve behavior.
- `src/pages/shop/ShopLayout.jsx`: bottom navigation becomes glass icon Dock.
- `src/pages/shop/Home.jsx`: add glass search, required carousel, hot product grid.
- `src/pages/shop/Category.jsx`: add required category index grid and icon sort chips.
- `src/pages/shop/shopBrowse.test.jsx`: assert README-required home/category elements and visual contracts.
- `src/pages/shop/Detail.jsx`: immersive detail and glass purchase bar.
- `src/pages/shop/Cart.jsx`: iOS shopping bag cards and glass checkout bar.
- `src/pages/shop/CreateOrder.jsx`: checkout card stack and glass submit bar.
- `src/pages/shop/Pay.jsx`: visual payment simulation and status panels.
- `src/pages/shop/PaySuccess.jsx`: icon-led success actions.
- `src/pages/shop/OrderListPage.jsx`: icon status filters and order cards.
- `src/pages/shop/OrderDetailPage.jsx`: card-based order dossier and logistics timeline.
- `src/pages/shop/UserPage.jsx`: user identity, metrics, recent orders, settings rows.
- `src/pages/shop/AddressPage.jsx`: address book cards and icon actions.
- `src/pages/shop/FavoritesPage.jsx`: favorite product collection with heart action.
- `src/pages/shop/LoginPage.jsx`: member pass card.
- `src/pages/shop/shopFlow.test.jsx`: assert transaction/account visual and business coverage.
- `src/styleContract.test.js`: add source-level visual contract checks for glass and touch-target classes.

## Global Constraints
- Keep existing business flows green.
- Keep button/link names used by current tests: `加入购物车`, `立即购买`, `收藏`, `取消收藏`, `去结算`, `提交订单`, `确认已支付`, `新增地址`, `保存地址`, `去登录`, `我的订单`, `我的收藏`, `地址管理`, `已支付`.
- Icon-only actions must use `aria-label` equal to the visible/legacy action name.
- All icon buttons and primary controls must contain `h-11`, `w-11`, or `min-h-11`.
- All glass fixed bars must contain both `backdrop-blur-md` and `bg-white/80`.
- Do not change `STORAGE_KEYS` in `src/mock/mockService.js`.

---

### Task 1: Shared iOS Shop Primitives

**Files:**
- Create: `src/components/shop/ShopIcon.jsx`
- Create: `src/components/shop/IconButton.jsx`
- Create: `src/components/shop/GlassBar.jsx`
- Create: `src/components/shop/IOSCard.jsx`
- Create: `src/components/shop/SettingRow.jsx`
- Create: `src/components/shop/MetricTile.jsx`
- Create: `src/components/shop/ProductTag.jsx`
- Modify: `src/components/shop/StatusTag.jsx`
- Modify: `src/components/shop/EmptyState.jsx`
- Modify: `src/components/shop/QuantityStepper.jsx`
- Modify: `src/components/shop/SectionHeader.jsx`
- Modify: `src/components/shop/ProductCard.jsx`
- Test: `src/components/shop/shopComponents.test.jsx`

- [ ] **Step 1: Write failing tests for shared primitives and visual contracts**

Update `src/components/shop/shopComponents.test.jsx` imports:

```jsx
import { IconButton } from './IconButton.jsx';
import { MetricTile } from './MetricTile.jsx';
import { ProductTag } from './ProductTag.jsx';
import { SettingRow } from './SettingRow.jsx';
import { ShopIcon } from './ShopIcon.jsx';
```

Add these tests inside `describe('shop shared components', () => { ... })`:

```jsx
  it('renders local svg icons without adding icon dependencies', () => {
    const { container } = render(<ShopIcon name="search" className="h-5 w-5" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps icon buttons at a 44px touch target', () => {
    render(<IconButton ariaLabel="删除" icon="trash" onClick={() => {}} />);

    const button = screen.getByRole('button', { name: '删除' });
    expect(button.className).toContain('h-11');
    expect(button.className).toContain('w-11');
  });

  it('renders settings rows with icon and chevron link', () => {
    render(
      <MemoryRouter>
        <SettingRow to="/shop/orders" icon="receipt" title="我的订单" description="查看订单进度" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /我的订单/ })).toHaveAttribute('href', '/shop/orders');
    expect(screen.getByText('查看订单进度')).toBeInTheDocument();
  });

  it('renders metric tiles and product tags with icons', () => {
    const { container } = render(
      <>
        <MetricTile icon="coupon" label="优惠券" value="3" />
        <ProductTag tag="热门" />
      </>,
    );

    expect(screen.getByText('优惠券')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('热门')).toBeInTheDocument();
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });
```

Update the existing `renders section header action link` test so it expects the accessible link name to still be `查看全部`:

```jsx
expect(screen.getByRole('link', { name: '查看全部' })).toHaveAttribute('href', '/shop/category');
```

Update the existing quantity tests with class assertions:

```jsx
expect(screen.getByRole('button', { name: '减少数量' }).className).toContain('h-11');
expect(screen.getByRole('button', { name: '增加数量' }).className).toContain('h-11');
```

- [ ] **Step 2: Run shared component tests and verify failure**

Run:

```bash
npm run test -- src/components/shop/shopComponents.test.jsx
```

Expected: fail because `ShopIcon.jsx`, `IconButton.jsx`, `SettingRow.jsx`, `MetricTile.jsx`, and `ProductTag.jsx` do not exist.

- [ ] **Step 3: Create `ShopIcon.jsx` with a local SVG registry**

Create `src/components/shop/ShopIcon.jsx`:

```jsx
const ICON_PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  filter: (
    <>
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M6.5 10v9.5h11V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="2" />
      <rect x="14" y="4" width="6" height="6" rx="2" />
      <rect x="4" y="14" width="6" height="6" rx="2" />
      <rect x="14" y="14" width="6" height="6" rx="2" />
    </>
  ),
  bag: (
    <>
      <path d="M7 8h10l1 12H6L7 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  heart: (
    <path d="M20.3 6.7a5 5 0 0 0-7.1 0L12 7.9l-1.2-1.2a5 5 0 0 0-7.1 7.1L12 22l8.3-8.2a5 5 0 0 0 0-7.1Z" />
  ),
  heartFilled: (
    <path d="M12 21.2 4.2 13.5A4.8 4.8 0 1 1 11 6.7l1 1 1-1a4.8 4.8 0 0 1 6.8 6.8L12 21.2Z" />
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  receipt: (
    <>
      <path d="M7 3h10v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2V3Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </>
  ),
  location: (
    <>
      <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  coupon: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M9 9h.01" />
      <path d="M15 15h.01" />
      <path d="m9 15 6-6" />
    </>
  ),
  star: (
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
  ),
  flame: (
    <path d="M12 22c4 0 7-2.8 7-6.8 0-2.7-1.4-5.2-4.2-7.6.1 2.1-.7 3.4-2.3 4-1-2.8-2.8-5-5.3-6.6.3 3-.3 5.1-1.7 6.7A6.3 6.3 0 0 0 5 15.2C5 19.2 8 22 12 22Z" />
  ),
  spark: (
    <>
      <path d="M12 3v6" />
      <path d="M12 15v6" />
      <path d="M3 12h6" />
      <path d="M15 12h6" />
      <path d="m5.6 5.6 4.2 4.2" />
      <path d="m14.2 14.2 4.2 4.2" />
      <path d="m18.4 5.6-4.2 4.2" />
      <path d="m9.8 14.2-4.2 4.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </>
  ),
};

export function ShopIcon({ name, className = 'h-5 w-5' }) {
  const path = ICON_PATHS[name] || ICON_PATHS.spark;

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {path}
    </svg>
  );
}
```

- [ ] **Step 4: Create shared primitives**

Create `src/components/shop/IconButton.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

const baseClass =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/85 text-slate-700 shadow-[0_12px_28px_rgba(24,36,51,0.08)] transition hover:border-[#1F6F8B]/30 hover:text-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300';

export function IconButton({ ariaLabel, icon, to, onClick, disabled = false, className = '' }) {
  const content = <ShopIcon name={icon} className="h-5 w-5" />;
  const classes = `${baseClass} ${className}`.trim();

  if (to) {
    return (
      <Link aria-label={ariaLabel} className={classes} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <button aria-label={ariaLabel} className={classes} disabled={disabled} onClick={onClick} type="button">
      {content}
    </button>
  );
}
```

Create `src/components/shop/GlassBar.jsx`:

```jsx
export function GlassBar({ as: Component = 'div', children, className = '' }) {
  return (
    <Component
      className={`border border-white/70 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-md ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
```

Create `src/components/shop/IOSCard.jsx`:

```jsx
export function IOSCard({ as: Component = 'section', children, className = '' }) {
  return (
    <Component
      className={`rounded-[2rem] border border-slate-200/70 bg-[#FBFCFA] shadow-[0_18px_48px_rgba(24,36,51,0.08)] ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
```

Create `src/components/shop/SettingRow.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

const colorClasses = {
  teal: 'bg-[#E7F3F4] text-[#1F6F8B]',
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  sky: 'bg-sky-50 text-sky-700',
  slate: 'bg-slate-100 text-slate-600',
  red: 'bg-red-50 text-red-600',
};

export function SettingRow({ icon, title, description, to, onClick, tone = 'teal' }) {
  const content = (
    <>
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorClasses[tone] || colorClasses.teal}`}>
        <ShopIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-slate-950">{title}</span>
        <span className="mt-0.5 block text-sm text-slate-500">{description}</span>
      </span>
      <ShopIcon name="chevronRight" className="h-5 w-5 text-slate-300" />
    </>
  );
  const className =
    'flex min-h-14 w-full items-center gap-3 rounded-[1.5rem] bg-white px-4 py-3 text-left shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B]';

  if (to) {
    return (
      <Link className={className} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {content}
    </button>
  );
}
```

Create `src/components/shop/MetricTile.jsx`:

```jsx
import { ShopIcon } from './ShopIcon.jsx';

export function MetricTile({ icon, label, value, tone = 'teal' }) {
  const toneClass =
    tone === 'amber'
      ? 'bg-amber-50 text-amber-700'
      : tone === 'emerald'
        ? 'bg-emerald-50 text-emerald-700'
        : tone === 'sky'
          ? 'bg-sky-50 text-sky-700'
          : 'bg-[#E7F3F4] text-[#1F6F8B]';

  return (
    <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${toneClass}`}>
        <ShopIcon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-3 text-2xl font-black tabular-nums tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}
```

Create `src/components/shop/ProductTag.jsx`:

```jsx
import { ShopIcon } from './ShopIcon.jsx';

const TAG_CONFIG = {
  热门: { icon: 'flame', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  新品: { icon: 'spark', className: 'border-sky-200 bg-sky-50 text-sky-700' },
  限时特惠: { icon: 'clock', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  精选: { icon: 'star', className: 'border-[#BFE5EA] bg-[#E7F3F4] text-[#1F6F8B]' },
};

export function ProductTag({ tag }) {
  const config = TAG_CONFIG[tag] || { icon: 'spark', className: 'border-slate-200 bg-slate-50 text-slate-600' };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${config.className}`}>
      <ShopIcon name={config.icon} className="h-3.5 w-3.5" />
      {tag}
    </span>
  );
}
```

- [ ] **Step 5: Refactor `StatusTag.jsx`, `EmptyState.jsx`, `QuantityStepper.jsx`, `SectionHeader.jsx`, and `ProductCard.jsx`**

Update `src/components/shop/StatusTag.jsx` to keep the export name and add icons:

```jsx
import { ShopIcon } from './ShopIcon.jsx';

const STATUS_LABELS = {
  online: '上架',
  offline: '下架',
  pending_payment: '待支付',
  paid: '已支付',
  shipped: '已发货',
  completed: '已完成',
  canceled: '已取消',
};

const STATUS_META = {
  online: { icon: 'check', className: 'border-teal-200 bg-teal-50 text-teal-700' },
  offline: { icon: 'alert', className: 'border-slate-200 bg-slate-100 text-slate-500' },
  pending_payment: { icon: 'clock', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  paid: { icon: 'receipt', className: 'border-teal-200 bg-teal-50 text-teal-700' },
  shipped: { icon: 'truck', className: 'border-sky-200 bg-sky-50 text-sky-700' },
  completed: { icon: 'check', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  canceled: { icon: 'alert', className: 'border-slate-200 bg-slate-100 text-slate-500' },
};

export function StatusTag({ status }) {
  const meta = STATUS_META[status] || STATUS_META.offline;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${meta.className}`}>
      <ShopIcon name={meta.icon} className="h-3.5 w-3.5" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
```

Update `src/components/shop/EmptyState.jsx` to accept an `icon` prop and keep hidden decorative icon:

```jsx
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

export function EmptyState({ title, description = '', actionText = '', actionTo = '', icon = 'spark' }) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] px-6 py-10 text-center shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[#BFE5EA] bg-[#E7F3F4] text-[#1F6F8B]"
      >
        <ShopIcon name={icon} className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      {actionText && actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2"
        >
          {actionText}
        </Link>
      ) : null}
    </section>
  );
}
```

Update `src/components/shop/QuantityStepper.jsx` buttons to use `h-11 w-11` and icons:

```jsx
import { ShopIcon } from './ShopIcon.jsx';

export function QuantityStepper({ value, onChange, min = 1, max = 999, disabled = false }) {
  const safeValue = Math.min(max, Math.max(min, value));
  const canDecrease = !disabled && safeValue > min;
  const canIncrease = !disabled && safeValue < max;

  function updateQuantity(nextValue) {
    if (disabled) return;
    const nextSafeValue = Math.min(max, Math.max(min, nextValue));
    if (nextSafeValue !== safeValue) onChange(nextSafeValue);
  }

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-[#fbfcfa] p-1 shadow-sm">
      <button
        type="button"
        aria-label="减少数量"
        disabled={!canDecrease}
        onClick={() => updateQuantity(safeValue - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <ShopIcon name="minus" className="h-5 w-5" />
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-bold tabular-nums text-slate-950">{safeValue}</span>
      <button
        type="button"
        aria-label="增加数量"
        disabled={!canIncrease}
        onClick={() => updateQuantity(safeValue + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <ShopIcon name="plus" className="h-5 w-5" />
      </button>
    </div>
  );
}
```

Update `src/components/shop/SectionHeader.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

export function SectionHeader({ eyebrow, title, actionText, actionTo }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1F6F8B]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      </div>
      {actionText && actionTo ? (
        <Link
          aria-label={actionText}
          to={actionTo}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#1F6F8B]/40 hover:text-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
        >
          <ShopIcon name="chevronRight" className="h-5 w-5" />
        </Link>
      ) : null}
    </div>
  );
}
```

Update `src/components/shop/ProductCard.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { ProductTag } from './ProductTag.jsx';
import { StatusTag } from './StatusTag.jsx';

export function ProductCard({ product }) {
  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <Link
      to={`/shop/detail/${product.id}`}
      className="group block overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] shadow-[0_18px_48px_rgba(24,36,51,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#1F6F8B]/30 hover:shadow-[0_24px_58px_rgba(24,36,51,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <StatusTag status={product.status} />
        </div>
      </div>
      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-950">{product.name}</h3>
        <div className="flex items-end justify-between gap-3">
          <p className="text-xl font-black tracking-tight text-slate-950">¥{product.price}</p>
          <p className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
            库存 {product.stock}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <ProductTag key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 6: Run shared component tests**

Run:

```bash
npm run test -- src/components/shop/shopComponents.test.jsx
```

Expected: pass, `11` tests passed in `src/components/shop/shopComponents.test.jsx`.

- [ ] **Step 7: Commit shared primitives**

Run:

```bash
git add src/components/shop/ShopIcon.jsx src/components/shop/IconButton.jsx src/components/shop/GlassBar.jsx src/components/shop/IOSCard.jsx src/components/shop/SettingRow.jsx src/components/shop/MetricTile.jsx src/components/shop/ProductTag.jsx src/components/shop/StatusTag.jsx src/components/shop/EmptyState.jsx src/components/shop/QuantityStepper.jsx src/components/shop/SectionHeader.jsx src/components/shop/ProductCard.jsx src/components/shop/shopComponents.test.jsx
git commit -m "feat: add shop ios visual primitives"
```

---

### Task 2: Shop Shell, Homepage Carousel, And Category Index

**Files:**
- Create: `src/components/shop/HeroCarousel.jsx`
- Modify: `src/pages/shop/ShopLayout.jsx`
- Modify: `src/pages/shop/Home.jsx`
- Modify: `src/pages/shop/Category.jsx`
- Modify: `src/pages/shop/shopBrowse.test.jsx`
- Modify: `src/styleContract.test.js`

- [ ] **Step 1: Write failing browse-page tests for README requirements**

Update `src/pages/shop/shopBrowse.test.jsx`.

In `hides offline products on home and category pages`, replace the old title assertion:

```jsx
expect(await screen.findByText('云仓优品')).toBeInTheDocument();
expect(screen.getByRole('searchbox', { name: '搜索商品' })).toBeInTheDocument();
expect(screen.getByTestId('shop-hero-carousel')).toBeInTheDocument();
expect(screen.getByText('热门商品')).toBeInTheDocument();
expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();
```

For the category portion, assert the category index:

```jsx
expect(await screen.findByText('分类索引')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /全部/ })).toBeInTheDocument();
expect(screen.getByRole('button', { name: /数码办公/ })).toBeInTheDocument();
expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();
```

Add a new test:

```jsx
  it('renders icon dock navigation with glass treatment', async () => {
    const { container } = renderShop(['/shop']);

    expect(await screen.findByRole('navigation', { name: '前台主导航' })).toBeInTheDocument();
    const dock = container.querySelector('[data-testid="shop-bottom-dock"]');
    expect(dock).toBeInTheDocument();
    expect(dock.className).toContain('backdrop-blur-md');
    expect(dock.className).toContain('bg-white/80');
    expect(screen.getByRole('link', { name: /首页/ }).className).toContain('min-h-11');
    expect(screen.getByRole('link', { name: /分类/ }).className).toContain('min-h-11');
  });
```

Update `src/styleContract.test.js` with source-level checks:

```js
  it('keeps shop glass and touch target contracts in source', () => {
    const layout = readFileSync(resolve('src/pages/shop/ShopLayout.jsx'), 'utf-8');
    const home = readFileSync(resolve('src/pages/shop/Home.jsx'), 'utf-8');
    const category = readFileSync(resolve('src/pages/shop/Category.jsx'), 'utf-8');

    expect(layout).toContain('backdrop-blur-md');
    expect(layout).toContain('bg-white/80');
    expect(layout).toContain('min-h-11');
    expect(home).toContain('HeroCarousel');
    expect(category).toContain('分类索引');
  });
```

- [ ] **Step 2: Run browse/style tests and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx src/styleContract.test.js
```

Expected: fail because `HeroCarousel`, category index text, and Dock test ids/classes are not implemented.

- [ ] **Step 3: Create `HeroCarousel.jsx`**

Create `src/components/shop/HeroCarousel.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { ProductTag } from './ProductTag.jsx';
import { ShopIcon } from './ShopIcon.jsx';

export function HeroCarousel({ products }) {
  const slides = products.slice(0, 3);

  return (
    <section aria-label="首页轮播图" className="space-y-3" data-testid="shop-hero-carousel">
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {slides.map((product, index) => (
          <Link
            className="relative min-h-[190px] min-w-full snap-center overflow-hidden rounded-[2.25rem] bg-slate-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.20)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#98D3DC]"
            key={product.id}
            to={`/shop/detail/${product.id}`}
          >
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-35"
              src={product.image}
            />
            <div className="relative max-w-[68%]">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-[#98D3DC]">
                <ShopIcon name="spark" className="h-4 w-4" />
                Slide {index + 1}
              </p>
              <h2 className="mt-5 text-2xl font-black leading-tight tracking-tight">{product.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-200">{product.description}</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-2xl font-black">¥{product.price}</span>
                {(product.tags || []).slice(0, 1).map((tag) => (
                  <ProductTag key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-2" aria-hidden="true">
        {slides.map((product, index) => (
          <span
            className={`h-1.5 rounded-full ${index === 0 ? 'w-6 bg-[#1F6F8B]' : 'w-1.5 bg-slate-300'}`}
            key={product.id}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Refactor `ShopLayout.jsx`**

Update `src/pages/shop/ShopLayout.jsx`:

```jsx
import { NavLink, Outlet } from 'react-router-dom';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';

const navItems = [
  { to: '/shop', label: '首页', icon: 'home' },
  { to: '/shop/category', label: '分类', icon: 'grid' },
  { to: '/shop/cart', label: '购物车', icon: 'bag' },
  { to: '/shop/user', label: '我的', icon: 'user' },
];

export function ShopLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] pb-24 text-slate-900">
      <div className="mx-auto min-h-screen max-w-md bg-[#F5F7F6] shadow-[0_0_80px_rgba(15,23,42,0.08)]">
        <Outlet />
      </div>
      <nav
        aria-label="前台主导航"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md justify-around border-t border-white/70 bg-white/80 px-4 py-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md"
        data-testid="shop-bottom-dock"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/shop'}
            className={({ isActive }) =>
              [
                'inline-flex min-h-11 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl px-3 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B]',
                isActive ? 'bg-[#E7F3F4] text-[#1F6F8B]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            <ShopIcon name={item.icon} className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 5: Refactor `Home.jsx`**

Update `src/pages/shop/Home.jsx`:

```jsx
import { HeroCarousel } from '../../components/shop/HeroCarousel.jsx';
import { IconButton } from '../../components/shop/IconButton.jsx';
import { ProductCard } from '../../components/shop/ProductCard.jsx';
import { SectionHeader } from '../../components/shop/SectionHeader.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { productService } from '../../mock/mockService.js';

export function Home() {
  const onlineProducts = productService.listProductsSync().filter((product) => product.status === 'online');
  const hotProducts = onlineProducts.filter((product) => product.tags?.includes('热门')).slice(0, 4);
  const newProducts = onlineProducts.filter((product) => product.tags?.includes('新品')).slice(0, 4);
  const dealProducts = onlineProducts.filter((product) => product.tags?.includes('限时特惠')).slice(0, 4);

  return (
    <main className="space-y-7 px-5 pb-28 pt-5">
      <section className="sticky top-0 z-30 -mx-5 border-b border-white/70 bg-white/80 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <label className="flex min-h-11 flex-1 items-center gap-3 rounded-full border border-slate-200/80 bg-white px-4 text-sm font-semibold text-slate-500 shadow-sm">
            <ShopIcon name="search" className="h-5 w-5 text-[#1F6F8B]" />
            <span className="sr-only">搜索商品</span>
            <input
              aria-label="搜索商品"
              type="search"
              placeholder="搜索商品、分类或生活方式"
              className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>
          <IconButton ariaLabel="打开筛选" icon="filter" />
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#1F6F8B]">云仓优品</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">可信赖的精选商城</h1>
      </section>

      <HeroCarousel products={onlineProducts} />

      <section className="grid grid-cols-4 gap-3" aria-label="快捷入口">
        {[
          { label: '热门', icon: 'flame' },
          { label: '新品', icon: 'spark' },
          { label: '特惠', icon: 'clock' },
          { label: '分类', icon: 'grid' },
        ].map((item) => (
          <a
            className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-[1.5rem] bg-white text-xs font-bold text-slate-700 shadow-sm"
            href={item.label === '分类' ? '/shop/category' : '#hot-products'}
            key={item.label}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7F3F4] text-[#1F6F8B]">
              <ShopIcon name={item.icon} className="h-5 w-5" />
            </span>
            {item.label}
          </a>
        ))}
      </section>

      <section className="space-y-4" id="hot-products">
        <SectionHeader eyebrow="HOT" title="热门商品" actionText="查看全部" actionTo="/shop/category" />
        <div className="grid grid-cols-2 gap-4">
          {hotProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="NEW" title="新品精选" actionText="去分类" actionTo="/shop/category" />
        <div className="grid grid-cols-2 gap-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="DEAL" title="限时特惠" actionText="更多商品" actionTo="/shop/category" />
        <div className="grid grid-cols-2 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Refactor `Category.jsx`**

Update `src/pages/shop/Category.jsx`:

```jsx
import { useState } from 'react';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { ProductCard } from '../../components/shop/ProductCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { categoryService, productService } from '../../mock/mockService.js';

const sortOptions = [
  { label: '综合', icon: 'spark' },
  { label: '价格升序', icon: 'plus' },
  { label: '价格降序', icon: 'minus' },
  { label: '销量优先', icon: 'flame' },
];

const categoryIcons = ['grid', 'spark', 'bag', 'home', 'coupon', 'user', 'star', 'clock'];

export function Category() {
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [activeSort, setActiveSort] = useState('综合');
  const categories = categoryService.listCategoriesSync();
  const parentCategories = categories.filter((category) => category.parentId === null);
  const onlineProducts = productService.listProductsSync().filter((product) => product.status === 'online');
  const countByCategory = categories.reduce((summary, category) => {
    summary[category.id] = onlineProducts.filter((product) => product.categoryId === category.id).length;
    return summary;
  }, {});
  const visibleProducts = onlineProducts
    .filter((product) => activeCategoryId === 'all' || product.categoryId === activeCategoryId)
    .sort((left, right) => {
      if (activeSort === '价格升序') return left.price - right.price;
      if (activeSort === '价格降序') return right.price - left.price;
      if (activeSort === '销量优先') return right.sales - left.sales;
      return 0;
    });

  return (
    <main className="space-y-6 px-5 pb-28 pt-6">
      <section className="rounded-[2rem] border border-slate-200/80 bg-[#FBFCFA] p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1F6F8B]">CATEGORY</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">分类索引</h1>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`flex min-h-20 items-center gap-3 rounded-[1.5rem] p-3 text-left transition ${
              activeCategoryId === 'all' ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 shadow-sm'
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <ShopIcon name="grid" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-bold">全部</span>
              <span className="text-xs opacity-70">{onlineProducts.length} 件商品</span>
            </span>
          </button>
          {parentCategories.map((category, index) => {
            const childIds = categories.filter((item) => item.parentId === category.id).map((item) => item.id);
            const productCount = onlineProducts.filter((product) => childIds.includes(product.categoryId)).length;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(childIds[0] || category.id)}
                className="flex min-h-20 items-center gap-3 rounded-[1.5rem] bg-white p-3 text-left text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7F3F4] text-[#1F6F8B]">
                  <ShopIcon name={categoryIcons[index % categoryIcons.length]} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-bold">{category.name}</span>
                  <span className="text-xs text-slate-500">{productCount} 件商品</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sortOptions.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => setActiveSort(option.label)}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
              activeSort === option.label ? 'bg-[#E7F3F4] text-[#1F6F8B]' : 'bg-white text-slate-500'
            }`}
          >
            <ShopIcon name={option.icon} className="h-4 w-4" />
            {option.label}
          </button>
        ))}
      </div>

      {visibleProducts.length > 0 ? (
        <section className="grid grid-cols-2 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <EmptyState title="暂无商品" description="当前分类暂时没有可购买商品。" icon="bag" />
      )}
    </main>
  );
}
```

- [ ] **Step 7: Run browse/style tests**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx src/styleContract.test.js
```

Expected: pass.

- [ ] **Step 8: Commit shell and browse pages**

Run:

```bash
git add src/components/shop/HeroCarousel.jsx src/pages/shop/ShopLayout.jsx src/pages/shop/Home.jsx src/pages/shop/Category.jsx src/pages/shop/shopBrowse.test.jsx src/styleContract.test.js
git commit -m "feat: redesign shop browse experience"
```

---

### Task 3: Product Detail Purchase Experience

**Files:**
- Modify: `src/pages/shop/Detail.jsx`
- Modify: `src/pages/shop/shopBrowse.test.jsx`

- [ ] **Step 1: Write failing detail visual contract test**

Add this test to `src/pages/shop/shopBrowse.test.jsx`:

```jsx
  it('renders product detail with glass purchase bar and touch-safe actions', async () => {
    renderShop(['/shop/detail/p-001']);

    expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();
    const purchaseBar = screen.getByTestId('detail-purchase-bar');
    expect(purchaseBar.className).toContain('backdrop-blur-md');
    expect(purchaseBar.className).toContain('bg-white/80');
    expect(screen.getByRole('button', { name: '收藏' }).className).toContain('h-11');
    expect(screen.getByRole('button', { name: '加入购物车' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '立即购买' })).toBeEnabled();
  });
```

- [ ] **Step 2: Run detail test and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx -t "renders product detail with glass purchase bar"
```

Expected: fail because `data-testid="detail-purchase-bar"` and touch-safe favorite class are not implemented.

- [ ] **Step 3: Refactor `Detail.jsx`**

Use `IconButton`, `GlassBar`, `IOSCard`, `QuantityStepper`, `StatusTag`, and `ShopIcon`. Keep current state logic exactly: `resolveUserId`, `handleAddToCart`, `handleToggleFavorite`, disabled conditions, and messages.

Replace the return block with this structure:

```jsx
  return (
    <main className="space-y-5 px-5 pb-32 pt-5">
      <section className="overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-[#FBFCFA] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="relative aspect-[4/5] bg-slate-100">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <div className="absolute left-4 top-4">
            <StatusTag status={product.status} />
          </div>
          <div className="absolute right-4 top-4">
            <IconButton
              ariaLabel={isFavorite ? '取消收藏' : '收藏'}
              icon={isFavorite ? 'heartFilled' : 'heart'}
              onClick={handleToggleFavorite}
              className="bg-white/80 backdrop-blur-md"
            />
          </div>
          {!isOnline ? (
            <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-slate-950/88 px-4 py-3 text-center text-sm font-bold text-white">
              商品已下架
            </div>
          ) : null}
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="text-3xl font-black tracking-tight text-slate-950">¥{product.price}</p>
            <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-950">{product.name}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{product.description}</p>
          </div>

          <IOSCard className="space-y-4 p-4 shadow-none">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-950">规格</p>
                <p className="mt-1 text-sm text-slate-500">{selectedSku?.name || '暂无规格'}</p>
              </div>
              <p className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">库存 {selectedSku?.stock || 0}</p>
            </div>
            {unavailableMessage ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                {unavailableMessage}
              </p>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">数量</span>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={selectedSku?.stock || 1}
                disabled={!canPurchase}
              />
            </div>
          </IOSCard>

          {message ? (
            <p className="rounded-2xl bg-[#E7F3F4] px-4 py-3 text-center text-sm font-bold text-[#1F6F8B]">
              {message}
            </p>
          ) : null}
        </div>
      </section>

      <GlassBar
        className="fixed inset-x-0 bottom-24 z-30 mx-auto flex max-w-md items-center gap-3 rounded-[2rem] px-4 py-3"
        data-testid="detail-purchase-bar"
      >
        <IconButton ariaLabel={isFavorite ? '取消收藏' : '收藏'} icon={isFavorite ? 'heartFilled' : 'heart'} onClick={handleToggleFavorite} />
        <button
          type="button"
          disabled={!canPurchase || isSubmitting}
          onClick={handleAddToCart}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#1F6F8B] px-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(31,111,139,0.28)] transition hover:bg-[#185C74] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <ShopIcon name="bag" className="h-5 w-5" />
          加入购物车
        </button>
        <button
          type="button"
          disabled={!canPurchase}
          onClick={() => navigate('/shop/create-order')}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <ShopIcon name="check" className="h-5 w-5" />
          立即购买
        </button>
      </GlassBar>
    </main>
  );
```

Implementation note: `GlassBar` currently does not pass unknown props. Update `GlassBar.jsx` to accept `...props`:

```jsx
export function GlassBar({ as: Component = 'div', children, className = '', ...props }) {
  return (
    <Component
      className={`border border-white/70 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-md ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
```

- [ ] **Step 4: Run detail tests**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx
```

Expected: pass.

- [ ] **Step 5: Commit detail redesign**

Run:

```bash
git add src/components/shop/GlassBar.jsx src/pages/shop/Detail.jsx src/pages/shop/shopBrowse.test.jsx
git commit -m "feat: redesign shop product detail"
```

---

### Task 4: Cart And Checkout Flow

**Files:**
- Modify: `src/pages/shop/Cart.jsx`
- Modify: `src/pages/shop/CreateOrder.jsx`
- Modify: `src/pages/shop/shopFlow.test.jsx`

- [ ] **Step 1: Write failing cart and checkout visual tests**

Add assertions to the `creates an order from selected cart items and pays it` test in `src/pages/shop/shopFlow.test.jsx` after `renderRoutes(['/shop/cart']);`:

```jsx
const checkoutBar = await screen.findByTestId('cart-checkout-bar');
expect(checkoutBar.className).toContain('backdrop-blur-md');
expect(checkoutBar.className).toContain('bg-white/80');
expect(screen.getByRole('button', { name: /选择 曜石无线降噪耳机/ }).className).toContain('h-11');
expect(screen.getByRole('button', { name: /删除 曜石无线降噪耳机/ }).className).toContain('h-11');
```

After navigation to create order and before typing remark:

```jsx
expect(screen.getByTestId('create-order-submit-bar').className).toContain('backdrop-blur-md');
expect(screen.getByText('默认地址')).toBeInTheDocument();
```

- [ ] **Step 2: Run transaction flow test and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopFlow.test.jsx -t "creates an order from selected cart items and pays it"
```

Expected: fail because cart and create-order test ids and icon buttons are not implemented.

- [ ] **Step 3: Refactor `Cart.jsx`**

Keep state functions `refreshCart`, `updateQuantity`, `toggleSelected`, `toggleAll`, and `removeItem`. Replace visual structure with:

```jsx
return (
  <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F6] px-4 pb-32 pt-6 text-slate-900">
    <header className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1F6F8B]">Cart</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">购物车</h1>
      <p className="mt-2 text-sm font-semibold text-slate-500">已选 {summary.totalQuantity} 件</p>
    </header>

    {items.length === 0 ? (
      <div className="mt-6">
        <EmptyState title="购物车还是空的" description="先挑选一件心仪商品，再回来结算。" actionText="返回首页" actionTo="/shop" icon="bag" />
      </div>
    ) : (
      <section className="mt-6 space-y-4">
        <button
          type="button"
          onClick={() => toggleAll(!allSelected)}
          className="flex min-h-14 w-full items-center gap-3 rounded-3xl border border-slate-200 bg-[#fbfcfa] px-5 py-4 text-left text-sm font-bold shadow-sm"
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-full ${allSelected ? 'bg-[#1F6F8B] text-white' : 'bg-slate-100 text-slate-400'}`}>
            <ShopIcon name="check" className="h-5 w-5" />
          </span>
          全选
        </button>

        {enrichedItems.map((item) => (
          <article
            key={item.id}
            className="rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-4 shadow-[0_18px_48px_rgba(24,36,51,0.08)]"
          >
            <div className="flex gap-4">
              <button
                type="button"
                aria-label={`选择 ${item.product?.name || item.productId}`}
                onClick={() => toggleSelected(item.id, !item.selected)}
                className={`mt-8 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.selected ? 'bg-[#1F6F8B] text-white' : 'bg-slate-100 text-slate-400'}`}
              >
                <ShopIcon name="check" className="h-5 w-5" />
              </button>
              {item.product ? (
                <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-3xl object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold leading-6 text-slate-950">{item.product?.name || item.productId}</h2>
                <p className="mt-1 text-sm text-slate-500">{item.sku?.name || item.skuId}</p>
                <p className="mt-3 text-lg font-black text-slate-950">¥{item.sku?.price || 0}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <QuantityStepper value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
              <IconButton ariaLabel={`删除 ${item.product?.name || item.productId}`} icon="trash" onClick={() => removeItem(item.id)} />
            </div>
          </article>
        ))}

        <GlassBar
          className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md rounded-[2rem] p-4"
          data-testid="cart-checkout-bar"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">已选 {summary.totalQuantity} 件</p>
              <p className="mt-1 text-2xl font-black text-slate-950">¥{summary.totalAmount}</p>
            </div>
            <Link
              to="/shop/create-order"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2"
            >
              <ShopIcon name="check" className="h-5 w-5" />
              去结算
            </Link>
          </div>
        </GlassBar>
      </section>
    )}
  </main>
);
```

Add imports:

```jsx
import { GlassBar } from '../../components/shop/GlassBar.jsx';
import { IconButton } from '../../components/shop/IconButton.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
```

- [ ] **Step 4: Refactor `CreateOrder.jsx`**

Add imports:

```jsx
import { GlassBar } from '../../components/shop/GlassBar.jsx';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
```

Keep `submitOrder` unchanged. Replace visual structure with card stack and add:

```jsx
<GlassBar
  as="div"
  className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md rounded-t-[2rem] p-4"
  data-testid="create-order-submit-bar"
>
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-bold text-slate-500">应付金额</p>
      <p className="mt-1 text-2xl font-black text-slate-950">¥{totalAmount}</p>
    </div>
    <button
      type="submit"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2"
    >
      <ShopIcon name="check" className="h-5 w-5" />
      提交订单
    </button>
  </div>
</GlassBar>
```

Ensure this `GlassBar` is inside `<form onSubmit={submitOrder}>` so `type="submit"` still triggers order creation. Keep label text `订单备注` exactly on the textarea label.

- [ ] **Step 5: Run transaction flow tests**

Run:

```bash
npm run test -- src/pages/shop/shopFlow.test.jsx
```

Expected: pass.

- [ ] **Step 6: Commit cart and checkout**

Run:

```bash
git add src/pages/shop/Cart.jsx src/pages/shop/CreateOrder.jsx src/pages/shop/shopFlow.test.jsx
git commit -m "feat: redesign shop cart checkout flow"
```

---

### Task 5: Account, Orders, Address, Favorites, Login, And Payment Polish

**Files:**
- Modify: `src/pages/shop/UserPage.jsx`
- Modify: `src/pages/shop/AddressPage.jsx`
- Modify: `src/pages/shop/FavoritesPage.jsx`
- Modify: `src/pages/shop/LoginPage.jsx`
- Modify: `src/pages/shop/Pay.jsx`
- Modify: `src/pages/shop/PaySuccess.jsx`
- Modify: `src/pages/shop/OrderListPage.jsx`
- Modify: `src/pages/shop/OrderDetailPage.jsx`
- Modify: `src/pages/shop/shopFlow.test.jsx`

- [ ] **Step 1: Write failing account/order visual tests**

In `src/pages/shop/shopFlow.test.jsx`, extend `renders user center entries and order list filter`:

```jsx
expect(screen.getByText('1280')).toBeInTheDocument();
expect(screen.getByText('优惠券')).toBeInTheDocument();
expect(screen.getByText('最近订单')).toBeInTheDocument();
expect(screen.getByRole('link', { name: /我的订单/ })).toHaveAttribute('href', '/shop/orders');
```

After `renderRoutes(['/shop/orders']);`, add:

```jsx
expect(screen.getByRole('button', { name: '已支付' }).className).toContain('min-h-11');
```

In `manages address and favorites pages`, after opening address page:

```jsx
expect(screen.getByRole('button', { name: '新增地址' }).className).toContain('h-11');
```

In `shows shipment logistics after admin service ships order`, after logistics assertions:

```jsx
expect(screen.getByTestId('order-logistics-timeline')).toBeInTheDocument();
```

- [ ] **Step 2: Run account/order tests and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopFlow.test.jsx
```

Expected: fail because metric tiles, recent orders, address icon button class, and logistics timeline test id are not implemented.

- [ ] **Step 3: Refactor `UserPage.jsx`**

Use:

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { MetricTile } from '../../components/shop/MetricTile.jsx';
import { SettingRow } from '../../components/shop/SettingRow.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { authService, favoriteService, orderService } from '../../mock/mockService.js';
```

Compute:

```jsx
const orders = user ? orderService.listOrdersSync(user.id) : [];
const favorites = user ? favoriteService.listFavoritesSync(user.id) : [];
```

Render identity card, metrics:

```jsx
<div className="mt-6 grid grid-cols-4 gap-3">
  <MetricTile icon="star" label="积分" value="1280" />
  <MetricTile icon="coupon" label="优惠券" value="3" tone="amber" />
  <MetricTile icon="heart" label="收藏" value={favorites.length} tone="sky" />
  <MetricTile icon="receipt" label="订单" value={orders.length} tone="emerald" />
</div>
```

Render recent order preview with heading `最近订单`, then `SettingRow` entries for `我的订单`, `我的收藏`, `地址管理`, and logout button row.

- [ ] **Step 4: Refactor orders and logistics pages**

`OrderListPage.jsx`:
- Add `ShopIcon`.
- Change `FILTERS` to include `icon`.
- Buttons use `inline-flex min-h-11`.
- Cards include chevron icon.
- Keep button names equal to status labels.

`OrderDetailPage.jsx`:
- Add `data-testid="order-logistics-timeline"` to the logistics entries wrapper.
- Use `StatusTag`, `IOSCard`, and `ShopIcon`.
- Keep text `订单详情`, `已发货`, `顺丰速运`, and tracking number visible.

- [ ] **Step 5: Refactor address, favorites, login, pay, and success pages**

`AddressPage.jsx`:
- Top add action remains a `<button>` with accessible name `新增地址` and class containing `h-11 w-11`.
- Keep form labels exactly: `收货人`, `手机号`, `省份`, `城市`, `详细地址`.
- Keep button text `保存地址`.
- Icon-only address actions use aria labels `设置默认`, `编辑地址`, and `删除`.
- Existing logged-out error `请先登录后管理收货地址` and link `去登录` remain.

`FavoritesPage.jsx`:
- Keep heading `我的收藏`.
- Product name link remains.
- Cancel action accessible name remains `取消收藏`.

`LoginPage.jsx`:
- Keep heading `前台登录`.
- Keep button text `使用测试会员登录`.

`Pay.jsx`:
- Keep heading `模拟支付`.
- Keep countdown text `支付倒计时`.
- Keep disabled button text `确认已支付`.
- Add visual payment panel using `ShopIcon name="receipt"`.

`PaySuccess.jsx`:
- Keep heading `支付成功`.
- Keep links `查看订单详情` and `继续逛逛`.

- [ ] **Step 6: Run flow tests**

Run:

```bash
npm run test -- src/pages/shop/shopFlow.test.jsx
```

Expected: pass.

- [ ] **Step 7: Commit account and order polish**

Run:

```bash
git add src/pages/shop/UserPage.jsx src/pages/shop/AddressPage.jsx src/pages/shop/FavoritesPage.jsx src/pages/shop/LoginPage.jsx src/pages/shop/Pay.jsx src/pages/shop/PaySuccess.jsx src/pages/shop/OrderListPage.jsx src/pages/shop/OrderDetailPage.jsx src/pages/shop/shopFlow.test.jsx
git commit -m "feat: redesign shop account order pages"
```

---

### Task 6: Final Verification And Contract Cleanup

**Files:**
- Modify only files required by failing checks discovered in this task.

- [ ] **Step 1: Run full test suite**

Run:

```bash
npm run test
```

Expected: all test files pass. Existing JSDOM pseudo-element warnings can appear if exit code is `0`.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code `0`.

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: exit code `0`. Vite chunk-size warning is acceptable if build succeeds.

- [ ] **Step 4: Run assignment check**

Run:

```bash
node tool/check.cjs
```

Expected: exit code `0`.

- [ ] **Step 5: Inspect git status**

Run:

```bash
git status --short --branch
```

Expected: only intentional implementation files are modified or no tracked changes remain after commits. Do not add `.superpowers/`, `AGENT_PIPELINE_SUPERPOWERS.md`, `design.md`, `prompt.md`, or `task_ui.md`.

- [ ] **Step 6: Commit verification fixes if needed**

If Step 1-4 required source changes, commit only those source/test files:

```bash
git add <exact changed source and test files>
git commit -m "fix: stabilize shop ios redesign verification"
```

If no source changes were needed, do not create an empty commit.

## Self-Review Notes
- Spec coverage: Tasks 1-5 cover shared primitives, `ShopLayout`, `Home`, `Category`, `Detail`, `Cart`, `CreateOrder`, `Pay`, `PaySuccess`, `OrderListPage`, `OrderDetailPage`, `UserPage`, `AddressPage`, `FavoritesPage`, and `LoginPage`.
- README coverage: `Home` search/carousel/hot products are in Task 2; category index is in Task 2; cart and checkout are in Task 4; user/orders/address/favorites/pay/order detail are in Task 5.
- Data consistency: no task changes `STORAGE_KEYS`, mock service return shapes, or route paths.
- Dependency consistency: no task adds a package.
- Verification: Task 6 runs `npm run test`, `npm run lint`, `npm run build`, and `node tool/check.cjs`.
