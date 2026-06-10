# Mall Foundation And Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the project foundation for the high-score mall: React 18, React Router 6, Tailwind CSS, Ant Design 5, Vitest, local offline data services, Context state, and route guards.

**Architecture:** This plan creates the shared foundation used by later shop and admin page plans. This plan creates route shell pages only so guards, layouts, and navigation can compile and be tested; final shop UI and final admin UI are implemented in later plans. All business data access goes through `src/mock/mockService.js`; components and contexts do not read or write `localStorage` directly.

**Tech Stack:** React 18.3.1, React DOM 18.3.1, React Router DOM 6.30.4, Tailwind CSS 4.3.0, `@tailwindcss/vite` 4.3.0, Ant Design 5.29.3, `@ant-design/icons` 6.2.5, Vitest 4.1.8, React Testing Library 16.3.2, Testing Library DOM 10.4.1, Testing Library user-event 14.6.1, JSDOM 29.1.1, Vite 8.0.10.

---

## Scope

This is the first implementation plan only. It covers:

- Dependency migration and tooling configuration.
- `src/mock/mockData.js`.
- `src/mock/mockService.js`.
- `src/context/AppContext.jsx`.
- `src/router.jsx` route tree and guards.
- Route shell pages needed for route compilation and guard verification.
- Foundation tests for storage, cart totals, auth permissions, and order status changes.

This plan does not implement final shop UI, final admin UI, `Report.md`, or packing. Those get separate plans after this foundation passes verification.

## Dependency Audit

These package facts were checked with `npm view` on 2026-06-11:

- `react@18.3.1`: available.
- `react-dom@18.3.1`: available.
- `react-router-dom@6.30.4`: available.
- `react-router@6.30.4`: available.
- `antd@5.29.3`: MIT, peer dependencies include React and React DOM `>=16.9.0`.
- `@ant-design/icons@6.2.5`: MIT, peer dependencies include React and React DOM `>=16.0.0`.
- `tailwindcss@4.3.0`: MIT.
- `@tailwindcss/vite@4.3.0`: MIT, peer dependency supports Vite 8.
- `vitest@4.1.8`: MIT.
- `@testing-library/react@16.3.2`: MIT, peer dependencies include React and React DOM `^18.0.0 || ^19.0.0`.
- `@testing-library/dom@10.4.1`: MIT.
- `@testing-library/user-event@14.6.1`: MIT.
- `@testing-library/jest-dom@6.9.1`: MIT.
- `jsdom@29.1.1`: MIT.

## File Map

- Modify: `package.json`  
  Owns scripts and dependency versions.
- Modify: `package-lock.json`  
  Updated by `npm install`.
- Modify: `vite.config.js`  
  Owns Vite React and Tailwind plugin setup.
- Modify: `eslint.config.js`  
  Adds test globals for Vitest and Testing Library tests.
- Modify: `src/main.jsx`  
  Mounts `App`.
- Modify: `src/App.jsx`  
  Wraps providers and router.
- Modify: `src/index.css`  
  Tailwind entry and global tokens.
- Delete or stop using: `src/App.css`  
  No route or component imports it after this plan.
- Create: `src/mock/mockData.js`  
  Initial offline database seed data.
- Create: `src/mock/mockService.js`  
  Offline async CRUD, auth, cart, order, logs, schema repair.
- Create: `src/context/AppContext.jsx`  
  Frontend global state and actions.
- Replace: `src/router.jsx`  
  React Router 6 route tree and route guards.
- Create: `src/pages/shop/*.jsx`  
  Route shell pages for compile-safe shop routes.
- Create: `src/pages/admin/*.jsx`  
  Route shell pages for compile-safe admin routes.
- Create: `src/test/setup.js`  
  Vitest DOM matchers setup.
- Create: `src/mock/mockService.test.js`  
  Foundation service tests.
- Create: `src/router.test.jsx`  
  Route guard tests.

## Data Shape Contract

Use these exact `localStorage` keys:

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

Use these exact role codes:

```js
export const ADMIN_ROLE_CODES = {
  admin: 'admin',
  operator: 'operator',
};
```

Use these exact order status codes:

```js
export const ORDER_STATUS = {
  pendingPayment: 'pending_payment',
  paid: 'paid',
  shipped: 'shipped',
  completed: 'completed',
  canceled: 'canceled',
};
```

Use these exact service result shapes:

```js
{ success: true, data, message: '' }
{ success: false, data: null, message: '明确中文错误信息' }
```

---

### Task 1: Migrate Dependencies And Tooling

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.js`
- Modify: `eslint.config.js`
- Create: `src/test/setup.js`

- [ ] **Step 1: Update dependencies with exact packages**

Run:

```bash
npm install react@18.3.1 react-dom@18.3.1 react-router@6.30.4 react-router-dom@6.30.4 antd@5.29.3 @ant-design/icons@6.2.5
npm install -D tailwindcss@4.3.0 @tailwindcss/vite@4.3.0 vitest@4.1.8 @testing-library/react@16.3.2 @testing-library/dom@10.4.1 @testing-library/user-event@14.6.1 @testing-library/jest-dom@6.9.1 jsdom@29.1.1 @types/react@18.3.31 @types/react-dom@18.3.7
```

Expected: `package.json` and `package-lock.json` update. `react` and `react-dom` are `^18.3.1`; `react-router` and `react-router-dom` are `^6.30.4`; `antd` is `^5.29.3`.

- [ ] **Step 2: Update scripts in `package.json`**

Set the scripts object exactly to:

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "test": "vitest run",
  "test:watch": "vitest",
  "preview": "vite preview",
  "check": "node tool/check.cjs",
  "pack": "node tool/pack.cjs"
}
```

- [ ] **Step 3: Update `vite.config.js`**

Replace file contents with:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
});
```

- [ ] **Step 4: Update `eslint.config.js` for test globals**

Replace file contents with:

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
  },
]);
```

- [ ] **Step 5: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Run dependency verification**

Run:

```bash
npm ls react react-dom react-router react-router-dom antd @ant-design/icons tailwindcss @tailwindcss/vite vitest @testing-library/react jsdom
```

Expected: command exits with code `0` and lists the exact installed packages without peer dependency errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js eslint.config.js src/test/setup.js
git commit -m "chore: migrate mall foundation dependencies"
```

### Task 2: Replace App Entry And Global Styles

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Modify: `src/router.jsx`

- [ ] **Step 1: Replace `src/index.css`**

```css
@import "tailwindcss";

:root {
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
  color: #182433;
  background: #eef3f7;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 0%, rgba(31, 111, 139, 0.14), transparent 28rem),
    linear-gradient(180deg, #f7fafc 0%, #eef3f7 100%);
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 2: Replace `src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 3: Replace `src/App.jsx` with temporary router shell**

```jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';

export function App() {
  return <RouterProvider router={router} />;
}
```

- [ ] **Step 4: Replace `src/router.jsx` with temporary route**

```jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

function TemporaryHome() {
  return (
    <main className="min-h-screen p-6 text-slate-900">
      <h1 className="text-3xl font-bold">云仓优品</h1>
      <p className="mt-3 text-slate-600">商城系统基础路由已启动。</p>
    </main>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/shop" replace /> },
  { path: '/shop', element: <TemporaryHome /> },
]);

export default router;
```

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: `vite build` succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/main.jsx src/App.jsx src/index.css src/router.jsx
git commit -m "chore: reset app shell for mall routing"
```

### Task 3: Create Mock Seed Data

**Files:**
- Create: `src/mock/mockData.js`

- [ ] **Step 1: Create `src/mock/mockData.js`**

```js
export const ADMIN_ROLE_CODES = {
  admin: 'admin',
  operator: 'operator',
};

export const ORDER_STATUS = {
  pendingPayment: 'pending_payment',
  paid: 'paid',
  shipped: 'shipped',
  completed: 'completed',
  canceled: 'canceled',
};

export const categories = [
  { id: 'cat-digital', name: '数码办公', parentId: null, sort: 1 },
  { id: 'cat-home', name: '家居生活', parentId: null, sort: 2 },
  { id: 'cat-food', name: '品质食品', parentId: null, sort: 3 },
  { id: 'cat-beauty', name: '个护清洁', parentId: null, sort: 4 },
  { id: 'cat-sport', name: '运动户外', parentId: null, sort: 5 },
  { id: 'cat-fashion', name: '服饰箱包', parentId: null, sort: 6 },
  { id: 'cat-digital-audio', name: '智能影音', parentId: 'cat-digital', sort: 11 },
  { id: 'cat-digital-office', name: '效率办公', parentId: 'cat-digital', sort: 12 },
  { id: 'cat-home-storage', name: '收纳整理', parentId: 'cat-home', sort: 21 },
  { id: 'cat-home-light', name: '氛围照明', parentId: 'cat-home', sort: 22 },
  { id: 'cat-food-coffee', name: '咖啡茶饮', parentId: 'cat-food', sort: 31 },
  { id: 'cat-food-snack', name: '健康零食', parentId: 'cat-food', sort: 32 },
  { id: 'cat-beauty-care', name: '身体护理', parentId: 'cat-beauty', sort: 41 },
  { id: 'cat-beauty-clean', name: '清洁工具', parentId: 'cat-beauty', sort: 42 },
  { id: 'cat-sport-training', name: '训练装备', parentId: 'cat-sport', sort: 51 },
  { id: 'cat-fashion-bag', name: '通勤箱包', parentId: 'cat-fashion', sort: 61 },
];

const productNames = [
  ['p-001', '曜石无线降噪耳机', 'cat-digital-audio', 699, 98],
  ['p-002', '雾银桌面拓展坞', 'cat-digital-office', 329, 56],
  ['p-003', '云感人体工学鼠标', 'cat-digital-office', 199, 84],
  ['p-004', '星河便携投影仪', 'cat-digital-audio', 1699, 18],
  ['p-005', '低蓝光阅读台灯', 'cat-home-light', 259, 72],
  ['p-006', '模块化桌面收纳盒', 'cat-home-storage', 89, 140],
  ['p-007', '亚麻感四件套', 'cat-home-storage', 459, 42],
  ['p-008', '恒温香薰加湿器', 'cat-home-light', 299, 31],
  ['p-009', '深烘挂耳咖啡 30 包', 'cat-food-coffee', 119, 220],
  ['p-010', '冷萃咖啡液礼盒', 'cat-food-coffee', 149, 160],
  ['p-011', '海盐黑巧坚果棒', 'cat-food-snack', 69, 260],
  ['p-012', '低脂燕麦脆片', 'cat-food-snack', 59, 190],
  ['p-013', '雪松香氛沐浴露', 'cat-beauty-care', 79, 120],
  ['p-014', '云柔洗脸巾 6 包', 'cat-beauty-clean', 45, 300],
  ['p-015', '静音筋膜放松器', 'cat-sport-training', 399, 46],
  ['p-016', '轻量瑜伽垫', 'cat-sport-training', 129, 88],
  ['p-017', '城市通勤双肩包', 'cat-fashion-bag', 369, 35],
  ['p-018', '防泼水斜挎包', 'cat-fashion-bag', 189, 66],
  ['p-019', '磁吸无线充电座', 'cat-digital-office', 159, 95],
  ['p-020', '智能温湿度计', 'cat-home-light', 99, 115],
  ['p-021', '胶囊咖啡随行杯', 'cat-food-coffee', 139, 70],
  ['p-022', '柚香护手霜套装', 'cat-beauty-care', 88, 102],
  ['p-023', '可折叠健身凳', 'cat-sport-training', 499, 12],
  ['p-024', '商务证件卡包', 'cat-fashion-bag', 119, 93],
  ['p-025', '桌面理线套装', 'cat-digital-office', 49, 240],
  ['p-026', '智能入睡小夜灯', 'cat-home-light', 179, 52],
  ['p-027', '每日坚果礼盒', 'cat-food-snack', 129, 180],
  ['p-028', '高密清洁海绵组', 'cat-beauty-clean', 39, 330],
  ['p-029', '速干运动毛巾', 'cat-sport-training', 59, 150],
  ['p-030', '极简电脑内胆包', 'cat-fashion-bag', 149, 75],
];

export const products = productNames.map(([id, name, categoryId, price, stock], index) => ({
  id,
  name,
  categoryId,
  price,
  stock,
  sales: 320 - index * 7,
  image: `https://dummyimage.com/640x480/e8eef3/203244&text=${encodeURIComponent(name)}`,
  status: index === 7 ? 'offline' : 'online',
  tags: index % 3 === 0 ? ['热门', '精选'] : index % 3 === 1 ? ['新品'] : ['限时特惠'],
  skuOptions: [
    { id: `${id}-standard`, name: '标准版', stock: Math.max(0, stock - 5), price },
    { id: `${id}-pro`, name: '进阶版', stock: Math.max(0, Math.floor(stock / 2)), price: price + 60 },
  ],
  description: `${name}，为高效生活与可信赖购物体验精选。`,
  createdAt: '2026-06-01T08:00:00.000Z',
  updatedAt: '2026-06-01T08:00:00.000Z',
}));

export const users = [
  {
    id: 'user-001',
    username: 'member',
    password: '123456',
    name: '测试会员',
    phone: '13800000000',
  },
];

export const admins = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    roleCode: ADMIN_ROLE_CODES.admin,
  },
  {
    id: 'admin-002',
    username: 'operator',
    password: 'op123456',
    name: '普通运营',
    roleCode: ADMIN_ROLE_CODES.operator,
  },
];

export const roles = [
  {
    code: ADMIN_ROLE_CODES.admin,
    name: '管理员',
    permissions: ['dashboard', 'products', 'categories', 'orders', 'roles', 'users', 'account', 'logs'],
  },
  {
    code: ADMIN_ROLE_CODES.operator,
    name: '普通运营',
    permissions: ['dashboard', 'orders', 'account'],
  },
];

export const addresses = [
  {
    id: 'addr-001',
    userId: 'user-001',
    receiver: '测试会员',
    phone: '13800000000',
    province: '浙江省',
    city: '杭州市',
    detail: '云仓路 88 号',
    isDefault: true,
  },
];

export const orders = [
  {
    id: 'ORD_202606010001',
    userId: 'user-001',
    status: ORDER_STATUS.paid,
    totalAmount: 699,
    createdAt: '2026-06-01T09:30:00.000Z',
    paidAt: '2026-06-01T09:35:00.000Z',
    addressSnapshot: addresses[0],
    items: [
      {
        productId: 'p-001',
        productName: '曜石无线降噪耳机',
        skuId: 'p-001-standard',
        skuName: '标准版',
        quantity: 1,
        price: 699,
      },
    ],
    logistics: [],
    remark: '工作日配送',
  },
];

export const logs = [
  {
    id: 'log-001',
    actor: '管理员',
    action: '系统初始化',
    detail: '写入基础演示数据',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
];

export const initialDatabase = {
  categories,
  products,
  users,
  admins,
  roles,
  addresses,
  orders,
  logs,
  cart: [],
  favorites: [],
  session: null,
  adminSession: null,
};
```

- [ ] **Step 2: Run a syntax check**

Run:

```bash
node --check src/mock/mockData.js
```

Expected: command exits with code `0`.

- [ ] **Step 3: Commit**

```bash
git add src/mock/mockData.js
git commit -m "feat: seed offline mall data"
```

### Task 4: Implement Mock Service And Unit Tests

**Files:**
- Create: `src/mock/mockService.js`
- Create: `src/mock/mockService.test.js`

- [ ] **Step 1: Create failing tests in `src/mock/mockService.test.js`**

```js
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ADMIN_ROLE_CODES,
  ORDER_STATUS,
  STORAGE_KEYS,
  authService,
  cartService,
  databaseService,
  orderService,
  permissionService,
  productService,
} from './mockService.js';

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('mockService database foundation', () => {
  it('initializes products and repairs damaged JSON', async () => {
    expect(productService.listProductsSync()).toHaveLength(30);
    localStorage.setItem(STORAGE_KEYS.products, '{bad-json');

    const result = await productService.listProducts();

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(30);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.products))).toHaveLength(30);
  });

  it('calculates selected cart totals', async () => {
    await cartService.addItem({
      userId: 'user-001',
      productId: 'p-001',
      skuId: 'p-001-standard',
      quantity: 2,
      selected: true,
    });
    await cartService.addItem({
      userId: 'user-001',
      productId: 'p-002',
      skuId: 'p-002-standard',
      quantity: 1,
      selected: false,
    });

    const total = cartService.calculateSelectedTotal('user-001');

    expect(total.totalQuantity).toBe(2);
    expect(total.totalAmount).toBe(1398);
  });

  it('checks admin permissions by role', () => {
    expect(permissionService.canAccess(ADMIN_ROLE_CODES.admin, 'products')).toBe(true);
    expect(permissionService.canAccess(ADMIN_ROLE_CODES.operator, 'products')).toBe(false);
    expect(permissionService.canAccess(ADMIN_ROLE_CODES.operator, 'orders')).toBe(true);
  });

  it('moves order from pending payment to paid', async () => {
    const created = await orderService.createOrder({
      userId: 'user-001',
      items: [
        {
          productId: 'p-001',
          skuId: 'p-001-standard',
          quantity: 1,
        },
      ],
      addressId: 'addr-001',
      remark: '请尽快发货',
    });

    expect(created.success).toBe(true);
    expect(created.data.status).toBe(ORDER_STATUS.pendingPayment);

    const paid = await orderService.payOrder(created.data.id);

    expect(paid.success).toBe(true);
    expect(paid.data.status).toBe(ORDER_STATUS.paid);
  });

  it('logs in frontend and admin users separately', async () => {
    const userResult = await authService.loginUser('member', '123456');
    const adminResult = await authService.loginAdmin('admin', 'admin123');

    expect(userResult.success).toBe(true);
    expect(adminResult.success).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.session)).username).toBe('member');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.adminSession)).roleCode).toBe(ADMIN_ROLE_CODES.admin);
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test -- src/mock/mockService.test.js
```

Expected: FAIL because `src/mock/mockService.js` does not exist or does not export required symbols.

- [ ] **Step 3: Create `src/mock/mockService.js`**

```js
import {
  ADMIN_ROLE_CODES,
  ORDER_STATUS,
  admins,
  initialDatabase,
  roles,
} from './mockData.js';

export { ADMIN_ROLE_CODES, ORDER_STATUS };

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

const SCHEMA_VERSION = '2026-06-11-foundation-v1';
const NETWORK_DELAY_MS = 200;

function ok(data, message = '') {
  return { success: true, data, message };
}

function fail(message) {
  return { success: false, data: null, message };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function delay(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), NETWORK_DELAY_MS);
  });
}

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    const value = clone(fallback);
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const value = clone(fallback);
    localStorage.setItem(key, JSON.stringify(value));
    if (key !== STORAGE_KEYS.logs) {
      appendLog('系统', '数据修复', `${key} 数据损坏，已恢复初始数据`);
    }
    return value;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function appendLog(actor, action, detail) {
  const logs = readJson(STORAGE_KEYS.logs, initialDatabase.logs);
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    actor,
    action,
    detail,
    createdAt: new Date().toISOString(),
  };
  logs.unshift(log);
  writeJson(STORAGE_KEYS.logs, logs);
  return log;
}

function seedKey(key, value, force) {
  if (force || localStorage.getItem(key) === null) {
    writeJson(key, value);
  }
}

export const databaseService = {
  initializeDatabase({ force = false } = {}) {
    seedKey(STORAGE_KEYS.products, initialDatabase.products, force);
    seedKey(STORAGE_KEYS.categories, initialDatabase.categories, force);
    seedKey(STORAGE_KEYS.orders, initialDatabase.orders, force);
    seedKey(STORAGE_KEYS.users, initialDatabase.users, force);
    seedKey(STORAGE_KEYS.admins, initialDatabase.admins, force);
    seedKey(STORAGE_KEYS.roles, initialDatabase.roles, force);
    seedKey(STORAGE_KEYS.cart, initialDatabase.cart, force);
    seedKey(STORAGE_KEYS.favorites, initialDatabase.favorites, force);
    seedKey(STORAGE_KEYS.addresses, initialDatabase.addresses, force);
    seedKey(STORAGE_KEYS.logs, initialDatabase.logs, force);
    seedKey(STORAGE_KEYS.session, initialDatabase.session, force);
    seedKey(STORAGE_KEYS.adminSession, initialDatabase.adminSession, force);
    localStorage.setItem(STORAGE_KEYS.schemaVersion, SCHEMA_VERSION);
    return ok({ schemaVersion: SCHEMA_VERSION });
  },
};

export const productService = {
  listProductsSync() {
    return readJson(STORAGE_KEYS.products, initialDatabase.products);
  },
  async listProducts(filters = {}) {
    const products = productService.listProductsSync();
    const filtered = products.filter((product) => {
      if (filters.status && product.status !== filters.status) return false;
      if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
      if (filters.keyword && !product.name.includes(filters.keyword)) return false;
      return true;
    });
    return delay(ok(filtered));
  },
  getProductByIdSync(productId) {
    return productService.listProductsSync().find((product) => product.id === productId) || null;
  },
  async updateProduct(product) {
    if (!product.name?.trim()) return delay(fail('商品名称不能为空'));
    if (Number(product.price) < 0) return delay(fail('商品价格不能为负数'));
    if (Number(product.stock) < 0) return delay(fail('商品库存不能为负数'));

    const products = productService.listProductsSync();
    const nextProducts = products.map((item) =>
      item.id === product.id ? { ...item, ...product, updatedAt: new Date().toISOString() } : item,
    );
    writeJson(STORAGE_KEYS.products, nextProducts);
    appendLog('管理员', '商品编辑', `编辑商品 ${product.name}`);
    return delay(ok(product));
  },
};

export const categoryService = {
  listCategoriesSync() {
    return readJson(STORAGE_KEYS.categories, initialDatabase.categories);
  },
  async listCategories() {
    return delay(ok(categoryService.listCategoriesSync()));
  },
};

export const authService = {
  async loginUser(username, password) {
    const users = readJson(STORAGE_KEYS.users, initialDatabase.users);
    const user = users.find((item) => item.username === username && item.password === password);
    if (!user) return delay(fail('用户名或密码错误'));
    const session = { id: user.id, username: user.username, name: user.name };
    writeJson(STORAGE_KEYS.session, session);
    return delay(ok(session));
  },
  logoutUser() {
    writeJson(STORAGE_KEYS.session, null);
    return ok(null);
  },
  getUserSession() {
    return readJson(STORAGE_KEYS.session, null);
  },
  async loginAdmin(username, password) {
    const adminList = readJson(STORAGE_KEYS.admins, initialDatabase.admins);
    const admin = adminList.find((item) => item.username === username && item.password === password);
    if (!admin) return delay(fail('后台账号或密码错误'));
    const session = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      roleCode: admin.roleCode,
    };
    writeJson(STORAGE_KEYS.adminSession, session);
    appendLog(admin.name, '后台登录', `${admin.name} 登录后台`);
    return delay(ok(session));
  },
  logoutAdmin() {
    writeJson(STORAGE_KEYS.adminSession, null);
    return ok(null);
  },
  getAdminSession() {
    return readJson(STORAGE_KEYS.adminSession, null);
  },
};

export const permissionService = {
  canAccess(roleCode, permission) {
    const roleList = readJson(STORAGE_KEYS.roles, initialDatabase.roles);
    const role = roleList.find((item) => item.code === roleCode);
    return Boolean(role?.permissions.includes(permission));
  },
  canAccessAdminRoute(pathname, session = authService.getAdminSession()) {
    if (!session) return false;
    const routePermissionMap = {
      '/admin/dashboard': 'dashboard',
      '/admin/products': 'products',
      '/admin/categories': 'categories',
      '/admin/orders': 'orders',
      '/admin/roles': 'roles',
      '/admin/users': 'users',
      '/admin/account': 'account',
      '/admin/logs': 'logs',
    };
    const permission = routePermissionMap[pathname] || 'dashboard';
    return permissionService.canAccess(session.roleCode, permission);
  },
};

export const cartService = {
  listCartSync(userId) {
    return readJson(STORAGE_KEYS.cart, initialDatabase.cart).filter((item) => item.userId === userId);
  },
  async addItem({ userId, productId, skuId, quantity, selected = true }) {
    const product = productService.getProductByIdSync(productId);
    if (!product) return delay(fail('商品不存在'));
    if (product.status !== 'online') return delay(fail('商品已下架'));
    const sku = product.skuOptions.find((item) => item.id === skuId);
    if (!sku) return delay(fail('商品规格不存在'));
    if (quantity <= 0) return delay(fail('商品数量必须大于 0'));
    if (sku.stock < quantity) return delay(fail('库存不足'));

    const cart = readJson(STORAGE_KEYS.cart, initialDatabase.cart);
    const existing = cart.find((item) => item.userId === userId && item.productId === productId && item.skuId === skuId);
    if (existing) {
      existing.quantity += quantity;
      existing.selected = selected;
    } else {
      cart.push({
        id: `cart-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        userId,
        productId,
        skuId,
        quantity,
        selected,
      });
    }
    writeJson(STORAGE_KEYS.cart, cart);
    return delay(ok(cartService.listCartSync(userId)));
  },
  calculateSelectedTotal(userId) {
    const cart = cartService.listCartSync(userId).filter((item) => item.selected);
    return cart.reduce(
      (summary, item) => {
        const product = productService.getProductByIdSync(item.productId);
        const sku = product?.skuOptions.find((skuItem) => skuItem.id === item.skuId);
        if (!product || !sku) return summary;
        return {
          totalQuantity: summary.totalQuantity + item.quantity,
          totalAmount: summary.totalAmount + sku.price * item.quantity,
        };
      },
      { totalQuantity: 0, totalAmount: 0 },
    );
  },
};

export const addressService = {
  listByUserSync(userId) {
    return readJson(STORAGE_KEYS.addresses, initialDatabase.addresses).filter((item) => item.userId === userId);
  },
  getByIdSync(addressId) {
    return readJson(STORAGE_KEYS.addresses, initialDatabase.addresses).find((item) => item.id === addressId) || null;
  },
};

export const orderService = {
  listOrdersSync(userId) {
    const orders = readJson(STORAGE_KEYS.orders, initialDatabase.orders);
    return userId ? orders.filter((order) => order.userId === userId) : orders;
  },
  async createOrder({ userId, items, addressId, remark }) {
    if (!items?.length) return delay(fail('订单商品不能为空'));
    const address = addressService.getByIdSync(addressId);
    if (!address) return delay(fail('收货地址不存在'));

    const orderItems = [];
    let totalAmount = 0;
    for (const item of items) {
      const product = productService.getProductByIdSync(item.productId);
      if (!product) return delay(fail('商品不存在'));
      if (product.status !== 'online') return delay(fail('商品已下架'));
      const sku = product.skuOptions.find((skuItem) => skuItem.id === item.skuId);
      if (!sku) return delay(fail('商品规格不存在'));
      if (sku.stock < item.quantity) return delay(fail('库存不足'));
      totalAmount += sku.price * item.quantity;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        skuId: sku.id,
        skuName: sku.name,
        quantity: item.quantity,
        price: sku.price,
      });
    }

    const order = {
      id: `ORD_${Date.now()}`,
      userId,
      status: ORDER_STATUS.pendingPayment,
      totalAmount,
      createdAt: new Date().toISOString(),
      paidAt: null,
      addressSnapshot: clone(address),
      items: orderItems,
      logistics: [],
      remark: remark || '',
    };
    const orders = orderService.listOrdersSync();
    orders.unshift(order);
    writeJson(STORAGE_KEYS.orders, orders);
    return delay(ok(order));
  },
  async payOrder(orderId) {
    const orders = orderService.listOrdersSync();
    const order = orders.find((item) => item.id === orderId);
    if (!order) return delay(fail('订单不存在'));
    if (order.status !== ORDER_STATUS.pendingPayment) return delay(fail('订单状态不允许支付'));
    order.status = ORDER_STATUS.paid;
    order.paidAt = new Date().toISOString();
    writeJson(STORAGE_KEYS.orders, orders);
    return delay(ok(order));
  },
};

export const logService = {
  listLogsSync() {
    return readJson(STORAGE_KEYS.logs, initialDatabase.logs);
  },
};
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test -- src/mock/mockService.test.js
```

Expected: PASS, all 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/mock/mockService.js src/mock/mockService.test.js
git commit -m "feat: add offline mall service layer"
```

### Task 5: Implement App Context And Tests

**Files:**
- Create: `src/context/AppContext.jsx`
- Create: `src/context/AppContext.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create failing tests in `src/context/AppContext.test.jsx`**

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider, useAppContext } from './AppContext.jsx';
import { databaseService } from '../mock/mockService.js';

function Probe() {
  const { state, loginUser, logoutUser } = useAppContext();
  return (
    <div>
      <p data-testid="user">{state.user?.username || '未登录'}</p>
      <button type="button" onClick={() => loginUser('member', '123456')}>
        登录
      </button>
      <button type="button" onClick={logoutUser}>
        退出
      </button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('AppContext', () => {
  it('logs in and logs out frontend user', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );

    expect(screen.getByTestId('user')).toHaveTextContent('未登录');

    await user.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('member'));

    await user.click(screen.getByRole('button', { name: '退出' }));

    expect(screen.getByTestId('user')).toHaveTextContent('未登录');
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```bash
npm run test -- src/context/AppContext.test.jsx
```

Expected: FAIL because `src/context/AppContext.jsx` does not exist.

- [ ] **Step 3: Create `src/context/AppContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { authService, databaseService } from '../mock/mockService.js';

const AppContext = createContext(null);

const initialState = {
  user: null,
  loading: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, error: '' };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    databaseService.initializeDatabase();
    dispatch({ type: 'SET_USER', payload: authService.getUserSession() });
  }, []);

  const actions = useMemo(
    () => ({
      async loginUser(username, password) {
        dispatch({ type: 'SET_LOADING', payload: true });
        const result = await authService.loginUser(username, password);
        dispatch({ type: 'SET_LOADING', payload: false });
        if (!result.success) {
          dispatch({ type: 'SET_ERROR', payload: result.message });
          return result;
        }
        dispatch({ type: 'SET_USER', payload: result.data });
        return result;
      },
      logoutUser() {
        authService.logoutUser();
        dispatch({ type: 'SET_USER', payload: null });
      },
    }),
    [],
  );

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useAppContext 必须在 AppProvider 内使用');
  }
  return value;
}
```

- [ ] **Step 4: Update `src/App.jsx`**

```jsx
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { router } from './router.jsx';

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm run test -- src/context/AppContext.test.jsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/context/AppContext.jsx src/context/AppContext.test.jsx src/App.jsx
git commit -m "feat: add mall app context"
```

### Task 6: Implement Route Tree, Guards, And Route Shell Pages

**Files:**
- Replace: `src/router.jsx`
- Create: `src/pages/shop/ShopLayout.jsx`
- Create: `src/pages/shop/Home.jsx`
- Create: `src/pages/shop/Category.jsx`
- Create: `src/pages/shop/Detail.jsx`
- Create: `src/pages/shop/Cart.jsx`
- Create: `src/pages/shop/CreateOrder.jsx`
- Create: `src/pages/shop/Pay.jsx`
- Create: `src/pages/shop/PaySuccess.jsx`
- Create: `src/pages/shop/OrderListPage.jsx`
- Create: `src/pages/shop/OrderDetailPage.jsx`
- Create: `src/pages/shop/UserPage.jsx`
- Create: `src/pages/shop/AddressPage.jsx`
- Create: `src/pages/shop/FavoritesPage.jsx`
- Create: `src/pages/shop/LoginPage.jsx`
- Create: `src/pages/admin/AdminLayout.jsx`
- Create: `src/pages/admin/AdminLoginPage.jsx`
- Create: `src/pages/admin/Dashboard.jsx`
- Create: `src/pages/admin/AdminProductPage.jsx`
- Create: `src/pages/admin/AdminCategoryPage.jsx`
- Create: `src/pages/admin/AdminOrderPage.jsx`
- Create: `src/pages/admin/AdminRolePage.jsx`
- Create: `src/pages/admin/AdminUserPage.jsx`
- Create: `src/pages/admin/AdminAccountPage.jsx`
- Create: `src/pages/admin/AdminLogPage.jsx`
- Create: `src/pages/admin/NoPermissionPage.jsx`
- Create: `src/router.test.jsx`

- [ ] **Step 1: Create `src/pages/shop/ShopLayout.jsx`**

```jsx
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/shop', label: '首页' },
  { to: '/shop/category', label: '分类' },
  { to: '/shop/cart', label: '购物车' },
  { to: '/shop/user', label: '我的' },
];

export function ShopLayout() {
  return (
    <div className="min-h-screen bg-slate-100 pb-20 text-slate-900">
      <Outlet />
      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/shop'} className="text-sm font-medium text-slate-600">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Create shop route shell pages**

Create these files with exactly this pattern, changing the exported function and title as listed:

`src/pages/shop/Home.jsx`

```jsx
export function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-md p-6">
      <p className="text-sm font-semibold text-cyan-700">云仓优品</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950">可信赖的精选商城</h1>
      <p className="mt-3 text-slate-600">首页完整视觉和商品模块将在前台页面计划中实现。</p>
    </main>
  );
}
```

`src/pages/shop/Category.jsx`

```jsx
export function Category() {
  return <main className="mx-auto max-w-md p-6 text-slate-900">分类页路由桩</main>;
}
```

`src/pages/shop/Detail.jsx`

```jsx
import { useParams } from 'react-router-dom';

export function Detail() {
  const { productId } = useParams();
  return <main className="mx-auto max-w-md p-6 text-slate-900">商品详情：{productId}</main>;
}
```

`src/pages/shop/Cart.jsx`

```jsx
export function Cart() {
  return <main className="mx-auto max-w-md p-6 text-slate-900">购物车页路由桩</main>;
}
```

`src/pages/shop/CreateOrder.jsx`

```jsx
export function CreateOrder() {
  return <main className="mx-auto max-w-md p-6 text-slate-900">创建订单页路由桩</main>;
}
```

`src/pages/shop/Pay.jsx`

```jsx
import { useParams } from 'react-router-dom';

export function Pay() {
  const { orderId } = useParams();
  return <main className="mx-auto max-w-md p-6 text-slate-900">支付订单：{orderId}</main>;
}
```

`src/pages/shop/PaySuccess.jsx`

```jsx
import { useParams } from 'react-router-dom';

export function PaySuccess() {
  const { orderId } = useParams();
  return <main className="mx-auto max-w-md p-6 text-slate-900">支付成功：{orderId}</main>;
}
```

`src/pages/shop/OrderListPage.jsx`

```jsx
export function OrderListPage() {
  return <main className="mx-auto max-w-md p-6 text-slate-900">订单列表页路由桩</main>;
}
```

`src/pages/shop/OrderDetailPage.jsx`

```jsx
import { useParams } from 'react-router-dom';

export function OrderDetailPage() {
  const { orderId } = useParams();
  return <main className="mx-auto max-w-md p-6 text-slate-900">订单详情：{orderId}</main>;
}
```

`src/pages/shop/UserPage.jsx`

```jsx
export function UserPage() {
  return <main className="mx-auto max-w-md p-6 text-slate-900">我的页面路由桩</main>;
}
```

`src/pages/shop/AddressPage.jsx`

```jsx
export function AddressPage() {
  return <main className="mx-auto max-w-md p-6 text-slate-900">地址页路由桩</main>;
}
```

`src/pages/shop/FavoritesPage.jsx`

```jsx
export function FavoritesPage() {
  return <main className="mx-auto max-w-md p-6 text-slate-900">收藏页路由桩</main>;
}
```

`src/pages/shop/LoginPage.jsx`

```jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, state } = useAppContext();
  const redirectTo = location.state?.from || '/shop';

  async function handleLogin() {
    const result = await loginUser('member', '123456');
    if (result.success) navigate(redirectTo, { replace: true });
  }

  return (
    <main className="mx-auto max-w-md p-6 text-slate-900">
      <h1 className="text-2xl font-bold">前台登录</h1>
      {state.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      <button type="button" onClick={handleLogin} className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-white">
        使用测试会员登录
      </button>
    </main>
  );
}
```

- [ ] **Step 3: Create admin route shell pages**

`src/pages/admin/AdminLayout.jsx`

```jsx
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', label: <Link to="/admin/dashboard">数据看板</Link> },
  { key: 'products', label: <Link to="/admin/products">商品管理</Link> },
  { key: 'categories', label: <Link to="/admin/categories">分类管理</Link> },
  { key: 'orders', label: <Link to="/admin/orders">订单管理</Link> },
  { key: 'roles', label: <Link to="/admin/roles">权限角色</Link> },
  { key: 'users', label: <Link to="/admin/users">用户管理</Link> },
  { key: 'account', label: <Link to="/admin/account">账号设置</Link> },
  { key: 'logs', label: <Link to="/admin/logs">操作日志</Link> },
];

export function AdminLayout() {
  return (
    <Layout className="min-h-screen">
      <Sider width={220}>
        <div className="px-5 py-4 text-lg font-bold text-white">云仓后台</div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header className="bg-white text-lg font-semibold text-slate-900">商城管理端</Header>
        <Content className="m-6 rounded-2xl bg-white p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
```

`src/pages/admin/AdminLoginPage.jsx`

```jsx
import { Button, Card, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../mock/mockService.js';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin/dashboard';

  async function handleFinish(values) {
    const result = await authService.loginAdmin(values.username, values.password);
    if (result.success) navigate(redirectTo, { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card title="后台登录" className="w-full max-w-sm">
        <Form layout="vertical" onFinish={handleFinish} initialValues={{ username: 'admin', password: 'admin123' }}>
          <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入后台账号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入后台密码' }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
      </Card>
    </main>
  );
}
```

Create `src/pages/admin/Dashboard.jsx`:

```jsx
export function Dashboard() {
  return <div>数据看板路由桩</div>;
}
```

Create `src/pages/admin/AdminProductPage.jsx`:

```jsx
export function AdminProductPage() {
  return <div>商品管理路由桩</div>;
}
```

Create `src/pages/admin/AdminCategoryPage.jsx`:

```jsx
export function AdminCategoryPage() {
  return <div>分类管理路由桩</div>;
}
```

Create `src/pages/admin/AdminOrderPage.jsx`:

```jsx
export function AdminOrderPage() {
  return <div>订单管理路由桩</div>;
}
```

Create `src/pages/admin/AdminRolePage.jsx`:

```jsx
export function AdminRolePage() {
  return <div>权限角色路由桩</div>;
}
```

Create `src/pages/admin/AdminUserPage.jsx`:

```jsx
export function AdminUserPage() {
  return <div>用户管理路由桩</div>;
}
```

Create `src/pages/admin/AdminAccountPage.jsx`:

```jsx
export function AdminAccountPage() {
  return <div>账号设置路由桩</div>;
}
```

Create `src/pages/admin/AdminLogPage.jsx`:

```jsx
export function AdminLogPage() {
  return <div>操作日志路由桩</div>;
}
```

Create `src/pages/admin/NoPermissionPage.jsx`:

```jsx
import { Result } from 'antd';

export function NoPermissionPage() {
  return <Result status="403" title="无权限" subTitle="当前后台账号无权访问该模块" />;
}
```

- [ ] **Step 4: Replace `src/router.jsx`**

```jsx
import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom';
import { authService, permissionService } from './mock/mockService.js';
import { AdminLayout } from './pages/admin/AdminLayout.jsx';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.jsx';
import { AdminAccountPage } from './pages/admin/AdminAccountPage.jsx';
import { AdminCategoryPage } from './pages/admin/AdminCategoryPage.jsx';
import { AdminLogPage } from './pages/admin/AdminLogPage.jsx';
import { AdminOrderPage } from './pages/admin/AdminOrderPage.jsx';
import { AdminProductPage } from './pages/admin/AdminProductPage.jsx';
import { AdminRolePage } from './pages/admin/AdminRolePage.jsx';
import { AdminUserPage } from './pages/admin/AdminUserPage.jsx';
import { Dashboard } from './pages/admin/Dashboard.jsx';
import { NoPermissionPage } from './pages/admin/NoPermissionPage.jsx';
import { AddressPage } from './pages/shop/AddressPage.jsx';
import { Cart } from './pages/shop/Cart.jsx';
import { Category } from './pages/shop/Category.jsx';
import { CreateOrder } from './pages/shop/CreateOrder.jsx';
import { Detail } from './pages/shop/Detail.jsx';
import { FavoritesPage } from './pages/shop/FavoritesPage.jsx';
import { Home } from './pages/shop/Home.jsx';
import { LoginPage } from './pages/shop/LoginPage.jsx';
import { OrderDetailPage } from './pages/shop/OrderDetailPage.jsx';
import { OrderListPage } from './pages/shop/OrderListPage.jsx';
import { Pay } from './pages/shop/Pay.jsx';
import { PaySuccess } from './pages/shop/PaySuccess.jsx';
import { ShopLayout } from './pages/shop/ShopLayout.jsx';
import { UserPage } from './pages/shop/UserPage.jsx';

function RequireShopAuth({ children }) {
  const location = useLocation();
  const session = authService.getUserSession();
  if (!session) {
    return <Navigate to="/shop/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function RequireAdminAuth({ permission, children }) {
  const location = useLocation();
  const session = authService.getAdminSession();
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  if (!permissionService.canAccess(session.roleCode, permission)) {
    return <NoPermissionPage />;
  }
  return children;
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/shop" replace /> },
  {
    path: '/shop',
    element: <ShopLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'category', element: <Category /> },
      { path: 'detail/:productId', element: <Detail /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'pay/:orderId', element: <Pay /> },
      { path: 'pay-success/:orderId', element: <PaySuccess /> },
      {
        path: 'cart',
        element: (
          <RequireShopAuth>
            <Cart />
          </RequireShopAuth>
        ),
      },
      {
        path: 'create-order',
        element: (
          <RequireShopAuth>
            <CreateOrder />
          </RequireShopAuth>
        ),
      },
      {
        path: 'orders',
        element: (
          <RequireShopAuth>
            <OrderListPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'orders/:orderId',
        element: (
          <RequireShopAuth>
            <OrderDetailPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'user',
        element: (
          <RequireShopAuth>
            <UserPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'address',
        element: (
          <RequireShopAuth>
            <AddressPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'favorites',
        element: (
          <RequireShopAuth>
            <FavoritesPage />
          </RequireShopAuth>
        ),
      },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RequireAdminAuth permission="dashboard">
            <Dashboard />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'products',
        element: (
          <RequireAdminAuth permission="products">
            <AdminProductPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'categories',
        element: (
          <RequireAdminAuth permission="categories">
            <AdminCategoryPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'orders',
        element: (
          <RequireAdminAuth permission="orders">
            <AdminOrderPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'roles',
        element: (
          <RequireAdminAuth permission="roles">
            <AdminRolePage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'users',
        element: (
          <RequireAdminAuth permission="users">
            <AdminUserPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'account',
        element: (
          <RequireAdminAuth permission="account">
            <AdminAccountPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'logs',
        element: (
          <RequireAdminAuth permission="logs">
            <AdminLogPage />
          </RequireAdminAuth>
        ),
      },
    ],
  },
]);

export default router;
```

- [ ] **Step 5: Create route guard tests in `src/router.test.jsx`**

```jsx
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from './context/AppContext.jsx';
import { authService, databaseService } from './mock/mockService.js';
import { Cart } from './pages/shop/Cart.jsx';
import { LoginPage } from './pages/shop/LoginPage.jsx';
import { AdminProductPage } from './pages/admin/AdminProductPage.jsx';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.jsx';
import { NoPermissionPage } from './pages/admin/NoPermissionPage.jsx';

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
});
```

- [ ] **Step 6: Run route tests**

Run:

```bash
npm run test -- src/router.test.jsx
```

Expected: PASS.

- [ ] **Step 7: Run build and lint**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands exit with code `0`.

- [ ] **Step 8: Commit**

```bash
git add src/router.jsx src/pages/shop src/pages/admin src/router.test.jsx
git commit -m "feat: add mall route foundation"
```

### Task 7: Remove Legacy Root-Level Implementation And Verify Foundation

**Files:**
- Delete: `src/App.css`
- Delete: `src/contexts/ServiceContext.jsx`
- Delete: `src/services/goodService.js`
- Delete: `src/services/orderService.js`
- Delete: `src/pages/LoginPage.jsx`
- Delete: `src/pages/HomePage.jsx`
- Delete: `src/pages/DetailPage.jsx`
- Delete: `src/pages/CreateOrderPage.jsx`
- Delete: `src/pages/PayPage.jsx`
- Delete: `src/pages/OrderListPage.jsx`
- Delete: `src/pages/OrderDetailPage.jsx`

- [ ] **Step 1: Delete legacy files that are replaced by the new route foundation**

Run:

```powershell
Remove-Item -LiteralPath src/App.css
Remove-Item -LiteralPath src/contexts/ServiceContext.jsx
Remove-Item -LiteralPath src/services/goodService.js
Remove-Item -LiteralPath src/services/orderService.js
Remove-Item -LiteralPath src/pages/LoginPage.jsx
Remove-Item -LiteralPath src/pages/HomePage.jsx
Remove-Item -LiteralPath src/pages/DetailPage.jsx
Remove-Item -LiteralPath src/pages/CreateOrderPage.jsx
Remove-Item -LiteralPath src/pages/PayPage.jsx
Remove-Item -LiteralPath src/pages/OrderListPage.jsx
Remove-Item -LiteralPath src/pages/OrderDetailPage.jsx
```

Expected: all listed files are removed.

- [ ] **Step 2: Confirm no legacy imports remain**

Run:

```bash
rg "ServiceContext|goodService|orderService|App.css" src
```

Expected: no matches.

- [ ] **Step 3: Run complete foundation verification**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected: all commands exit with code `0`.

- [ ] **Step 4: Commit cleanup**

```bash
git add -u src/App.css src/contexts src/services src/pages
git commit -m "chore: remove legacy mall implementation"
```

---

## Self-Review Checklist

- Spec coverage: This plan covers dependency migration, Tailwind/AntD/Vitest setup, local data keys, seed data, offline service, Context, route guards, and tests. It intentionally leaves final shop UI, final admin UI, `Report.md`, `metadata.json`, check, and pack for later plans.
- Scope wording scan: The plan creates route shell pages for this foundation scope. It does not claim those route shell pages are final shop or admin UI.
- Type consistency: `STORAGE_KEYS`, `ADMIN_ROLE_CODES`, `ORDER_STATUS`, service names, and route paths are defined once and reused consistently.
- Verification: Each implementation task includes tests, build, lint, or dependency checks and a commit point.
