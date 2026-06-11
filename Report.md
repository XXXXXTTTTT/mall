# 第四次作业报告

**姓名：** 待组长填写  
**学号：** 待组长填写  
**作业名称：** React 商城系统

---

## 1. 组员分工

| 姓名 | 学号 | 分工与产出 | 贡献占比 |
|------|------|-----------|---------|
| 待组长填写（组长） | 待组长填写 | 项目需求拆解、前台商城主流程、后台管理端、测试与报告整合 | 待组长填写 |
| 待组长填写 | 待组长填写 | UI 设计、前台页面视觉优化、响应式适配 | 待组长填写 |
| 待组长填写 | 待组长填写 | Mock 数据、Context 状态管理、前后台数据联动 | 待组长填写 |
| 待组长填写 | 待组长填写 | 测试用例、自检、打包与文档整理 | 待组长填写 |

## 2. 项目结构

项目采用 React + React Router 的页面路由结构，前台商城和后台管理端分离。公共业务数据集中在 `src/mock`，全局状态集中在 `src/context/AppContext.jsx`，页面组件放在 `src/pages`，前台复用组件放在 `src/components/shop`。

```
App / Router
├── /shop                         前台商城端
│   ├── Home                      商城主页面
│   ├── Category                  分类索引页
│   ├── Detail                    商品详情页
│   ├── Cart                      购物车页
│   ├── CreateOrder               创建订单页
│   ├── Pay / PaySuccess          模拟支付与支付成功页
│   ├── OrderList / OrderDetail   订单列表与订单详情页
│   ├── User                      我的页面
│   ├── Address                   地址管理页
│   └── Favorites / Login         收藏与前台登录页
├── /admin                        后台管理端
│   ├── Dashboard                 后台概览
│   ├── Products                  商品管理
│   ├── Categories                分类管理
│   ├── Orders                    订单管理
│   ├── Roles / Users             权限角色与用户
│   └── Account / Logs            账号信息与操作日志
└── src/mock                      本地 Mock Service 与种子数据
```

| 页面/组件 | 职责 |
|-----------|------|
| `src/router.jsx` | 定义前台、后台路由，并通过路由守卫控制登录与权限访问 |
| `AppContext.jsx` | 管理前台用户、购物车、收藏、订单、地址等全局状态 |
| `Home.jsx` | 展示搜索框、轮播图、快捷入口、热门商品、新品精选和限时特惠 |
| `Category.jsx` | 展示全部分类索引、排序筛选和商品网格 |
| `Detail.jsx` | 展示商品大图、价格、规格、库存、收藏、加入购物车和立即购买 |
| `Cart.jsx` | 展示购物车商品，支持选中、全选、数量修改、删除和结算 |
| `CreateOrder.jsx` | 确认地址、商品清单、订单备注和提交订单 |
| `Pay.jsx` / `PaySuccess.jsx` | 模拟支付倒计时、支付确认和支付成功反馈 |
| `OrderListPage.jsx` / `OrderDetailPage.jsx` | 展示订单筛选、订单状态、商品信息、收货信息、支付信息和物流信息 |
| `UserPage.jsx` | 展示用户信息、积分、优惠券、收藏数、订单数、最近订单和功能入口 |

## 3. 前台功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 商城主页面（搜索框/轮播图/热门商品） | `/shop` 使用玻璃搜索框、`HeroCarousel` 轮播组件和热门商品网格，商品数据来自 `productService.listProductsSync()`，自动过滤下架商品 |
| 分类页 | `/shop/category` 展示全部分类索引、父分类入口、排序按钮和商品列表，支持综合、价格升序、价格降序、销量优先 |
| 商品详情页 | `/shop/detail/:productId` 展示商品图片、状态、价格、描述、SKU、库存和数量选择，支持收藏、加入购物车和立即购买 |
| 购物车 | `/shop/cart` 展示已加入商品，支持全选、单项选中、数量修改、删除、选中结算，并使用 `aria-pressed` 表达选中状态 |
| 创建订单 | `/shop/create-order` 展示默认地址、地址选择、商品清单、金额明细和订单备注，提交后生成待支付订单 |
| 支付页面 | `/shop/pay/:orderId` 展示支付金额、支付倒计时和模拟支付面板，确认支付后跳转支付成功页 |
| 订单列表 | `/shop/orders` 展示订单状态筛选、订单摘要和金额，筛选按钮使用 `aria-pressed` 表达激活状态 |
| 订单详情 | `/shop/orders/:orderId` 展示订单状态、商品快照、收货信息、支付信息和物流时间线 |
| 我的页面 | `/shop/user` 展示用户身份、积分、优惠券、收藏数、订单数、最近订单和我的订单/收藏/地址入口 |
| 用户登录/注册 | `/shop/login` 使用测试会员登录，登录后可访问购物车、下单、订单、地址、收藏等受保护页面 |

## 4. 后台管理端功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 后台登录 | `/admin/login` 使用 `authService.loginAdmin` 验证管理员或运营账号，登录后写入后台 session |
| 权限管理 | `RequireAdminAuth` 结合 `permissionService.canAccess` 控制后台模块访问；管理员可访问商品、分类、订单、角色、用户等模块，普通运营仅访问允许模块 |
| 商品管理 | `/admin/products` 支持商品列表、创建、编辑、上下架等操作，并与前台商品列表通过 localStorage 数据联动 |
| 分类管理 | `/admin/categories` 支持分类数据展示与维护，分类数据与前台分类索引共用 Mock 数据源 |
| 订单管理 | `/admin/orders` 支持查看订单、修改订单状态和发货；发货后前台订单详情展示物流公司与运单号 |

## 5. 路由设计

项目使用 `createBrowserRouter` 定义路由。前台 `/shop` 使用 `ShopLayout` 和底部导航，后台 `/admin` 使用 `AdminLayout` 和权限路由守卫。

```jsx
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/shop" replace /> },
  {
    path: '/shop',
    element: <ShopLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'category', element: <Category /> },
      { path: 'detail/:productId', element: <Detail /> },
      { path: 'cart', element: <RequireShopAuth><Cart /></RequireShopAuth> },
      { path: 'create-order', element: <RequireShopAuth><CreateOrder /></RequireShopAuth> },
      { path: 'pay/:orderId', element: <Pay /> },
      { path: 'orders/:orderId', element: <RequireShopAuth><OrderDetailPage /></RequireShopAuth> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <RequireAdminAuth permission="dashboard"><Dashboard /></RequireAdminAuth> },
      { path: 'products', element: <RequireAdminAuth permission="products"><AdminProductPage /></RequireAdminAuth> },
      { path: 'orders', element: <RequireAdminAuth permission="orders"><AdminOrderPage /></RequireAdminAuth> },
    ],
  },
]);
```

## 6. 状态管理与数据存储

- **全局状态管理方式：** 使用 React Context + `useReducer`，在 `AppContext.jsx` 中集中管理前台用户、购物车、收藏、订单和地址状态。
- **数据存储方式：** 使用 localStorage + Mock Service。`src/mock/mockData.js` 提供种子数据，`src/mock/mockService.js` 封装商品、分类、购物车、订单、地址、收藏、登录和权限服务。
- **前后台数据联动方式：** 前台和后台共用 localStorage 中的商品、分类、订单等数据。后台上下架商品、发货订单后，前台页面可读取到更新后的商品状态和物流信息。

## 7. 加分项完成情况

- [x] **数据持久化**：购物车、用户 session、后台 session、商品、订单、地址、收藏等数据写入 localStorage，刷新后仍可读取。
- [x] **表单验证**：前台地址管理、创建订单、支付状态、后台登录、商品表单等均有错误提示或状态保护。
- [x] **支付模拟优化**：支付页实现倒计时、模拟支付面板、超时禁用和支付成功跳转。
- [x] **响应式布局**：前台商城采用移动端优先设计，桌面端居中显示 `max-w-md` 手机预览布局。
- [x] **单元测试**：使用 Vitest 和 Testing Library 覆盖 Mock Service、AppContext、路由守卫、前台浏览、购物车下单支付、后台流程和样式合同。
- [x] **数据联动**：后台商品/订单管理与前台商品展示、订单详情通过同一 Mock Service 和 localStorage 联动。
- [ ] **后端联动**：本项目未接入真实后端 API，使用 Mock Service 模拟后端接口。
- [ ] **分页/无限滚动**：当前商品和订单列表使用完整列表展示，未实现分页或无限滚动。
- [ ] **部署上线**：当前阶段未提供线上访问链接。

## 8. 遇到的问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 首页最初缺少 README 要求的轮播图 | 新增 `HeroCarousel` 组件，并在 `shopBrowse.test.jsx` 中加入 `shop-hero-carousel` 断言，确保首页包含搜索、轮播和热门商品 |
| 购物车从 checkbox 改为按钮后选中状态不够明确 | 为全选和单项选择按钮加入 `aria-pressed`，并在测试中验证选中状态与汇总数量变化 |
| 地址和收藏列表中多个操作按钮名称重复 | 为地址操作加入收货人上下文，为取消收藏加入商品名上下文，并补充测试覆盖 |
| 支付、订单、地址等页面视觉风格不统一 | 抽取 `ShopIcon`、`IconButton`、`GlassBar`、`IOSCard`、`SettingRow`、`MetricTile` 等前台组件，统一 iOS 风格、44px 触控尺寸和玻璃底栏 |
| 前后台数据需要联动但无真实后端 | 使用 Mock Service 封装 localStorage 数据读写，前台和后台共用商品、分类、订单等数据源 |

## 9. 测试与验证

本项目执行的核心验证命令如下：

```bash
npm run test
npm run lint
npm run build
node tool/check.cjs
```

已通过的自动化验证包括：

| 验证项 | 结果 |
|--------|------|
| Vitest 全量测试 | 10 个测试文件、74 个用例通过 |
| ESLint | 通过 |
| Vite 生产构建 | 通过，存在正常 chunk size 提示 |
| 作业自检脚本 | 代码构建与报告主体通过；真实姓名、学号、组员信息需组长填写 |
