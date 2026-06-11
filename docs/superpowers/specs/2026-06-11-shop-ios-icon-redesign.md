# /shop iOS Icon-Driven Redesign Design

## Summary
This design upgrades the frontend `/shop` experience from a text-heavy web mall into a mobile-first, iOS-inspired commerce app. The chosen direction is "restrained business iOS": light gray app canvas, white rounded cards, low-saturation blue-green accents, ambient shadows, glass navigation surfaces, and icon-led interaction.

The redesign must preserve every frontend requirement from `README.md` while satisfying the visual direction from `task_ui.md`. Functionality is not secondary to polish. The homepage must include a search box, carousel, and hot product section. Category must act as a complete category index. Cart, order creation, payment, order detail, and user pages must keep their current business capabilities.

## Sources And Decisions
- `README.md` is the functional contract for the assignment.
- `task_ui.md` is the visual and interaction contract for the `/shop` redesign.
- Apple Human Interface Guidelines page referenced by the user: `https://developer.apple.com/cn/design/human-interface-guidelines/designing-for-ios/`.
- Visual direction selected by the user: `A. 克制商务果味`.
- Structural approach selected by the user: `Icon Dock + Card Flow`.
- Icon implementation selected by the user: no new dependency; build a local inline SVG icon system.
- Responsive strategy selected by the user: mobile app first, desktop remains a centered `max-w-md` phone-like preview.
- Icon strategy selected by the user: icon-led UI with short text retained for primary commerce actions.

## README Functional Contract
The implementation must keep these frontend requirements visible and testable:

| Module | Required Behavior | Redesign Commitment |
| --- | --- | --- |
| 商城主页面 | 包含搜索框、轮播图、热门商品展示 | `Home.jsx` includes a glass search bar, `HeroCarousel`, and hot product grid. |
| 分类页 | 展示所有商品的分类索引 | `Category.jsx` shows an icon category index before filtered product results. |
| 购物车 | 查看加入购物车的商品，支持数量修改、删除、选中结算 | `Cart.jsx` keeps item cards, selected state, quantity stepper, delete action, and checkout bar. |
| 我的页面 | 展示用户个人信息、订单列表等 | `UserPage.jsx` shows user card, metric tiles, setting rows, and recent order preview. |
| 商品详情页 | 展示商品详细信息，可加入购物车或立即购买 | `Detail.jsx` keeps image, description, status, SKU, quantity, add to cart, and buy now. |
| 创建订单页 | 确认收货地址、商品清单，生成订单 | `CreateOrder.jsx` keeps address selection, item list, remark, total, and submit order. |
| 支付页面 | 模拟支付流程，可展示支付成功/失败 | `Pay.jsx` keeps payment status logic, countdown, disabled state, and success navigation. |
| 订单详情页 | 查看订单状态、商品信息、物流信息等 | `OrderDetailPage.jsx` keeps status, products, address, payment, and logistics cards. |

## Visual System
The frontend will use a compact design token set expressed through Tailwind classes inside JSX:

- Canvas: `bg-[#F5F7F6]`.
- Surface: `bg-white` / `bg-[#FBFCFA]` cards with rounded `2rem` to `2.25rem`.
- Primary text: dark slate, near `#102033`.
- Secondary text: slate gray with lower contrast.
- Accent: low-saturation blue-green near `#1F6F8B`.
- Soft accent backgrounds: blue-green, amber, emerald, sky, and slate at low saturation.
- Depth: ambient shadows such as `shadow-[0_18px_48px_rgba(24,36,51,0.08)]`.
- Glass: `backdrop-blur-md bg-white/80` for top bars and fixed bottom action bars.

The app must not look like a generic admin panel. It should feel calm, commercial, precise, and native-app-like.

## Core UI Components
The implementation should introduce or refactor these shop-only primitives:

- `ShopIcon`: local inline SVG icon component. It accepts a fixed `name`, `className`, and accessibility mode through surrounding controls. It must not require a new icon package.
- `IconButton`: 44px minimum interactive control for icon-only actions. It uses `aria-label` for testability and accessibility.
- `GlassBar`: reusable top/bottom glass surface using `backdrop-blur-md bg-white/80`.
- `IOSCard`: visual wrapper for rounded white cards with subtle border and ambient shadow.
- `SettingRow`: iOS settings-style row with colored left icon, bold title, description, and right chevron.
- `VisualStatusTag`: status tag with icon, label, low-saturation background, and compact shape.
- `MetricTile`: compact data tile for user metrics such as points, coupons, favorites, and order count.
- `HeroCarousel`: homepage carousel for featured products.

Every interactive primitive must provide a visible focus state and maintain at least 44px touch area using `h-11`, `w-11`, or `min-h-11`.

## Layout Architecture
`ShopLayout.jsx` remains the app shell:

- Desktop and tablet show the shop as a centered `max-w-md` mobile app preview.
- The background outside the preview remains subdued to frame the app.
- Bottom navigation becomes an icon-led Dock with four tabs: 首页, 分类, 购物车, 我的.
- Each tab uses `ShopIcon`, short label, active blue-green treatment, and 44px minimum tap target.
- The bottom Dock uses glass style: `backdrop-blur-md bg-white/80`.
- Page content uses enough bottom padding to avoid being covered by fixed bars.

## Page Designs

### Home.jsx
`Home.jsx` must include the three README-required zones:

1. Search box:
   - Top glass search capsule with search icon.
   - Placeholder remains clear enough for tests and usability.
   - Right icon button uses a discovery/filter glyph with accessible name `打开筛选`.

2. Carousel:
   - `HeroCarousel` with three featured slides sourced from existing online products.
   - Slides use product images, short headline, price, and pagination dots.
   - Carousel uses horizontal overflow snapping with pagination dots; no external carousel dependency.
   - It must remain functional without timers. Automatic rotation is not required.

3. Hot products:
   - Hot products section remains visible and testable.
   - Product grid becomes a two-column retina tile layout.
   - Product tags such as 热门, 新品, 限时特惠 use an icon-led `ProductTag`.

New products and deal sections remain below hot products and must not hide the required carousel or hot products.

### Category.jsx
The category page must visibly be a category index:

- Top section includes title/search and a two-column category index grid.
- Each category has an icon, category name, and product count.
- The `all` category is explicit.
- Sorting controls become icon-led chips for 综合, 价格升序, 价格降序, 销量优先.
- Product results stay in a two-column product grid.
- Empty state uses `EmptyState` with category-aware icon and text.

### Detail.jsx
The product detail page becomes a more immersive product screen:

- Product image occupies a large visual area.
- Top overlay controls use glass icon buttons for favorite and page-level actions already present in the route.
- Product status is shown with `VisualStatusTag`.
- Product name, price, description, SKU, stock, and quantity stay visible.
- Quantity uses the redesigned 44px `QuantityStepper`.
- Bottom purchase bar is fixed glass:
  - icon button for favorite,
  - cart icon action,
  - text CTA for 加入购物车,
  - text CTA for 立即购买.
- Offline, missing SKU, and out-of-stock states use visual status panels and disable purchase actions.

### Cart.jsx
The cart becomes an iOS shopping bag:

- Header shows title and selected item summary.
- Select-all row is a full-width card with 44px touch target.
- Each cart item is a white rounded card.
- Item selection uses a styled native checkbox wrapped by a 44px hit area.
- Product image, product name, SKU, price, and quantity remain visible.
- Delete action becomes a 44px trash icon button with `aria-label`.
- Bottom checkout `GlassBar` shows selected count, total amount, and 去结算 CTA.

### CreateOrder.jsx
The order creation page becomes a checkout stack:

- Address selection is a card group with location icons and default address tag.
- Each address option is a full card tap target.
- Product list cards show image, name, SKU, quantity, and subtotal.
- Amount detail card highlights total.
- Remark input remains accessible through label `订单备注`.
- Bottom submit `GlassBar` shows total amount and 提交订单 CTA.
- Errors such as missing selected items or missing address appear in low-saturation status panels.

### Pay.jsx And PaySuccess.jsx
Payment simulation becomes clearer and more visual:

- Payable state shows amount card, countdown capsule, and simulated QR/payment panel.
- `确认已支付` remains a clear 44px CTA.
- Expired or non-payable states keep disabled CTA and show exact status message.
- `PaySuccess.jsx` shows a completion icon, order id, 查看订单详情 action, and 继续逛逛 action.

### OrderListPage.jsx
Order list focuses on visual status:

- Status filter chips include icons and labels.
- Order cards are full-card links.
- Each card shows order id, `VisualStatusTag`, product summary, amount, and chevron.
- Empty filtered state uses `EmptyState`.

### OrderDetailPage.jsx
Order detail becomes a card-based status dossier:

- Status summary card with icon tag and order id.
- Product information card with item snapshots.
- Address card with receiver, phone, and address.
- Payment card with total and paid time if present.
- Logistics card uses an icon-led vertical timeline for logistics entries.
- Missing order uses `EmptyState` rather than a bare text panel.

### UserPage.jsx
User center becomes an iOS settings-style hub:

- User identity card shows avatar icon, name, and username.
- `MetricTile` row shows points, coupons, favorites, and order count. Points display `1280` and coupons display `3` as view-only demo values without new storage keys. Favorites and order count use current service data.
- Recent order preview appears under metrics, satisfying the README requirement for order list visibility.
- Setting rows include 我的订单, 我的收藏, 地址管理, and 退出登录.
- Logout remains a button, not a link.

### AddressPage.jsx
Address management becomes an address book:

- Top right add action is a 44px plus icon button with label `新增地址`.
- Address cards show location/home icon, receiver, phone, default tag, and detail.
- Set default, edit, and delete actions become 44px icon buttons with `aria-label`.
- Form fields remain labeled: 收货人, 手机号, 省份, 城市, 详细地址.
- Save action remains `保存地址`.
- Logged-out errors preserve `去登录` link.

### FavoritesPage.jsx
Favorites become a product collection:

- Favorite cards are visually aligned with product/list cards.
- Product detail link remains available.
- Cancel favorite becomes a 44px heart icon button with accessible name `取消收藏`.
- Empty state uses a heart/product icon and action back to `/shop`.

### LoginPage.jsx
Login becomes a member pass:

- Test account information remains visible.
- Primary login button keeps text `使用测试会员登录` plus user icon.
- Error messages use visual status panel.

## Data Flow
No new backend, global state model, or storage key is introduced in this redesign. The existing services remain the source of truth:

- Products/categories: `productService`, `categoryService`.
- Cart: `cartService` and `useAppContext`.
- User auth: `authService`, `useAppContext`.
- Orders: `orderService`.
- Favorites: `favoriteService`.
- Addresses: `addressService`.

The redesign is visual and interaction-layer focused. It must not change business semantics, localStorage keys, or service return shapes.

## Error Handling And Empty States
All existing error states remain:

- Product missing.
- Product offline.
- Missing SKU.
- Out of stock.
- Cart empty.
- No selected checkout items.
- Missing address.
- Payment expired or non-payable order.
- Missing order.
- Address management when logged out.
- Empty favorites.
- Empty order filters.

Each state uses `EmptyState` or a low-saturation status panel with a relevant icon and clear Chinese message.

## Testing And Verification
Tests should preserve existing behavior assertions and add visual contract coverage where useful:

- `Home.jsx` renders search box, carousel, and hot product section.
- `Category.jsx` renders category index entries.
- `ShopLayout.jsx` bottom Dock uses icon-led tabs and glass classes.
- Key icon buttons preserve accessible names for tests: 收藏, 取消收藏, 删除, 新增地址, 编辑地址, 设置默认, 增加数量, 减少数量.
- `QuantityStepper` buttons satisfy 44px classes.
- Fixed bottom bars use `backdrop-blur-md` and `bg-white/80`.
- `VisualStatusTag` displays status labels and includes icon markup.
- Existing flow tests for cart, order creation, payment, logistics, address, favorites, and user page continue to pass.

Expected verification commands after implementation:

```bash
npm run test
npm run lint
npm run build
node tool/check.cjs
```

## Out Of Scope
- No new icon package.
- No new UI component library.
- No real backend integration.
- No new localStorage keys unless a later implementation plan explicitly justifies them.
- No desktop wide-screen ecommerce layout.
- No automatic carousel timer requirement.
- No unrelated admin redesign.

## Acceptance Criteria
- `/shop` visually reads as a mobile app, not a text-heavy web page.
- README frontend feature matrix remains fully satisfied.
- Homepage includes search, carousel, and hot products.
- All primary clickable shop controls have 44px minimum touch targets.
- Text-only links and actions are replaced by icon-led controls where appropriate.
- Critical commerce CTAs retain clear short text.
- Top/bottom fixed surfaces use glass treatment where they appear.
- Product, order, and status labels are visualized with icons and low-saturation tags.
- Existing business flows remain intact.
