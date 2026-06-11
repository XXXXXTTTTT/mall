# Shop HIG Navigation Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct `/shop` to a standard mobile app hierarchy: four primary tabs keep the bottom Dock, all secondary pages use a sticky glass Navigation Bar with a back button, and order detail typography gains a clearer reading rhythm.

**Architecture:** Add one focused `ShopNavigationBar` primitive and one route-level bottom Dock visibility rule in `ShopLayout.jsx`. Then attach the same navigation primitive to every secondary `/shop` page and tighten order detail text classes without changing mock services, routes, storage keys, or commerce behavior.

**Tech Stack:** React 18, React Router 6, Tailwind CSS 4 utility classes in JSX, Vitest, Testing Library, existing shop primitives in `src/components/shop`.

---

## Inputs And Constraints
- User requirement source: `task-ui2.md`.
- Existing visual spec source: `docs/superpowers/specs/2026-06-11-shop-ios-icon-redesign.md`.
- Existing implementation plan source: `docs/superpowers/plans/2026-06-11-shop-ios-icon-redesign-plan.md`.
- Apple HIG source requested by the user: `https://developer.apple.com/cn/design/human-interface-guidelines/designing-for-ios/`.
- Apple HIG tab/navigation references used for this plan:
  - `https://developer.apple.com/design/human-interface-guidelines/tab-bars`
  - `https://developer.apple.com/design/human-interface-guidelines/toolbars`
- Worktree source of truth: `d:\轻量化\mall\.worktrees\shop-ios-icon-redesign`.
- Do not edit main-branch files for this phase.
- Do not add a package.
- Do not add a `localStorage` key.
- Do not change route paths, service method names, mock return shapes, or existing commerce semantics.
- Keep comments in Chinese when implementation comments are needed.

## File Structure

### Create
- `src/components/shop/ShopNavigationBar.jsx`: sticky iOS-style page navigation bar for secondary shop pages.

### Modify
- `src/components/shop/ShopIcon.jsx`: add exact `chevronLeft` icon key.
- `src/components/shop/shopComponents.test.jsx`: test the new navigation primitive and left chevron icon.
- `src/pages/shop/ShopLayout.jsx`: hide bottom Dock outside the four primary tab paths.
- `src/pages/shop/shopBrowse.test.jsx`: verify bottom Dock visibility and detail page navigation.
- `src/pages/shop/shopFlow.test.jsx`: verify navigation bars on transaction, account, order, address, favorites, and auth secondary pages.
- `src/pages/shop/Detail.jsx`: add top navigation and move purchase bar above the screen bottom, not above a hidden Dock.
- `src/pages/shop/CreateOrder.jsx`: add top navigation.
- `src/pages/shop/Pay.jsx`: add top navigation in all return branches.
- `src/pages/shop/PaySuccess.jsx`: add top navigation.
- `src/pages/shop/OrderListPage.jsx`: add top navigation.
- `src/pages/shop/OrderDetailPage.jsx`: add top navigation and typography classes.
- `src/pages/shop/AddressPage.jsx`: add top navigation.
- `src/pages/shop/FavoritesPage.jsx`: add top navigation.
- `src/pages/shop/LoginPage.jsx`: add top navigation.
- `src/styleContract.test.js`: lock source-level HIG glass and typography contracts.

## Route Contract

Bottom Dock remains visible only on these primary routes:
- `/shop`
- `/shop/category`
- `/shop/cart`
- `/shop/user`

Bottom Dock is hidden on these secondary routes:
- `/shop/detail/:productId`
- `/shop/create-order`
- `/shop/pay/:orderId`
- `/shop/pay-success/:orderId`
- `/shop/orders`
- `/shop/orders/:orderId`
- `/shop/address`
- `/shop/favorites`
- `/shop/login`

Navigation Bar titles:
- `Detail.jsx`: `商品详情`
- `CreateOrder.jsx`: `确认订单`
- `Pay.jsx`: `模拟支付`
- `PaySuccess.jsx`: `支付成功`
- `OrderListPage.jsx`: `订单列表`
- `OrderDetailPage.jsx`: `订单详情`
- `AddressPage.jsx`: `收货地址`
- `FavoritesPage.jsx`: `我的收藏`
- `LoginPage.jsx`: `前台登录`

---

### Task 1: Shared Shop Navigation Primitive

**Files:**
- Create: `src/components/shop/ShopNavigationBar.jsx`
- Modify: `src/components/shop/ShopIcon.jsx`
- Modify: `src/components/shop/shopComponents.test.jsx`

- [ ] **Step 1: Write the failing component tests**

Update imports in `src/components/shop/shopComponents.test.jsx`:

```jsx
import { ShopNavigationBar } from './ShopNavigationBar.jsx';
```

Add this test inside `describe('shop shared components', () => { ... })`:

```jsx
  it('renders a HIG-style navigation bar with a back action', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <MemoryRouter>
        <ShopNavigationBar title="订单详情" onBack={onBack} />
      </MemoryRouter>,
    );

    const bar = screen.getByTestId('shop-navigation-bar');
    expect(bar).toHaveTextContent('订单详情');
    expect(bar.className).toContain('backdrop-blur-md');
    expect(bar.className).toContain('bg-white/85');
    expect(bar.className).toContain('border-b');
    expect(bar.className).toContain('border-neutral-100/60');

    const backButton = screen.getByTestId('shop-back-button');
    expect(backButton).toHaveAccessibleName('返回');
    expect(backButton.className).toContain('h-11');
    expect(backButton.className).toContain('w-11');

    await user.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders the shop left chevron icon key', () => {
    const { container } = render(<ShopIcon name="chevronLeft" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('path')).toHaveAttribute('d', 'm15 5-7 7 7 7');
  });
```

- [ ] **Step 2: Run the component test and verify failure**

Run:

```bash
npm run test -- src/components/shop/shopComponents.test.jsx
```

Expected: fail because `ShopNavigationBar.jsx` does not exist and `ShopIcon` does not contain `chevronLeft`.

- [ ] **Step 3: Add `chevronLeft` to `ShopIcon.jsx`**

In `src/components/shop/ShopIcon.jsx`, add this exact key next to the existing `chevronRight` key:

```jsx
  chevronLeft: <path d="m15 5-7 7 7 7" />,
```

- [ ] **Step 4: Create `ShopNavigationBar.jsx`**

Create `src/components/shop/ShopNavigationBar.jsx`:

```jsx
import { useNavigate } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

export function ShopNavigationBar({ title, onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <header
      data-testid="shop-navigation-bar"
      className="sticky top-0 z-40 flex min-h-16 items-center justify-center border-b border-neutral-100/60 bg-white/85 px-4 text-slate-950 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="返回"
        data-testid="shop-back-button"
        onClick={handleBack}
        className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <ShopIcon name="chevronLeft" className="h-6 w-6" />
      </button>
      <h1 className="max-w-[14rem] truncate text-base font-bold tracking-wide text-slate-950">{title}</h1>
    </header>
  );
}
```

- [ ] **Step 5: Run the component test and verify pass**

Run:

```bash
npm run test -- src/components/shop/shopComponents.test.jsx
```

Expected: pass.

- [ ] **Step 6: Commit shared navigation primitive**

Run:

```bash
git add src/components/shop/ShopNavigationBar.jsx src/components/shop/ShopIcon.jsx src/components/shop/shopComponents.test.jsx
git commit -m "feat: add shop navigation bar"
```

---

### Task 2: Route-Aware Bottom Dock Visibility

**Files:**
- Modify: `src/pages/shop/ShopLayout.jsx`
- Modify: `src/pages/shop/shopBrowse.test.jsx`

- [ ] **Step 1: Write the failing layout visibility test**

In `src/pages/shop/shopBrowse.test.jsx`, update the import from React Router:

```jsx
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
```

Add this helper above `beforeEach`:

```jsx
function renderShopShell(initialEntries) {
  const router = createMemoryRouter(
    [
      {
        path: '/shop',
        element: <ShopLayout />,
        children: [
          { index: true, element: <div>首页桩</div> },
          { path: 'category', element: <div>分类桩</div> },
          { path: 'cart', element: <div>购物车桩</div> },
          { path: 'user', element: <div>我的桩</div> },
          { path: 'detail/:productId', element: <div>商品详情桩</div> },
          { path: 'create-order', element: <div>确认订单桩</div> },
          { path: 'pay/:orderId', element: <div>模拟支付桩</div> },
          { path: 'pay-success/:orderId', element: <div>支付成功桩</div> },
          { path: 'orders', element: <div>订单列表桩</div> },
          { path: 'orders/:orderId', element: <div>订单详情桩</div> },
          { path: 'address', element: <div>收货地址桩</div> },
          { path: 'favorites', element: <div>我的收藏桩</div> },
          { path: 'login', element: <div>前台登录桩</div> },
        ],
      },
    ],
    { initialEntries },
  );

  return render(<RouterProvider router={router} />);
}
```

Add this test inside `describe('shop browse pages', () => { ... })`:

```jsx
  it('shows the bottom Dock only on primary shop tab routes', () => {
    const primaryPaths = ['/shop', '/shop/category', '/shop/cart', '/shop/user'];
    const secondaryPaths = [
      '/shop/detail/p-001',
      '/shop/create-order',
      '/shop/pay/ORD_202606010001',
      '/shop/pay-success/ORD_202606010001',
      '/shop/orders',
      '/shop/orders/ORD_202606010001',
      '/shop/address',
      '/shop/favorites',
      '/shop/login',
    ];

    primaryPaths.forEach((path) => {
      const view = renderShopShell([path]);
      expect(screen.getByTestId('shop-bottom-dock')).toBeInTheDocument();
      view.unmount();
    });

    secondaryPaths.forEach((path) => {
      const view = renderShopShell([path]);
      expect(screen.queryByTestId('shop-bottom-dock')).not.toBeInTheDocument();
      view.unmount();
    });
  });
```

- [ ] **Step 2: Run the layout visibility test and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx -t "shows the bottom Dock only on primary shop tab routes"
```

Expected: fail because `ShopLayout.jsx` currently renders `data-testid="shop-bottom-dock"` on every `/shop` route.

- [ ] **Step 3: Refactor `ShopLayout.jsx`**

Replace the first import in `src/pages/shop/ShopLayout.jsx`:

```jsx
import { NavLink, Outlet, useLocation } from 'react-router-dom';
```

Add these constants after `navItems`:

```jsx
const primaryShopPaths = new Set(['/shop', '/shop/category', '/shop/cart', '/shop/user']);

function normalizePathname(pathname) {
  if (pathname === '/shop/') return '/shop';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}
```

Replace the `ShopLayout` function body with this exact structure:

```jsx
export function ShopLayout() {
  const location = useLocation();
  const showBottomDock = primaryShopPaths.has(normalizePathname(location.pathname));

  return (
    <div className={`min-h-screen bg-[#F7F8F6] text-slate-900 ${showBottomDock ? 'pb-24' : ''}`}>
      <div className="mx-auto min-h-screen max-w-md bg-[#FBFCFA] shadow-[0_0_80px_rgba(15,23,42,0.08)]">
        <Outlet />
      </div>
      {showBottomDock ? (
        <nav
          aria-label="前台主导航"
          data-testid="shop-bottom-dock"
          className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t border-white/80 bg-white/80 px-4 py-3 shadow-[0_-16px_40px_rgba(15,23,42,0.1)] backdrop-blur-md"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/shop'}
              className={({ isActive }) =>
                [
                  'flex min-h-11 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition',
                  isActive ? 'bg-[#E7F3F4] text-[#1F6F8B]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <ShopIcon name={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run the layout tests and verify pass**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx -t "shows the bottom Dock only on primary shop tab routes"
```

Expected: pass.

- [ ] **Step 5: Commit route-aware Dock behavior**

Run:

```bash
git add src/pages/shop/ShopLayout.jsx src/pages/shop/shopBrowse.test.jsx
git commit -m "fix: hide shop dock on secondary routes"
```

---

### Task 3: Secondary Page Navigation Coverage

**Files:**
- Modify: `src/pages/shop/shopBrowse.test.jsx`
- Modify: `src/pages/shop/shopFlow.test.jsx`
- Modify: `src/pages/shop/Detail.jsx`
- Modify: `src/pages/shop/CreateOrder.jsx`
- Modify: `src/pages/shop/Pay.jsx`
- Modify: `src/pages/shop/PaySuccess.jsx`
- Modify: `src/pages/shop/OrderListPage.jsx`
- Modify: `src/pages/shop/OrderDetailPage.jsx`
- Modify: `src/pages/shop/AddressPage.jsx`
- Modify: `src/pages/shop/FavoritesPage.jsx`
- Modify: `src/pages/shop/LoginPage.jsx`

- [ ] **Step 1: Write failing navigation assertions for browse pages**

In `src/pages/shop/shopBrowse.test.jsx`, add this helper above `beforeEach`:

```jsx
function expectLatestNavigationTitle(title) {
  const bars = screen.getAllByTestId('shop-navigation-bar');
  expect(bars[bars.length - 1]).toHaveTextContent(title);
}
```

In the `renders product detail with glass purchase bar and touch-safe actions` test, after `expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();`, add:

```jsx
    expectLatestNavigationTitle('商品详情');
    expect(screen.getByTestId('shop-back-button')).toHaveAccessibleName('返回');
```

In the `prepares the current product when buying immediately from detail` test, after the wait for `确认订单`, add:

```jsx
    expectLatestNavigationTitle('确认订单');
```

- [ ] **Step 2: Write failing navigation assertions for flow pages**

In `src/pages/shop/shopFlow.test.jsx`, add this helper above `beforeEach`:

```jsx
function expectLatestNavigationTitle(title) {
  const bars = screen.getAllByTestId('shop-navigation-bar');
  expect(bars[bars.length - 1]).toHaveTextContent(title);
  expect(screen.getAllByTestId('shop-back-button').at(-1)).toHaveAccessibleName('返回');
}
```

In the `creates an order from selected cart items and pays it` test:

After `await waitFor(() => expect(screen.getByText('确认订单')).toBeInTheDocument());`, add:

```jsx
    expectLatestNavigationTitle('确认订单');
```

After `await waitFor(() => expect(screen.getByText('模拟支付')).toBeInTheDocument());`, add:

```jsx
    expectLatestNavigationTitle('模拟支付');
```

After `await waitFor(() => expect(screen.getByText('支付成功')).toBeInTheDocument());`, add:

```jsx
    expectLatestNavigationTitle('支付成功');
```

In the `shows shipment logistics after admin service ships order` test, after `expect(await screen.findByText('订单详情')).toBeInTheDocument();`, add:

```jsx
    expectLatestNavigationTitle('订单详情');
```

In the `manages address and favorites pages` test, after `expect(await screen.findByText('地址管理')).toBeInTheDocument();`, add:

```jsx
    expectLatestNavigationTitle('收货地址');
```

After `expect(await screen.findByText('我的收藏')).toBeInTheDocument();`, add:

```jsx
    expectLatestNavigationTitle('我的收藏');
```

In the `guards address actions when no user session exists` test, after `expect(await screen.findByText('地址管理')).toBeInTheDocument();`, add:

```jsx
    expectLatestNavigationTitle('收货地址');
```

In the `renders user center entries and order list filter` test, after `expect(await screen.findByText('订单列表')).toBeInTheDocument();`, add:

```jsx
    expectLatestNavigationTitle('订单列表');
```

Add this new test inside `describe('shop transaction flow pages', () => { ... })`:

```jsx
  it('renders top navigation on standalone login page', async () => {
    authService.logoutUser();

    renderRoutes(['/shop/login']);

    expect(await screen.findByText('前台登录')).toBeInTheDocument();
    expectLatestNavigationTitle('前台登录');
  });
```

Update `renderRoutes` route definitions to include login:

```jsx
      { path: '/shop/login', element: <LoginPage /> },
```

Update imports in `src/pages/shop/shopFlow.test.jsx`:

```jsx
import { LoginPage } from './LoginPage.jsx';
```

- [ ] **Step 3: Run navigation tests and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx src/pages/shop/shopFlow.test.jsx
```

Expected: fail because secondary pages do not render `data-testid="shop-navigation-bar"` yet.

- [ ] **Step 4: Add `ShopNavigationBar` to all secondary pages**

In each file below, add the import:

```jsx
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
```

Add the component immediately before each page's `<main>` element. The return shape must be a fragment:

```jsx
return (
  <>
    <ShopNavigationBar title="页面标题" />
    <main className="existing classes">
      existing content
    </main>
  </>
);
```

Use these exact titles:

```jsx
<ShopNavigationBar title="商品详情" />
<ShopNavigationBar title="确认订单" />
<ShopNavigationBar title="模拟支付" />
<ShopNavigationBar title="支付成功" />
<ShopNavigationBar title="订单列表" />
<ShopNavigationBar title="订单详情" />
<ShopNavigationBar title="收货地址" />
<ShopNavigationBar title="我的收藏" />
<ShopNavigationBar title="前台登录" />
```

Apply the title mapping to these files:
- `src/pages/shop/Detail.jsx`: `商品详情`
- `src/pages/shop/CreateOrder.jsx`: `确认订单`
- `src/pages/shop/Pay.jsx`: `模拟支付`
- `src/pages/shop/PaySuccess.jsx`: `支付成功`
- `src/pages/shop/OrderListPage.jsx`: `订单列表`
- `src/pages/shop/OrderDetailPage.jsx`: `订单详情`
- `src/pages/shop/AddressPage.jsx`: `收货地址`
- `src/pages/shop/FavoritesPage.jsx`: `我的收藏`
- `src/pages/shop/LoginPage.jsx`: `前台登录`

For pages with early returns, include `ShopNavigationBar` in every returned branch. `Pay.jsx`, `OrderDetailPage.jsx`, and `Detail.jsx` have early returns that must be updated.

- [ ] **Step 5: Move the detail purchase bar to the true screen bottom**

In `src/pages/shop/Detail.jsx`, change the main wrapper class from:

```jsx
<main className="space-y-6 px-5 pb-44 pt-6">
```

to:

```jsx
<main className="space-y-6 px-5 pb-32 pt-5">
```

In the `GlassBar` with `data-testid="detail-purchase-bar"`, change:

```jsx
className="fixed inset-x-0 bottom-24 z-20 mx-auto grid max-w-md grid-cols-[auto_1fr_1fr] gap-3 px-5 py-4"
```

to:

```jsx
className="fixed inset-x-4 bottom-4 z-30 mx-auto grid max-w-md grid-cols-[auto_1fr_1fr] gap-3 px-4 py-3"
```

- [ ] **Step 6: Run navigation tests and verify pass**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx src/pages/shop/shopFlow.test.jsx
```

Expected: pass.

- [ ] **Step 7: Commit secondary page navigation**

Run:

```bash
git add src/pages/shop/Detail.jsx src/pages/shop/CreateOrder.jsx src/pages/shop/Pay.jsx src/pages/shop/PaySuccess.jsx src/pages/shop/OrderListPage.jsx src/pages/shop/OrderDetailPage.jsx src/pages/shop/AddressPage.jsx src/pages/shop/FavoritesPage.jsx src/pages/shop/LoginPage.jsx src/pages/shop/shopBrowse.test.jsx src/pages/shop/shopFlow.test.jsx
git commit -m "fix: add shop secondary navigation"
```

---

### Task 4: Order Detail Typography Contract

**Files:**
- Modify: `src/pages/shop/OrderDetailPage.jsx`
- Modify: `src/styleContract.test.js`

- [ ] **Step 1: Write the failing style contract test**

In `src/styleContract.test.js`, extend `keeps shop glass and touch target contracts in source` with:

```js
    const navigationBar = readFileSync(resolve('src/components/shop/ShopNavigationBar.jsx'), 'utf-8');
    const orderDetail = readFileSync(resolve('src/pages/shop/OrderDetailPage.jsx'), 'utf-8');

    expect(navigationBar).toContain('backdrop-blur-md');
    expect(navigationBar).toContain('bg-white/85');
    expect(navigationBar).toContain('border-b border-neutral-100/60');
    expect(orderDetail).toContain('tracking-wide');
    expect(orderDetail).toContain('leading-relaxed');
```

- [ ] **Step 2: Run the style contract test and verify failure**

Run:

```bash
npm run test -- src/styleContract.test.js
```

Expected: fail because `OrderDetailPage.jsx` does not yet contain both `tracking-wide` and `leading-relaxed`.

- [ ] **Step 3: Apply order detail typography classes**

In `src/pages/shop/OrderDetailPage.jsx`, update the order id paragraph:

```jsx
<p className="mt-4 break-all text-sm font-semibold leading-relaxed tracking-wide text-slate-500">{order.id}</p>
```

Update each product snapshot text block:

```jsx
<p className="text-base font-bold leading-relaxed tracking-wide text-slate-950">{item.productName}</p>
<p className="mt-1 text-sm leading-relaxed tracking-wide text-slate-500">
  {item.skuName} × {item.quantity}
</p>
<p className="mt-2 text-lg font-bold tracking-wide text-slate-950">¥{item.price * item.quantity}</p>
```

Update address text:

```jsx
<p className="mt-3 font-bold leading-relaxed tracking-wide text-slate-950">
  {order.addressSnapshot.receiver} {order.addressSnapshot.phone}
</p>
<p className="mt-1 text-sm leading-relaxed tracking-wide text-slate-500">
  {order.addressSnapshot.province} {order.addressSnapshot.city} {order.addressSnapshot.detail}
</p>
```

Update payment and logistics text:

```jsx
<span className="text-2xl font-bold tracking-wide text-slate-950">¥{order.totalAmount}</span>
{order.paidAt ? <p className="mt-2 text-sm leading-relaxed tracking-wide text-slate-500">支付时间 {order.paidAt}</p> : null}
```

```jsx
<p className="font-bold leading-relaxed tracking-wide text-slate-950">{item.company}</p>
<p className="mt-1 break-all text-sm font-semibold leading-relaxed tracking-wide text-slate-500">{item.trackingNo}</p>
<p className="mt-1 text-xs leading-relaxed tracking-wide text-slate-400">{item.shippedAt}</p>
```

- [ ] **Step 4: Run style contract and flow tests**

Run:

```bash
npm run test -- src/styleContract.test.js src/pages/shop/shopFlow.test.jsx
```

Expected: pass.

- [ ] **Step 5: Commit typography contract**

Run:

```bash
git add src/pages/shop/OrderDetailPage.jsx src/styleContract.test.js
git commit -m "fix: polish shop order detail typography"
```

---

### Task 5: Final Verification

**Files:**
- Modify only files that fail verification in this task.

- [ ] **Step 1: Run full tests**

Run:

```bash
npm run test
```

Expected: all Vitest suites pass.

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

Expected: exit code `0`.

- [ ] **Step 4: Run assignment check**

Run:

```bash
npm run check
```

Expected: this command still reports missing real student metadata until `metadata.json` is filled by the user. Do not change metadata in this UI navigation phase.

- [ ] **Step 5: Inspect git status**

Run:

```bash
git status --short --branch
```

Expected tracked changes are committed for this phase. Do not add `.superpowers/`, `AGENT_PIPELINE_SUPERPOWERS.md`, `design.md`, `prompt.md`, `task-ui2.md`, or `task_ui.md`.

## Self-Review Notes
- Spec coverage: The plan covers `task-ui2.md` requirements for secondary Navigation Bar, back button, glass top bar classes, hiding bottom Dock on secondary routes, and order detail typography.
- File coverage: The plan touches every secondary `/shop` page present in `src/router.jsx`: detail, create-order, pay, pay-success, orders, order detail, address, favorites, and login.
- Route consistency: Primary routes are exactly `/shop`, `/shop/category`, `/shop/cart`, and `/shop/user`.
- Identifier consistency: The planned new test ids are exactly `shop-navigation-bar` and `shop-back-button`; the existing Dock test id remains `shop-bottom-dock`.
- Dependency consistency: The plan adds no dependency and uses the existing local SVG icon system.
- Business consistency: The plan does not alter mock services, storage keys, order creation, cart, favorite, address, login, or payment state transitions.
