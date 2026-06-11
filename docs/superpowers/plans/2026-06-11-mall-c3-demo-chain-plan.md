# Mall C3 Demo Chain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the C3 complete demo chain so the shop frontend and admin backend share one offline data source and can demonstrate browse, cart, order, payment, shipment, and permission control end to end.

**Architecture:** Keep `src/mock/mockService.js` as the only data gateway, then connect page components through service APIs and `AppContext`. Frontend pages use mobile-first Tailwind components with the confirmed modern minimal business visual direction; admin pages use Ant Design 5 with custom business cards, filters, and action flows.

**Tech Stack:** React 18.3.1, React Router DOM 6.30.4, Tailwind CSS 4.3.0, Ant Design 5.29.3, Vitest 4.1.8, React Testing Library 16.3.2, JSDOM 29.1.1, localStorage-backed mock services.

---

## 防火墙 1：设计到计划自检

1. **安全与权限细节：** 本阶段只使用本地离线 `localStorage` 数据，不接入真实接口、真实支付、真实 Token。前台登录态固定使用 `mall_session`，后台登录态固定使用 `mall_admin_session`。后台权限继续通过 `permissionService.canAccess(session.roleCode, permission)` 控制，普通运营访问 `/admin/products` 必须显示 `NoPermissionPage`。
2. **极端边界容错：** 计划锁定商品不存在、商品下架、库存不足、数量小于 `1`、地址缺失、订单不存在、非待支付订单支付、非已支付订单发货、物流公司为空、物流单号为空、支付倒计时结束等边界。服务层返回结构固定为 `{ success: true, data, message: '' }` 与 `{ success: false, data: null, message: '明确中文错误信息' }`。
3. **第三方依赖审计：** C3 阶段不新增依赖。继续使用已安装的 React、React Router、Tailwind CSS、Ant Design、Vitest、Testing Library、JSDOM。

## Fixed Contracts

Do not rename these existing paths or exports.

```js
export const STORAGE_KEYS = {
  products: 'mall_products',
  categories: 'mall_categories',
  orders: 'mall_orders',
  users: 'mall_users',
  admins: 'mall_admins',
  roles: 'mall_roles',
  cart: 'mall_cart',
  favorites: 'mall_favorites',
  addresses: 'mall_addresses',
  logs: 'mall_logs',
  session: 'mall_session',
  adminSession: 'mall_admin_session',
  schemaVersion: 'mall_schema_version',
};
```

```js
export const ORDER_STATUS = {
  pendingPayment: 'pending_payment',
  paid: 'paid',
  shipped: 'shipped',
  completed: 'completed',
  canceled: 'canceled',
};
```

```js
export const ADMIN_ROLE_CODES = {
  admin: 'admin',
  operator: 'operator',
};
```

The exact new service exports are:

```js
export const favoriteService = {
  listFavoritesSync(userId) {},
  toggleFavorite(userId, productId) {},
};

export const dashboardService = {
  getSummary() {},
};
```

The exact route set remains:

```txt
/shop
/shop/category
/shop/detail/:productId
/shop/cart
/shop/create-order
/shop/pay/:orderId
/shop/pay-success/:orderId
/shop/orders
/shop/orders/:orderId
/shop/user
/shop/address
/shop/favorites
/shop/login
/admin/login
/admin/dashboard
/admin/products
/admin/categories
/admin/orders
/admin/roles
/admin/users
/admin/account
/admin/logs
```

## File Map

- Modify: `src/mock/mockService.js`  
  Adds product CRUD, paging, cart selection, address CRUD, order shipment, order paging, `favoriteService`, and `dashboardService`.
- Create: `src/mock/mockService.c3.test.js`  
  Locks C3 service behavior and front-back data linkage.
- Modify: `src/context/AppContext.jsx`  
  Adds frontend cart/order/favorite/address refresh actions while preserving existing `state`, `loginUser`, and `logoutUser`.
- Modify: `src/context/AppContext.test.jsx`  
  Verifies added context actions against service state.
- Create: `src/components/shop/ProductCard.jsx`  
  Mobile product card with image, tags, stock, price, and detail link.
- Create: `src/components/shop/SectionHeader.jsx`  
  Compact section title row for shop pages.
- Create: `src/components/shop/QuantityStepper.jsx`  
  Quantity control with minimum `1` and disabled states.
- Create: `src/components/shop/StatusTag.jsx`  
  Shared order and product status chip.
- Create: `src/components/shop/EmptyState.jsx`  
  Empty state block with optional action link.
- Create: `src/components/shop/shopComponents.test.jsx`  
  Component interaction tests.
- Create: `src/components/admin/PageHeaderCard.jsx`  
  Admin page title, description, and action slot.
- Create: `src/components/admin/ProductFormDrawer.jsx`  
  Ant Design drawer form for add and edit product.
- Create: `src/components/admin/OrderShipModal.jsx`  
  Ant Design modal form for shipment.
- Create: `src/components/admin/StatisticCardGrid.jsx`  
  Admin dashboard metric card grid.
- Create: `src/components/admin/adminComponents.test.jsx`  
  Component validation tests.
- Modify: `src/pages/shop/ShopLayout.jsx`  
  Applies final mobile shell and active bottom nav style.
- Modify: `src/pages/shop/Home.jsx`  
  Implements searchable online product homepage with hero and three sections.
- Modify: `src/pages/shop/Category.jsx`  
  Implements category filter, child category chips, sorting, and online-only product list.
- Modify: `src/pages/shop/Detail.jsx`  
  Implements detail display, SKU selection, quantity, favorite, add cart, and buy now.
- Modify: `src/pages/shop/Cart.jsx`  
  Implements selected cart list, quantity update, delete, total, and checkout.
- Modify: `src/pages/shop/CreateOrder.jsx`  
  Implements address snapshot, selected item order creation, remark, and validation.
- Modify: `src/pages/shop/Pay.jsx`  
  Implements order payment countdown and simulated pay action.
- Modify: `src/pages/shop/PaySuccess.jsx`  
  Implements payment success actions.
- Modify: `src/pages/shop/OrderListPage.jsx`  
  Implements user order list and status filter.
- Modify: `src/pages/shop/OrderDetailPage.jsx`  
  Implements order detail with logistics.
- Modify: `src/pages/shop/UserPage.jsx`  
  Implements profile, entries, and logout.
- Modify: `src/pages/shop/AddressPage.jsx`  
  Implements address list, create, edit, delete, and default selection.
- Modify: `src/pages/shop/FavoritesPage.jsx`  
  Implements favorite list and cancel favorite.
- Modify: `src/pages/shop/LoginPage.jsx`  
  Improves test-account login page and redirect.
- Create: `src/pages/shop/shopFlow.test.jsx`  
  Page-level tests for online filtering, cart, order, pay, and shipment reflection.
- Modify: `src/pages/admin/AdminLayout.jsx`  
  Applies polished admin shell and permission-safe navigation.
- Modify: `src/pages/admin/AdminLoginPage.jsx`  
  Adds polished login view and admin/operator shortcuts.
- Modify: `src/pages/admin/Dashboard.jsx`  
  Displays live dashboard summary.
- Modify: `src/pages/admin/AdminProductPage.jsx`  
  Implements product list, filters, paging, add, edit, delete, and online status switch.
- Modify: `src/pages/admin/AdminOrderPage.jsx`  
  Implements order list, filters, detail drawer, and shipment modal.
- Modify: `src/pages/admin/AdminAccountPage.jsx`  
  Shows current admin account and logout.
- Modify: `src/pages/admin/NoPermissionPage.jsx`  
  Applies admin visual language.
- Modify: `src/pages/admin/AdminCategoryPage.jsx`  
  Converts to clean read-only category page.
- Modify: `src/pages/admin/AdminRolePage.jsx`  
  Converts to clean read-only role page.
- Modify: `src/pages/admin/AdminUserPage.jsx`  
  Converts to clean read-only user page.
- Modify: `src/pages/admin/AdminLogPage.jsx`  
  Converts to clean read-only log page.
- Create: `src/pages/admin/adminFlow.test.jsx`  
  Page-level tests for admin product management, shipment, dashboard, and operator permission.
- Modify: `src/router.test.jsx`  
  Keeps route guard tests aligned with full C3 pages.

---

### Task 1: Expand Mock Service For C3 Demo Chain

**Files:**
- Modify: `src/mock/mockService.js`
- Create: `src/mock/mockService.c3.test.js`

- [ ] **Step 1: Write the failing service tests**

Create `src/mock/mockService.c3.test.js`:

```js
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ORDER_STATUS,
  addressService,
  cartService,
  dashboardService,
  databaseService,
  favoriteService,
  orderService,
  productService,
} from './mockService.js';

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('C3 mock service chain', () => {
  it('creates, updates, toggles, filters, pages, and deletes products', async () => {
    const created = await productService.createProduct({
      name: 'C3 演示商品',
      categoryId: 'cat-digital-office',
      price: 288,
      stock: 12,
      image: 'https://dummyimage.com/640x480/e8eef3/203244&text=C3',
      status: 'online',
      tags: ['新品'],
      skuOptions: [{ id: 'sku-c3-standard', name: '标准版', stock: 12, price: 288 }],
      description: 'C3 演示商品描述',
    });

    expect(created.success).toBe(true);
    expect(created.data.id).toMatch(/^p-/);
    expect(productService.listProductsSync().some((product) => product.id === created.data.id)).toBe(true);

    const updated = await productService.updateProduct({
      ...created.data,
      name: 'C3 演示商品已编辑',
      price: 299,
    });

    expect(updated.success).toBe(true);
    expect(productService.getProductByIdSync(created.data.id).name).toBe('C3 演示商品已编辑');

    const toggled = await productService.toggleProductStatus(created.data.id, 'offline');

    expect(toggled.success).toBe(true);
    expect(productService.getProductByIdSync(created.data.id).status).toBe('offline');

    const onlineProducts = await productService.listProducts({ status: 'online' });

    expect(onlineProducts.success).toBe(true);
    expect(onlineProducts.data.every((product) => product.status === 'online')).toBe(true);
    expect(onlineProducts.data.some((product) => product.id === created.data.id)).toBe(false);

    const paged = await productService.listPagedProducts({ page: 1, pageSize: 5, status: 'offline' });

    expect(paged.success).toBe(true);
    expect(paged.data.page).toBe(1);
    expect(paged.data.pageSize).toBe(5);
    expect(paged.data.list.some((product) => product.id === created.data.id)).toBe(true);
    expect(paged.data.total).toBeGreaterThanOrEqual(1);

    const deleted = await productService.deleteProduct(created.data.id);

    expect(deleted.success).toBe(true);
    expect(productService.getProductByIdSync(created.data.id)).toBeNull();
  });

  it('rejects invalid product payloads with Chinese messages', async () => {
    await expect(productService.createProduct({ name: '', categoryId: 'cat-digital-office', price: 1, stock: 1, image: 'x' })).resolves.toMatchObject({
      success: false,
      message: '商品名称不能为空',
    });
    await expect(productService.createProduct({ name: '坏价格', categoryId: 'cat-digital-office', price: -1, stock: 1, image: 'x' })).resolves.toMatchObject({
      success: false,
      message: '商品价格不能小于 0',
    });
    await expect(productService.createProduct({ name: '坏库存', categoryId: 'cat-digital-office', price: 1, stock: -1, image: 'x' })).resolves.toMatchObject({
      success: false,
      message: '商品库存不能小于 0',
    });
    await expect(productService.createProduct({ name: '无分类', categoryId: '', price: 1, stock: 1, image: 'x' })).resolves.toMatchObject({
      success: false,
      message: '商品分类不能为空',
    });
    await expect(productService.createProduct({ name: '无图片', categoryId: 'cat-digital-office', price: 1, stock: 1, image: '' })).resolves.toMatchObject({
      success: false,
      message: '商品图片不能为空',
    });
  });

  it('updates cart selection and clears selected items after order creation', async () => {
    await cartService.addItem({
      userId: 'user-001',
      productId: 'p-001',
      skuId: 'p-001-standard',
      quantity: 1,
      selected: true,
    });
    await cartService.addItem({
      userId: 'user-001',
      productId: 'p-002',
      skuId: 'p-002-standard',
      quantity: 1,
      selected: false,
    });

    const firstItem = cartService.listCartSync('user-001')[0];
    const secondItem = cartService.listCartSync('user-001')[1];

    await cartService.updateItemQuantity(firstItem.id, 3);
    await cartService.toggleItemSelected(secondItem.id, true);
    await cartService.toggleAllSelected('user-001', false);
    await cartService.toggleItemSelected(firstItem.id, true);

    expect(cartService.calculateSelectedTotal('user-001')).toEqual({
      totalQuantity: 3,
      totalAmount: 2097,
    });

    await cartService.clearSelectedItems('user-001');

    expect(cartService.listCartSync('user-001')).toHaveLength(1);
    expect(cartService.listCartSync('user-001')[0].productId).toBe('p-002');

    await cartService.removeItem(cartService.listCartSync('user-001')[0].id);

    expect(cartService.listCartSync('user-001')).toHaveLength(0);
  });

  it('creates, updates, deletes, and defaults user addresses', async () => {
    const created = await addressService.createAddress({
      userId: 'user-001',
      receiver: '新收货人',
      phone: '13900000000',
      province: '上海市',
      city: '上海市',
      detail: '演示路 1 号',
      isDefault: false,
    });

    expect(created.success).toBe(true);

    await addressService.setDefaultAddress('user-001', created.data.id);

    expect(addressService.getByIdSync(created.data.id).isDefault).toBe(true);
    expect(addressService.getByIdSync('addr-001').isDefault).toBe(false);

    const updated = await addressService.updateAddress(created.data.id, {
      ...created.data,
      detail: '演示路 2 号',
    });

    expect(updated.success).toBe(true);
    expect(addressService.getByIdSync(created.data.id).detail).toBe('演示路 2 号');

    const deletedDefault = await addressService.deleteAddress(created.data.id);

    expect(deletedDefault.success).toBe(false);
    expect(deletedDefault.message).toBe('默认地址不能删除');

    await addressService.setDefaultAddress('user-001', 'addr-001');
    const deleted = await addressService.deleteAddress(created.data.id);

    expect(deleted.success).toBe(true);
    expect(addressService.getByIdSync(created.data.id)).toBeNull();
  });

  it('creates, pays, pages, ships, and reads the same order across frontend and admin', async () => {
    const created = await orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 1 }],
      addressId: 'addr-001',
      remark: 'C3 演示订单',
    });

    expect(created.success).toBe(true);
    expect(created.data.status).toBe(ORDER_STATUS.pendingPayment);

    const paid = await orderService.payOrder(created.data.id);

    expect(paid.success).toBe(true);
    expect(orderService.getOrderByIdSync(created.data.id).status).toBe(ORDER_STATUS.paid);

    const paged = await orderService.listPagedOrders({ page: 1, pageSize: 10, status: ORDER_STATUS.paid });

    expect(paged.success).toBe(true);
    expect(paged.data.list.some((order) => order.id === created.data.id)).toBe(true);

    const shipped = await orderService.shipOrder(created.data.id, {
      company: '顺丰速运',
      trackingNo: 'SF1000000001',
    });

    expect(shipped.success).toBe(true);
    expect(orderService.getOrderByIdSync(created.data.id).status).toBe(ORDER_STATUS.shipped);
    expect(orderService.getOrderByIdSync(created.data.id).logistics[0]).toMatchObject({
      company: '顺丰速运',
      trackingNo: 'SF1000000001',
    });
  });

  it('toggles favorites and aggregates dashboard summary', async () => {
    const added = await favoriteService.toggleFavorite('user-001', 'p-001');

    expect(added.success).toBe(true);
    expect(added.data.isFavorite).toBe(true);
    expect(favoriteService.listFavoritesSync('user-001')).toHaveLength(1);

    const removed = await favoriteService.toggleFavorite('user-001', 'p-001');

    expect(removed.success).toBe(true);
    expect(removed.data.isFavorite).toBe(false);
    expect(favoriteService.listFavoritesSync('user-001')).toHaveLength(0);

    const summary = await dashboardService.getSummary();

    expect(summary.success).toBe(true);
    expect(summary.data.productTotal).toBe(30);
    expect(summary.data.onlineProductTotal).toBe(29);
    expect(summary.data.orderTotal).toBe(1);
    expect(summary.data.paidOrderTotal).toBe(1);
    expect(summary.data.pendingShipmentTotal).toBe(1);
    expect(summary.data.recentOrders).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the service tests and verify failure**

Run:

```bash
npm run test -- src/mock/mockService.c3.test.js
```

Expected: FAIL because `createProduct`, `toggleProductStatus`, `listPagedProducts`, cart mutation methods, address mutation methods, `getOrderByIdSync`, `shipOrder`, `listPagedOrders`, `favoriteService`, and `dashboardService` do not exist.

- [ ] **Step 3: Implement exact service APIs in `src/mock/mockService.js`**

Keep the existing exports and add these exact methods:

```js
productService.createProduct(productPayload)
productService.updateProduct(productPayload)
productService.deleteProduct(productId)
productService.toggleProductStatus(productId, status)
productService.listPagedProducts(params)
cartService.updateItemQuantity(cartItemId, quantity)
cartService.toggleItemSelected(cartItemId, selected)
cartService.toggleAllSelected(userId, selected)
cartService.removeItem(cartItemId)
cartService.clearSelectedItems(userId)
addressService.createAddress(payload)
addressService.updateAddress(addressId, payload)
addressService.deleteAddress(addressId)
addressService.setDefaultAddress(userId, addressId)
orderService.getOrderByIdSync(orderId)
orderService.shipOrder(orderId, payload)
orderService.listPagedOrders(params)
favoriteService.listFavoritesSync(userId)
favoriteService.toggleFavorite(userId, productId)
dashboardService.getSummary()
```

Use these validation messages exactly:

```js
'商品名称不能为空'
'商品价格不能小于 0'
'商品库存不能小于 0'
'商品分类不能为空'
'商品图片不能为空'
'商品不存在'
'商品已下架'
'商品规格不存在'
'商品数量必须大于 0'
'库存不足'
'购物车商品不存在'
'收货地址不存在'
'默认地址不能删除'
'订单不存在'
'订单状态不允许支付'
'订单状态不允许发货'
'物流公司不能为空'
'物流单号不能为空'
```

Use this exact page result shape for product and order paging:

```js
{
  list,
  total,
  page,
  pageSize,
}
```

Use this exact shipment logistics item shape:

```js
{
  company,
  trackingNo,
  shippedAt: new Date().toISOString(),
}
```

When creating an order from selected cart items in pages, the page will call `orderService.createOrder(...)` and then `cartService.clearSelectedItems(userId)` only after the order result is successful. Do not make `orderService.createOrder(...)` clear cart items by itself.

- [ ] **Step 4: Run service tests**

Run:

```bash
npm run test -- src/mock/mockService.c3.test.js src/mock/mockService.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/mock/mockService.js src/mock/mockService.c3.test.js
git commit -m "feat: expand mall c3 mock services"
```

### Task 2: Expand AppContext For Frontend State Actions

**Files:**
- Modify: `src/context/AppContext.jsx`
- Modify: `src/context/AppContext.test.jsx`

- [ ] **Step 1: Add failing context tests**

Append these tests to `src/context/AppContext.test.jsx`:

```jsx
function C3Probe() {
  const { state, loginUser, refreshCart, addToCart, toggleFavorite, refreshFavorites, refreshOrders } = useAppContext();
  return (
    <div>
      <p data-testid="user">{state.user?.id || '未登录'}</p>
      <p data-testid="cart-count">{state.cartItems.length}</p>
      <p data-testid="favorite-count">{state.favorites.length}</p>
      <p data-testid="order-count">{state.orders.length}</p>
      <button type="button" onClick={() => loginUser('member', '123456')}>
        登录会员
      </button>
      <button type="button" onClick={() => refreshCart()}>
        刷新购物车
      </button>
      <button
        type="button"
        onClick={() =>
          addToCart({
            productId: 'p-001',
            skuId: 'p-001-standard',
            quantity: 1,
          })
        }
      >
        加购
      </button>
      <button type="button" onClick={() => toggleFavorite('p-001')}>
        收藏
      </button>
      <button type="button" onClick={() => refreshFavorites()}>
        刷新收藏
      </button>
      <button type="button" onClick={() => refreshOrders()}>
        刷新订单
      </button>
    </div>
  );
}

it('refreshes C3 cart, favorites, and orders for logged in user', async () => {
  const user = userEvent.setup();
  render(
    <AppProvider>
      <C3Probe />
    </AppProvider>,
  );

  await user.click(screen.getByRole('button', { name: '登录会员' }));
  await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('user-001'));

  await user.click(screen.getByRole('button', { name: '加购' }));
  await waitFor(() => expect(screen.getByTestId('cart-count')).toHaveTextContent('1'));

  await user.click(screen.getByRole('button', { name: '收藏' }));
  await user.click(screen.getByRole('button', { name: '刷新收藏' }));
  await waitFor(() => expect(screen.getByTestId('favorite-count')).toHaveTextContent('1'));

  await user.click(screen.getByRole('button', { name: '刷新订单' }));
  await waitFor(() => expect(screen.getByTestId('order-count')).toHaveTextContent('1'));
});
```

- [ ] **Step 2: Run context tests and verify failure**

Run:

```bash
npm run test -- src/context/AppContext.test.jsx
```

Expected: FAIL because `state.cartItems`, `state.favorites`, `state.orders`, `refreshCart`, `addToCart`, `toggleFavorite`, `refreshFavorites`, and `refreshOrders` are not defined.

- [ ] **Step 3: Modify `src/context/AppContext.jsx`**

Add these exact state keys to `initialState`:

```js
cartItems: [],
favorites: [],
orders: [],
addresses: [],
```

Add these exact action types to `reducer`:

```js
'SET_CART_ITEMS'
'SET_FAVORITES'
'SET_ORDERS'
'SET_ADDRESSES'
```

Add these exact actions to the context value:

```js
refreshCart()
addToCart(payload)
refreshFavorites()
toggleFavorite(productId)
refreshOrders()
refreshAddresses()
logoutUser()
```

Import these exact services:

```js
import {
  addressService,
  authService,
  cartService,
  databaseService,
  favoriteService,
  orderService,
} from '../mock/mockService.js';
```

Behavior:

- `refreshCart()` reads `cartService.listCartSync(state.user.id)` only when `state.user` exists.
- `addToCart(payload)` passes `{ userId: state.user.id, ...payload }` to `cartService.addItem(...)`, then refreshes cart when successful.
- `refreshFavorites()` reads `favoriteService.listFavoritesSync(state.user.id)` only when `state.user` exists.
- `toggleFavorite(productId)` calls `favoriteService.toggleFavorite(state.user.id, productId)`, then refreshes favorites when successful.
- `refreshOrders()` reads `orderService.listOrdersSync(state.user.id)` only when `state.user` exists.
- `refreshAddresses()` reads `addressService.listByUserSync(state.user.id)` only when `state.user` exists.
- `logoutUser()` must clear `user`, `cartItems`, `favorites`, `orders`, and `addresses`.

- [ ] **Step 4: Run context tests**

Run:

```bash
npm run test -- src/context/AppContext.test.jsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/context/AppContext.jsx src/context/AppContext.test.jsx
git commit -m "feat: add c3 frontend context actions"
```

### Task 3: Build Shared Shop Components

**Files:**
- Create: `src/components/shop/ProductCard.jsx`
- Create: `src/components/shop/SectionHeader.jsx`
- Create: `src/components/shop/QuantityStepper.jsx`
- Create: `src/components/shop/StatusTag.jsx`
- Create: `src/components/shop/EmptyState.jsx`
- Create: `src/components/shop/shopComponents.test.jsx`

- [ ] **Step 1: Write failing component tests**

Create `src/components/shop/shopComponents.test.jsx`:

```jsx
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState.jsx';
import { ProductCard } from './ProductCard.jsx';
import { QuantityStepper } from './QuantityStepper.jsx';
import { StatusTag } from './StatusTag.jsx';

const product = {
  id: 'p-001',
  name: '曜石无线降噪耳机',
  price: 699,
  stock: 98,
  image: 'https://dummyimage.com/640x480/e8eef3/203244&text=test',
  tags: ['热门', '精选'],
  status: 'online',
};

describe('shop shared components', () => {
  it('renders product card with detail link and product facts', () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /曜石无线降噪耳机/ })).toHaveAttribute('href', '/shop/detail/p-001');
    expect(screen.getByText('¥699')).toBeInTheDocument();
    expect(screen.getByText('库存 98')).toBeInTheDocument();
    expect(screen.getByText('热门')).toBeInTheDocument();
  });

  it('keeps quantity at minimum 1 and emits changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper value={1} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '减少数量' }));
    expect(onChange).not.toHaveBeenCalledWith(0);

    await user.click(screen.getByRole('button', { name: '增加数量' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('renders status and empty action link', () => {
    render(
      <MemoryRouter>
        <StatusTag status="paid" />
        <EmptyState title="购物车还是空的" actionText="去首页看看" actionTo="/shop" />
      </MemoryRouter>,
    );

    expect(screen.getByText('已支付')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '去首页看看' })).toHaveAttribute('href', '/shop');
  });
});
```

- [ ] **Step 2: Run component tests and verify failure**

Run:

```bash
npm run test -- src/components/shop/shopComponents.test.jsx
```

Expected: FAIL because the component files do not exist.

- [ ] **Step 3: Create the five shop components**

Implement these exact exports:

```jsx
export function ProductCard({ product }) {}
export function SectionHeader({ eyebrow, title, actionText, actionTo }) {}
export function QuantityStepper({ value, onChange, min = 1, max = 999, disabled = false }) {}
export function StatusTag({ status }) {}
export function EmptyState({ title, description = '', actionText = '', actionTo = '' }) {}
```

`StatusTag` must use this exact label map:

```js
const STATUS_LABELS = {
  online: '上架',
  offline: '下架',
  pending_payment: '待支付',
  paid: '已支付',
  shipped: '已发货',
  completed: '已完成',
  canceled: '已取消',
};
```

`ProductCard` must use `<Link to={`/shop/detail/${product.id}`}>` and show product name, `¥${product.price}`, `库存 ${product.stock}`, and every tag in `product.tags`.

`QuantityStepper` buttons must have exact accessible names:

```txt
减少数量
增加数量
```

- [ ] **Step 4: Run component tests**

Run:

```bash
npm run test -- src/components/shop/shopComponents.test.jsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shop
git commit -m "feat: add shop c3 shared components"
```

### Task 4: Build Shared Admin Components

**Files:**
- Create: `src/components/admin/PageHeaderCard.jsx`
- Create: `src/components/admin/ProductFormDrawer.jsx`
- Create: `src/components/admin/OrderShipModal.jsx`
- Create: `src/components/admin/StatisticCardGrid.jsx`
- Create: `src/components/admin/adminComponents.test.jsx`

- [ ] **Step 1: Write failing admin component tests**

Create `src/components/admin/adminComponents.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OrderShipModal } from './OrderShipModal.jsx';
import { ProductFormDrawer } from './ProductFormDrawer.jsx';
import { StatisticCardGrid } from './StatisticCardGrid.jsx';

describe('admin shared components', () => {
  it('validates product form fields before submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductFormDrawer
        open
        mode="create"
        product={null}
        categories={[{ id: 'cat-digital-office', name: '效率办公' }]}
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: '保存商品' }));

    expect(await screen.findByText('请输入商品名称')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits shipment company and tracking number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OrderShipModal open orderId="ORD_TEST" onClose={() => {}} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('物流公司'), '顺丰速运');
    await user.type(screen.getByLabelText('物流单号'), 'SF1000000001');
    await user.click(screen.getByRole('button', { name: '确认发货' }));

    expect(onSubmit).toHaveBeenCalledWith({
      company: '顺丰速运',
      trackingNo: 'SF1000000001',
    });
  });

  it('renders statistic cards', () => {
    render(
      <StatisticCardGrid
        items={[
          { label: '商品总数', value: 30 },
          { label: '待发货订单', value: 1 },
        ]}
      />,
    );

    expect(screen.getByText('商品总数')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('待发货订单')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run admin component tests and verify failure**

Run:

```bash
npm run test -- src/components/admin/adminComponents.test.jsx
```

Expected: FAIL because the component files do not exist.

- [ ] **Step 3: Create the four admin components**

Implement these exact exports:

```jsx
export function PageHeaderCard({ title, description, extra }) {}
export function ProductFormDrawer({ open, mode, product, categories, onClose, onSubmit }) {}
export function OrderShipModal({ open, orderId, onClose, onSubmit }) {}
export function StatisticCardGrid({ items }) {}
```

`ProductFormDrawer` must use Ant Design `Form`, `Drawer`, `Input`, `InputNumber`, `Select`, and submit this exact payload shape:

```js
{
  id,
  name,
  categoryId,
  price,
  stock,
  image,
  status,
  tags,
  skuOptions,
  description,
}
```

For create mode, build `skuOptions` from form values with this exact shape:

```js
[
  {
    id: `${id || 'new'}-standard`,
    name: '标准版',
    stock,
    price,
  },
]
```

Use these exact validation messages in the form:

```txt
请输入商品名称
请选择商品分类
请输入商品图片地址
价格不能小于 0
库存不能小于 0
```

`OrderShipModal` must use exact labels:

```txt
物流公司
物流单号
确认发货
```

- [ ] **Step 4: Run admin component tests**

Run:

```bash
npm run test -- src/components/admin/adminComponents.test.jsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin
git commit -m "feat: add admin c3 shared components"
```

### Task 5: Implement Frontend Browse And Product Detail Pages

**Files:**
- Modify: `src/pages/shop/ShopLayout.jsx`
- Modify: `src/pages/shop/Home.jsx`
- Modify: `src/pages/shop/Category.jsx`
- Modify: `src/pages/shop/Detail.jsx`
- Modify: `src/pages/shop/LoginPage.jsx`
- Create: `src/pages/shop/shopBrowse.test.jsx`

- [ ] **Step 1: Write failing browse tests**

Create `src/pages/shop/shopBrowse.test.jsx`:

```jsx
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from '../../context/AppContext.jsx';
import { databaseService, productService } from '../../mock/mockService.js';
import { Category } from './Category.jsx';
import { Detail } from './Detail.jsx';
import { Home } from './Home.jsx';
import { LoginPage } from './LoginPage.jsx';
import { ShopLayout } from './ShopLayout.jsx';

function renderShop(initialEntries) {
  const router = createMemoryRouter(
    [
      {
        path: '/shop',
        element: <ShopLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'category', element: <Category /> },
          { path: 'detail/:productId', element: <Detail /> },
          { path: 'login', element: <LoginPage /> },
        ],
      },
    ],
    { initialEntries },
  );

  return render(
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('shop browse pages', () => {
  it('hides offline products on home and category pages', async () => {
    renderShop(['/shop']);

    expect(await screen.findByText('可信赖的精选商城')).toBeInTheDocument();
    expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();

    renderShop(['/shop/category']);

    expect(await screen.findByText('全部分类')).toBeInTheDocument();
    expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();
  });

  it('blocks add cart for offline product detail', async () => {
    renderShop(['/shop/detail/p-008']);

    expect(await screen.findByText('商品已下架')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '加入购物车' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '立即购买' })).toBeDisabled();
  });

  it('adds online product to cart after login', async () => {
    const user = userEvent.setup();
    await productService.toggleProductStatus('p-001', 'online');
    renderShop(['/shop/detail/p-001']);

    expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '加入购物车' }));

    await waitFor(() => expect(screen.getByText('已加入购物车')).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run browse tests and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx
```

Expected: FAIL because route shell pages do not contain the required UI and actions.

- [ ] **Step 3: Modify `ShopLayout.jsx`**

Use this bottom nav item contract:

```js
const navItems = [
  { to: '/shop', label: '首页' },
  { to: '/shop/category', label: '分类' },
  { to: '/shop/cart', label: '购物车' },
  { to: '/shop/user', label: '我的' },
];
```

The active `NavLink` class must include:

```txt
text-[#1F6F8B]
```

The shell must keep `max-w-md`, `Paper White`, `Mist Gray`, fixed bottom nav, and enough `pb-24` for mobile spacing.

- [ ] **Step 4: Modify `Home.jsx`**

Use:

```js
productService.listProductsSync().filter((product) => product.status === 'online')
```

Show these exact texts:

```txt
可信赖的精选商城
热门推荐
新品精选
限时特惠
```

The search input placeholder must be:

```txt
搜索商品、分类或生活方式
```

Render products through `ProductCard`.

- [ ] **Step 5: Modify `Category.jsx`**

Use:

```js
categoryService.listCategoriesSync()
productService.listProductsSync().filter((product) => product.status === 'online')
```

Show these exact sort labels:

```txt
综合
价格升序
价格降序
销量优先
```

Show the exact title:

```txt
全部分类
```

- [ ] **Step 6: Modify `Detail.jsx`**

Use `useParams()` to read `productId`, then:

```js
const product = productService.getProductByIdSync(productId);
```

When product is missing, show:

```txt
商品不存在
返回首页
```

When `product.status !== 'online'`, show:

```txt
商品已下架
```

Buttons must use exact names:

```txt
收藏
取消收藏
加入购物车
立即购买
```

After successful add cart, show exact message:

```txt
已加入购物车
```

If no `state.user`, the page must call `loginUser('member', '123456')` before adding to cart for demo smoothness. The login shortcut is permitted only on `Detail.jsx`; `/shop/cart`, `/shop/create-order`, `/shop/orders`, `/shop/user`, `/shop/address`, and `/shop/favorites` remain protected by route guards.

- [ ] **Step 7: Modify `LoginPage.jsx`**

Keep existing `loginUser('member', '123456')`. Show these exact texts:

```txt
前台登录
使用测试会员登录
测试账号：member / 123456
```

Keep redirect:

```js
const redirectTo = location.state?.from || '/shop';
```

- [ ] **Step 8: Run browse tests**

Run:

```bash
npm run test -- src/pages/shop/shopBrowse.test.jsx
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/pages/shop/ShopLayout.jsx src/pages/shop/Home.jsx src/pages/shop/Category.jsx src/pages/shop/Detail.jsx src/pages/shop/LoginPage.jsx src/pages/shop/shopBrowse.test.jsx
git commit -m "feat: build c3 shop browse pages"
```

### Task 6: Implement Frontend Cart, Order, Pay, User, Address, And Favorites

**Files:**
- Modify: `src/pages/shop/Cart.jsx`
- Modify: `src/pages/shop/CreateOrder.jsx`
- Modify: `src/pages/shop/Pay.jsx`
- Modify: `src/pages/shop/PaySuccess.jsx`
- Modify: `src/pages/shop/OrderListPage.jsx`
- Modify: `src/pages/shop/OrderDetailPage.jsx`
- Modify: `src/pages/shop/UserPage.jsx`
- Modify: `src/pages/shop/AddressPage.jsx`
- Modify: `src/pages/shop/FavoritesPage.jsx`
- Create: `src/pages/shop/shopFlow.test.jsx`

- [ ] **Step 1: Write failing frontend flow tests**

Create `src/pages/shop/shopFlow.test.jsx`:

```jsx
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from '../../context/AppContext.jsx';
import { authService, cartService, databaseService, orderService } from '../../mock/mockService.js';
import { AddressPage } from './AddressPage.jsx';
import { Cart } from './Cart.jsx';
import { CreateOrder } from './CreateOrder.jsx';
import { FavoritesPage } from './FavoritesPage.jsx';
import { OrderDetailPage } from './OrderDetailPage.jsx';
import { OrderListPage } from './OrderListPage.jsx';
import { Pay } from './Pay.jsx';
import { PaySuccess } from './PaySuccess.jsx';
import { UserPage } from './UserPage.jsx';

function renderRoutes(initialEntries) {
  const router = createMemoryRouter(
    [
      { path: '/shop/cart', element: <Cart /> },
      { path: '/shop/create-order', element: <CreateOrder /> },
      { path: '/shop/pay/:orderId', element: <Pay /> },
      { path: '/shop/pay-success/:orderId', element: <PaySuccess /> },
      { path: '/shop/orders', element: <OrderListPage /> },
      { path: '/shop/orders/:orderId', element: <OrderDetailPage /> },
      { path: '/shop/user', element: <UserPage /> },
      { path: '/shop/address', element: <AddressPage /> },
      { path: '/shop/favorites', element: <FavoritesPage /> },
    ],
    { initialEntries },
  );

  return render(
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>,
  );
}

beforeEach(async () => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
  await authService.loginUser('member', '123456');
});

describe('shop transaction flow pages', () => {
  it('creates an order from selected cart items and pays it', async () => {
    const user = userEvent.setup();
    await cartService.addItem({
      userId: 'user-001',
      productId: 'p-001',
      skuId: 'p-001-standard',
      quantity: 1,
      selected: true,
    });

    renderRoutes(['/shop/cart']);

    expect(await screen.findByText('购物车')).toBeInTheDocument();
    expect(screen.getByText('曜石无线降噪耳机')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: '去结算' }));

    await waitFor(() => expect(screen.getByText('确认订单')).toBeInTheDocument());
    await user.type(screen.getByLabelText('订单备注'), 'C3 页面测试');
    await user.click(screen.getByRole('button', { name: '提交订单' }));

    await waitFor(() => expect(screen.getByText('模拟支付')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: '确认已支付' }));

    await waitFor(() => expect(screen.getByText('支付成功')).toBeInTheDocument());
    const paidOrder = orderService.listOrdersSync('user-001')[0];
    expect(paidOrder.status).toBe('paid');
    expect(cartService.listCartSync('user-001')).toHaveLength(0);
  });

  it('shows shipment logistics after admin service ships order', async () => {
    const created = await orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 1 }],
      addressId: 'addr-001',
      remark: '等待发货',
    });
    await orderService.payOrder(created.data.id);
    await orderService.shipOrder(created.data.id, {
      company: '顺丰速运',
      trackingNo: 'SF1000000001',
    });

    renderRoutes([`/shop/orders/${created.data.id}`]);

    expect(await screen.findByText('订单详情')).toBeInTheDocument();
    expect(screen.getByText('已发货')).toBeInTheDocument();
    expect(screen.getByText('顺丰速运')).toBeInTheDocument();
    expect(screen.getByText('SF1000000001')).toBeInTheDocument();
  });

  it('manages address and favorites pages', async () => {
    const user = userEvent.setup();
    renderRoutes(['/shop/address']);

    expect(await screen.findByText('地址管理')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增地址' }));
    await user.type(screen.getByLabelText('收货人'), '新收货人');
    await user.type(screen.getByLabelText('手机号'), '13900000000');
    await user.type(screen.getByLabelText('省份'), '上海市');
    await user.type(screen.getByLabelText('城市'), '上海市');
    await user.type(screen.getByLabelText('详细地址'), '演示路 1 号');
    await user.click(screen.getByRole('button', { name: '保存地址' }));

    await waitFor(() => expect(screen.getByText('新收货人')).toBeInTheDocument());

    renderRoutes(['/shop/favorites']);

    expect(await screen.findByText('我的收藏')).toBeInTheDocument();
  });

  it('renders user center entries and order list filter', async () => {
    renderRoutes(['/shop/user']);

    expect(await screen.findByText('测试会员')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '我的订单' })).toHaveAttribute('href', '/shop/orders');
    expect(screen.getByRole('link', { name: '我的收藏' })).toHaveAttribute('href', '/shop/favorites');
    expect(screen.getByRole('link', { name: '地址管理' })).toHaveAttribute('href', '/shop/address');

    renderRoutes(['/shop/orders']);

    expect(await screen.findByText('订单列表')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '已支付' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run frontend flow tests and verify failure**

Run:

```bash
npm run test -- src/pages/shop/shopFlow.test.jsx
```

Expected: FAIL because transaction pages are still route shells.

- [ ] **Step 3: Implement `Cart.jsx`**

Use these exact service calls:

```js
cartService.listCartSync(user.id)
cartService.updateItemQuantity(cartItemId, quantity)
cartService.toggleItemSelected(cartItemId, selected)
cartService.toggleAllSelected(user.id, selected)
cartService.removeItem(cartItemId)
cartService.calculateSelectedTotal(user.id)
```

Show exact texts:

```txt
购物车
全选
去结算
购物车还是空的
返回首页
```

The checkout action must navigate to:

```txt
/shop/create-order
```

- [ ] **Step 4: Implement `CreateOrder.jsx`**

Use:

```js
cartService.listCartSync(user.id).filter((item) => item.selected)
addressService.listByUserSync(user.id)
orderService.createOrder({ userId: user.id, items, addressId, remark })
cartService.clearSelectedItems(user.id)
```

Show exact texts and label:

```txt
确认订单
默认地址
商品清单
金额明细
订单备注
提交订单
暂无收货地址
请选择收货地址后再提交订单
请选择要结算的商品
```

After successful creation, navigate to:

```js
`/shop/pay/${result.data.id}`
```

- [ ] **Step 5: Implement `Pay.jsx` and `PaySuccess.jsx`**

`Pay.jsx` must read:

```js
const order = orderService.getOrderByIdSync(orderId);
```

Show exact texts:

```txt
模拟支付
确认已支付
订单不存在
支付倒计时
```

Countdown starts at `10 * 60`. When it reaches `0`, disable `确认已支付` and show:

```txt
支付已超时
```

After successful pay, navigate to:

```js
`/shop/pay-success/${orderId}`
```

`PaySuccess.jsx` must show:

```txt
支付成功
查看订单详情
继续逛逛
```

- [ ] **Step 6: Implement `OrderListPage.jsx` and `OrderDetailPage.jsx`**

Use:

```js
orderService.listOrdersSync(user.id)
orderService.getOrderByIdSync(orderId)
```

Order filter buttons must use exact labels:

```txt
待支付
已支付
已发货
已完成
已取消
```

`OrderDetailPage.jsx` must show exact text:

```txt
订单详情
商品快照
收货信息
支付信息
物流信息
暂无物流信息
订单不存在
```

- [ ] **Step 7: Implement `UserPage.jsx`, `AddressPage.jsx`, and `FavoritesPage.jsx`**

`UserPage.jsx` must show exact link texts:

```txt
我的订单
我的收藏
地址管理
退出登录
```

`AddressPage.jsx` must use:

```js
addressService.listByUserSync(user.id)
addressService.createAddress(payload)
addressService.updateAddress(addressId, payload)
addressService.deleteAddress(addressId)
addressService.setDefaultAddress(user.id, addressId)
```

Address form labels and actions must be exact:

```txt
地址管理
新增地址
编辑地址
收货人
手机号
省份
城市
详细地址
保存地址
设置默认
默认地址
删除
```

`FavoritesPage.jsx` must use:

```js
favoriteService.listFavoritesSync(user.id)
favoriteService.toggleFavorite(user.id, productId)
```

Show exact texts:

```txt
我的收藏
取消收藏
还没有收藏商品
```

- [ ] **Step 8: Run frontend flow tests**

Run:

```bash
npm run test -- src/pages/shop/shopFlow.test.jsx src/pages/shop/shopBrowse.test.jsx
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/pages/shop/Cart.jsx src/pages/shop/CreateOrder.jsx src/pages/shop/Pay.jsx src/pages/shop/PaySuccess.jsx src/pages/shop/OrderListPage.jsx src/pages/shop/OrderDetailPage.jsx src/pages/shop/UserPage.jsx src/pages/shop/AddressPage.jsx src/pages/shop/FavoritesPage.jsx src/pages/shop/shopFlow.test.jsx
git commit -m "feat: build c3 shop transaction flow"
```

### Task 7: Implement Admin Login, Layout, Dashboard, Product, Order, Account, And Read-Only Pages

**Files:**
- Modify: `src/pages/admin/AdminLayout.jsx`
- Modify: `src/pages/admin/AdminLoginPage.jsx`
- Modify: `src/pages/admin/Dashboard.jsx`
- Modify: `src/pages/admin/AdminProductPage.jsx`
- Modify: `src/pages/admin/AdminOrderPage.jsx`
- Modify: `src/pages/admin/AdminAccountPage.jsx`
- Modify: `src/pages/admin/NoPermissionPage.jsx`
- Modify: `src/pages/admin/AdminCategoryPage.jsx`
- Modify: `src/pages/admin/AdminRolePage.jsx`
- Modify: `src/pages/admin/AdminUserPage.jsx`
- Modify: `src/pages/admin/AdminLogPage.jsx`
- Create: `src/pages/admin/adminFlow.test.jsx`

- [ ] **Step 1: Write failing admin flow tests**

Create `src/pages/admin/adminFlow.test.jsx`:

```jsx
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { authService, databaseService, orderService, productService } from '../../mock/mockService.js';
import { AdminAccountPage } from './AdminAccountPage.jsx';
import { AdminCategoryPage } from './AdminCategoryPage.jsx';
import { AdminLogPage } from './AdminLogPage.jsx';
import { AdminLoginPage } from './AdminLoginPage.jsx';
import { AdminOrderPage } from './AdminOrderPage.jsx';
import { AdminProductPage } from './AdminProductPage.jsx';
import { AdminRolePage } from './AdminRolePage.jsx';
import { AdminUserPage } from './AdminUserPage.jsx';
import { Dashboard } from './Dashboard.jsx';
import { NoPermissionPage } from './NoPermissionPage.jsx';

function renderAdmin(initialEntries, element) {
  const router = createMemoryRouter([{ path: initialEntries[0], element }], { initialEntries });
  return render(<RouterProvider router={router} />);
}

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('admin c3 pages', () => {
  it('logs in with admin shortcut and operator shortcut', async () => {
    const user = userEvent.setup();
    renderAdmin(['/admin/login'], <AdminLoginPage />);

    expect(await screen.findByText('后台登录')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '管理员登录' }));
    await waitFor(() => expect(authService.getAdminSession().roleCode).toBe('admin'));

    authService.logoutAdmin();
    await user.click(screen.getByRole('button', { name: '普通运营登录' }));
    await waitFor(() => expect(authService.getAdminSession().roleCode).toBe('operator'));
  });

  it('shows dashboard summary from current service data', async () => {
    await authService.loginAdmin('admin', 'admin123');
    renderAdmin(['/admin/dashboard'], <Dashboard />);

    expect(await screen.findByText('数据看板')).toBeInTheDocument();
    expect(screen.getByText('商品总数')).toBeInTheDocument();
    expect(screen.getByText('上架商品')).toBeInTheDocument();
    expect(screen.getByText('待发货订单')).toBeInTheDocument();
    expect(screen.getByText('最近订单')).toBeInTheDocument();
  });

  it('creates edits toggles and deletes a product', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    renderAdmin(['/admin/products'], <AdminProductPage />);

    expect(await screen.findByText('商品管理')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增商品' }));
    await user.type(screen.getByLabelText('商品名称'), '后台 C3 商品');
    await user.click(screen.getByLabelText('商品分类'));
    await user.click(await screen.findByText('效率办公'));
    await user.clear(screen.getByLabelText('商品价格'));
    await user.type(screen.getByLabelText('商品价格'), '288');
    await user.clear(screen.getByLabelText('商品库存'));
    await user.type(screen.getByLabelText('商品库存'), '12');
    await user.type(screen.getByLabelText('商品图片'), 'https://dummyimage.com/640x480/e8eef3/203244&text=admin');
    await user.click(screen.getByRole('button', { name: '保存商品' }));

    await waitFor(() => expect(screen.getByText('后台 C3 商品')).toBeInTheDocument());
    const created = productService.listProductsSync().find((product) => product.name === '后台 C3 商品');
    expect(created).toBeTruthy();

    await user.click(screen.getByRole('button', { name: `下架 ${created.name}` }));
    await waitFor(() => expect(productService.getProductByIdSync(created.id).status).toBe('offline'));

    await user.click(screen.getByRole('button', { name: `删除 ${created.name}` }));
    await waitFor(() => expect(productService.getProductByIdSync(created.id)).toBeNull());
  });

  it('ships a paid order and writes logistics', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    const created = await orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 1 }],
      addressId: 'addr-001',
      remark: '后台发货测试',
    });
    await orderService.payOrder(created.data.id);

    renderAdmin(['/admin/orders'], <AdminOrderPage />);

    expect(await screen.findByText('订单管理')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `发货 ${created.data.id}` }));
    await user.type(screen.getByLabelText('物流公司'), '顺丰速运');
    await user.type(screen.getByLabelText('物流单号'), 'SF1000000001');
    await user.click(screen.getByRole('button', { name: '确认发货' }));

    await waitFor(() => expect(orderService.getOrderByIdSync(created.data.id).status).toBe('shipped'));
    expect(orderService.getOrderByIdSync(created.data.id).logistics[0].trackingNo).toBe('SF1000000001');
  });

  it('renders account, no permission, and read-only admin pages', async () => {
    await authService.loginAdmin('operator', 'op123456');

    renderAdmin(['/admin/account'], <AdminAccountPage />);
    expect(await screen.findByText('账号设置')).toBeInTheDocument();
    expect(screen.getByText('普通运营')).toBeInTheDocument();

    renderAdmin(['/admin/products'], <NoPermissionPage />);
    expect(await screen.findByText('无权限')).toBeInTheDocument();

    renderAdmin(['/admin/categories'], <AdminCategoryPage />);
    expect(await screen.findByText('分类管理')).toBeInTheDocument();

    renderAdmin(['/admin/roles'], <AdminRolePage />);
    expect(await screen.findByText('权限角色')).toBeInTheDocument();

    renderAdmin(['/admin/users'], <AdminUserPage />);
    expect(await screen.findByText('用户管理')).toBeInTheDocument();

    renderAdmin(['/admin/logs'], <AdminLogPage />);
    expect(await screen.findByText('操作日志')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run admin flow tests and verify failure**

Run:

```bash
npm run test -- src/pages/admin/adminFlow.test.jsx
```

Expected: FAIL because admin pages are still route shells.

- [ ] **Step 3: Modify `AdminLayout.jsx`**

Keep the exact `menuItems` path list from the current file:

```js
[
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/orders',
  '/admin/roles',
  '/admin/users',
  '/admin/account',
  '/admin/logs',
]
```

Use Ant Design `Layout`, `Menu`, and `Outlet`. Add a header area that reads current admin session via `authService.getAdminSession()` and shows:

```txt
商城管理端
云仓后台
```

- [ ] **Step 4: Modify `AdminLoginPage.jsx`**

Keep form login and add exact shortcut buttons:

```txt
管理员登录
普通运营登录
```

Shortcut credentials:

```js
await authService.loginAdmin('admin', 'admin123')
await authService.loginAdmin('operator', 'op123456')
```

Keep redirect:

```js
const redirectTo = location.state?.from || '/admin/dashboard';
```

- [ ] **Step 5: Modify `Dashboard.jsx`**

Use:

```js
dashboardService.getSummary()
```

Show exact dashboard labels:

```txt
数据看板
商品总数
上架商品
订单总数
已支付订单
待发货订单
最近订单
```

- [ ] **Step 6: Modify `AdminProductPage.jsx`**

Use:

```js
productService.listPagedProducts({ page, pageSize, keyword, status, categoryId })
productService.createProduct(payload)
productService.updateProduct(payload)
productService.deleteProduct(productId)
productService.toggleProductStatus(productId, status)
categoryService.listCategoriesSync()
```

Show exact table column titles:

```txt
商品图片
商品名称
分类
价格
库存
销量
状态
操作
```

Search placeholder:

```txt
搜索商品名称
```

Action button accessible names must follow:

```js
`编辑 ${product.name}`
`删除 ${product.name}`
`下架 ${product.name}`
`上架 ${product.name}`
```

- [ ] **Step 7: Modify `AdminOrderPage.jsx`**

Use:

```js
orderService.listPagedOrders({ page, pageSize, status, keyword })
orderService.getOrderByIdSync(orderId)
orderService.shipOrder(orderId, payload)
```

Show exact texts:

```txt
订单管理
订单状态
查看详情
发货
订单详情
物流信息
```

Shipment action accessible name:

```js
`发货 ${order.id}`
```

- [ ] **Step 8: Modify account, no-permission, and read-only pages**

Use exact page titles:

```txt
账号设置
无权限
分类管理
权限角色
用户管理
操作日志
```

Data sources:

```js
authService.getAdminSession()
categoryService.listCategoriesSync()
logService.listLogsSync()
```

For roles and users, read through `localStorage` is not allowed. Add service methods in `src/mock/mockService.js` before using them:

```js
roleService.listRolesSync()
userService.listUsersSync()
```

Add a small service test in `src/mock/mockService.c3.test.js` before implementation:

```js
import { roleService, userService } from './mockService.js';

it('reads roles and users through service APIs', () => {
  expect(roleService.listRolesSync()).toHaveLength(2);
  expect(userService.listUsersSync()).toHaveLength(1);
});
```

Then export:

```js
export const roleService = {
  listRolesSync() {},
};

export const userService = {
  listUsersSync() {},
};
```

- [ ] **Step 9: Run admin flow and service tests**

Run:

```bash
npm run test -- src/pages/admin/adminFlow.test.jsx src/mock/mockService.c3.test.js
```

Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/pages/admin src/components/admin src/mock/mockService.js src/mock/mockService.c3.test.js src/pages/admin/adminFlow.test.jsx
git commit -m "feat: build c3 admin management pages"
```

### Task 8: Update Route Guard Tests For Full C3 Routes

**Files:**
- Modify: `src/router.test.jsx`

- [ ] **Step 1: Replace route guard tests with full route assertions**

Replace `src/router.test.jsx` with:

```jsx
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from './context/AppContext.jsx';
import { authService, databaseService } from './mock/mockService.js';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.jsx';
import { AdminProductPage } from './pages/admin/AdminProductPage.jsx';
import { NoPermissionPage } from './pages/admin/NoPermissionPage.jsx';
import { Cart } from './pages/shop/Cart.jsx';
import { LoginPage } from './pages/shop/LoginPage.jsx';

function RequireShopAuthForTest({ children }) {
  const session = authService.getUserSession();
  if (!session) return <LoginPage />;
  return children;
}

function RequireAdminProductsForTest({ children }) {
  const session = authService.getAdminSession();
  if (!session) return <AdminLoginPage />;
  if (session.roleCode !== 'admin') return <NoPermissionPage />;
  return children;
}

function renderWithRouter(routes, initialEntries) {
  const router = createMemoryRouter(routes, { initialEntries });
  return render(
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('route guards', () => {
  it('shows shop login when cart is accessed without user session', async () => {
    renderWithRouter(
      [
        {
          path: '/shop/cart',
          element: (
            <RequireShopAuthForTest>
              <Cart />
            </RequireShopAuthForTest>
          ),
        },
      ],
      ['/shop/cart'],
    );

    expect(await screen.findByText('前台登录')).toBeInTheDocument();
  });

  it('blocks operator from admin product page', async () => {
    await authService.loginAdmin('operator', 'op123456');
    renderWithRouter(
      [
        {
          path: '/admin/products',
          element: (
            <RequireAdminProductsForTest>
              <AdminProductPage />
            </RequireAdminProductsForTest>
          ),
        },
      ],
      ['/admin/products'],
    );

    await waitFor(() => expect(screen.getByText('无权限')).toBeInTheDocument());
  });

  it('allows admin to reach admin product page', async () => {
    await authService.loginAdmin('admin', 'admin123');
    renderWithRouter(
      [
        {
          path: '/admin/products',
          element: (
            <RequireAdminProductsForTest>
              <AdminProductPage />
            </RequireAdminProductsForTest>
          ),
        },
      ],
      ['/admin/products'],
    );

    await waitFor(() => expect(screen.getByText('商品管理')).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run route tests**

Run:

```bash
npm run test -- src/router.test.jsx
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/router.test.jsx
git commit -m "test: cover c3 route permissions"
```

### Task 9: Final Verification And Visual Smoke Check

**Files:**
- No new files unless tests reveal a defect.

- [ ] **Step 1: Run complete automated verification**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected:

```txt
Test Files ... passed
Tests ... passed
```

```txt
eslint . 
```

exits with code `0`.

```txt
vite build
```

exits with code `0`. If Vite prints a chunk size warning while returning code `0`, record it in the verification note and do not change dependencies during C3.

- [ ] **Step 2: Run local visual smoke check**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Open these paths in Browser:

```txt
http://127.0.0.1:5173/shop
http://127.0.0.1:5173/shop/category
http://127.0.0.1:5173/shop/detail/p-001
http://127.0.0.1:5173/shop/cart
http://127.0.0.1:5173/admin/login
http://127.0.0.1:5173/admin/dashboard
http://127.0.0.1:5173/admin/products
http://127.0.0.1:5173/admin/orders
```

Verify:

```txt
前台页面宽度不超过 max-w-md
前台底部导航固定显示且当前页高亮为 #1F6F8B
首页不显示 恒温香薰加湿器
后台登录页有 管理员登录 和 普通运营登录
后台商品管理页有搜索、状态筛选、分类筛选、新增商品
后台订单管理页对已支付订单显示发货按钮
```

- [ ] **Step 3: Check git status**

Run:

```bash
git status --short
```

Expected: `.superpowers/` is the only untracked path. No C3 source files are unstaged.

- [ ] **Step 4: Commit fixes only if verification required changes**

If Step 1 or Step 2 required code changes, commit them:

```bash
git add src
git commit -m "fix: stabilize c3 demo chain verification"
```

Expected: no commit is made if there were no verification changes.

---

## 防火墙 2：计划到执行自检

1. **消灭模糊描述词：** 本计划的实现任务均指向具体文件、具体导出名、具体页面文本、具体按钮名称、具体服务返回结构、具体验证命令。执行阶段必须以测试与列出的文本、路径、服务接口为准。
2. **微型可执行度度量：** 每个任务包含文件范围、先写失败测试、运行失败测试、实现接口或页面、运行通过测试、提交命令。服务方法、路由路径、localStorage key、订单状态、角色 code、表单 label、按钮 accessible name 均已在计划中写明。

## Final Acceptance

- `npm run test` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Admin creates or toggles a product and frontend online product lists update from the same local data.
- Frontend creates and pays an order, then admin order page can see it.
- Admin ships a paid order, then frontend order detail shows logistics.
- Operator account accessing product management shows `无权限`.
- `.superpowers/`, `AGENT_PIPELINE_SUPERPOWERS.md`, `design.md`, and `prompt.md` are not committed by this C3 implementation.
