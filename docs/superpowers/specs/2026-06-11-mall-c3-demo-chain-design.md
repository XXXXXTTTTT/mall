# Mall C3 完整演示链设计规格

## 1. 目标与范围

本规格定义地基阶段之后的下一轮实现范围：`C3` 完整演示链。

本轮目标不是把所有页面一次做满，而是用一条可课堂演示、可自测、可拿高分的业务链路，把以下能力完整证明出来：

- 前台商城可完成浏览、加购、下单、支付、查单。
- 后台管理可完成商品上下架、商品增改删查、订单查看、订单发货。
- 前后台读取同一份本地离线数据，刷新页面后状态不丢失。
- 后台权限生效，普通运营不能进入商品管理。
- 核心联动有自动化测试覆盖。

本轮直接覆盖以下现有路由壳文件对应的页面：

- 前台：`/shop`、`/shop/category`、`/shop/detail/:productId`、`/shop/cart`、`/shop/create-order`、`/shop/pay/:orderId`、`/shop/pay-success/:orderId`、`/shop/orders`、`/shop/orders/:orderId`、`/shop/user`、`/shop/address`、`/shop/favorites`、`/shop/login`
- 后台：`/admin/login`、`/admin/dashboard`、`/admin/products`、`/admin/orders`、`/admin/account`

本轮不实现以下完整能力：

- `Report.md`
- `metadata.json` 人工信息填写
- `node tool/check.cjs` 与 `node tool/pack.cjs` 最终交付包装
- `AdminCategoryPage.jsx`、`AdminRolePage.jsx`、`AdminUserPage.jsx`、`AdminLogPage.jsx` 的完整 CRUD
- 真实后端 API

## 2. 演示链定义

课堂演示与验收统一采用这一条链路：

1. 管理员登录后台。
2. 在商品管理页新增商品、编辑商品、切换上下架状态。
3. 前台首页、分类页、详情页只展示 `online` 商品；刚下架的商品立即从可售流中消失。
4. 普通会员登录前台，进入详情页选择 SKU，加入购物车。
5. 在购物车页选择商品结算，进入创建订单页。
6. 在创建订单页选择默认地址、填写备注并创建订单。
7. 在支付页完成模拟支付，跳转支付成功页。
8. 在订单列表与订单详情页看到刚刚创建的订单与支付状态。
9. 后台订单管理页看到新订单，对已支付订单执行发货。
10. 前台订单详情页刷新后看到订单状态和物流信息变化。
11. 普通运营登录后台访问 `/admin/products`，显示无权限页面。

这条链路是本轮设计中心。所有页面和服务优先服务于这条链路，不为了“页面数量好看”增加偏题功能。

## 3. 视觉与交互方向

### 3.1 产品定位

- 主题对象：可信赖的精品零售商城
- 前台受众：移动端购物用户
- 后台受众：课程验收中的管理者视角
- 本轮页面的唯一任务：让用户和老师一眼看出“前后台是同一个系统，且联动真实成立”

### 3.2 前台视觉系统

前台沿用已确认方向：“后台友好商务感”延展出的“现代极简 + 商业质感”。

颜色令牌：

- `Ink Navy`: `#182433`
- `Steel Blue`: `#203244`
- `Mist Gray`: `#EEF3F7`
- `Paper White`: `#F7FAFC`
- `Calm Teal`: `#1F6F8B`
- `Soft Amber`: `#C6922B`

字体角色：

- 标题：`"Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif`
- 正文：`"Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif`
- 数据与价格：沿用正文，但使用更强字重与更紧凑字距

布局原则：

- 移动端优先，主内容宽度控制在 `max-w-md`
- 首页使用一块强识别度 hero 区，下面接商品分区卡片
- 分类、购物车、订单等功能页重视留白、卡片分组和轻量分隔
- 底部导航保持固定，但当前页高亮必须明显

前台签名元素：

- 使用“深蓝弧面焦点模块”作为首页 hero 与详情页主要视觉锚点
- 商品卡不做廉价促销红黄堆叠，而是用标签、库存、上下架状态和价格层级构建质感

### 3.3 后台视觉系统

后台仍使用 Ant Design 5，但不接受默认演示后台观感。

后台风格要求：

- 顶层布局保留侧边栏 + 主工作区
- 主工作区使用浅灰背景与白色功能卡片
- 数据看板卡片采用深色标题、细边框、轻阴影，不使用夸张渐变
- 商品表格和订单表格需要明显的筛选区、状态标签和操作区层次

## 4. 页面级设计

### 4.1 前台页面

#### `src/pages/shop/Home.jsx`

首页承担“可售商品展示入口”的角色，必须实现：

- 顶部搜索框
- 一块 hero 轮播区域
- 三个商品分区：热门推荐、新品精选、限时特惠
- 仅展示 `product.status === 'online'` 的商品
- 商品卡展示：图片、名称、价格、标签、库存状态
- 点击商品卡进入 `/shop/detail/:productId`

#### `src/pages/shop/Category.jsx`

分类页承担“可售商品筛选入口”的角色，必须实现：

- 左侧一级分类列表
- 右侧二级分类标签区
- 排序切换：综合、价格升序、价格降序、销量优先
- 商品列表仍只展示 `online` 商品
- 点击商品进入详情页

#### `src/pages/shop/Detail.jsx`

详情页承担“加购与立即购买入口”的角色，必须实现：

- 商品大图、名称、价格、标签、销量、库存
- SKU 选择区，使用当前 `skuOptions`
- 数量调节
- 收藏按钮
- “加入购物车”和“立即购买”两个明确行动按钮
- 当商品为 `offline` 或库存不足时，禁止购买并显示明确提示

#### `src/pages/shop/Cart.jsx`

购物车页承担“从商品集合进入下单”的角色，必须实现：

- 当前用户购物车商品列表
- 单项勾选、全选、数量修改、删除
- 实时合计数量与金额
- “去结算”按钮
- 未登录时继续由路由守卫拦截
- 空购物车时显示空状态和返回首页入口

#### `src/pages/shop/CreateOrder.jsx`

创建订单页承担“确认下单”的角色，必须实现：

- 默认收货地址展示与地址入口
- 商品快照列表
- 备注输入框
- 金额明细
- “提交订单”按钮
- 无地址、无选中商品、库存不足都必须阻止提交并给出中文提示

#### `src/pages/shop/Pay.jsx`

支付页承担“模拟支付闭环”的角色，必须实现：

- 订单号与金额展示
- 倒计时，固定为 `10` 分钟
- 模拟二维码区域
- “确认已支付”按钮
- 倒计时结束后禁止继续支付

#### `src/pages/shop/PaySuccess.jsx`

支付成功页承担“支付完成反馈”的角色，必须实现：

- 支付成功视觉反馈
- 返回订单详情
- 返回首页继续逛

#### `src/pages/shop/OrderListPage.jsx`

订单列表页必须实现：

- 当前用户订单分页列表
- 状态筛选：待支付、已支付、已发货、已完成、已取消
- 点击进入订单详情

#### `src/pages/shop/OrderDetailPage.jsx`

订单详情页必须实现：

- 订单状态标签
- 商品快照
- 地址快照
- 支付信息
- 物流信息
- 当后台发货后，刷新页面可看到状态和物流变化

#### `src/pages/shop/UserPage.jsx`

我的页面必须实现：

- 用户昵称展示
- 我的订单入口
- 我的收藏入口
- 地址管理入口
- 退出登录按钮

#### `src/pages/shop/AddressPage.jsx`

地址页必须实现基础地址管理：

- 当前用户地址列表
- 新增地址
- 编辑地址
- 删除非默认地址
- 设置默认地址

#### `src/pages/shop/FavoritesPage.jsx`

收藏页必须实现：

- 收藏商品列表
- 取消收藏
- 点击进入商品详情

#### `src/pages/shop/LoginPage.jsx`

登录页在本轮仍使用测试账号登录入口，但视觉与交互需要完整：

- 展示测试会员登录按钮
- 失败时展示 `state.error`
- 登录成功后跳回被拦截前的目标路径

### 4.2 后台页面

#### `src/pages/admin/AdminLoginPage.jsx`

后台登录页保留现有表单结构，但要提升视觉完成度，并支持：

- 管理员登录
- 普通运营登录
- 登录成功跳回被拦截前路径

#### `src/pages/admin/Dashboard.jsx`

后台看板必须实现：

- 商品总数
- 上架商品数
- 订单总数
- 已支付订单数
- 待发货订单数
- 近几笔订单列表

看板数据全部来自当前 `mockService` 聚合结果，不写死。

#### `src/pages/admin/AdminProductPage.jsx`

商品管理页是本轮后台核心，必须完整实现：

- 商品列表
- 关键字段：图片、名称、分类、价格、库存、销量、状态
- 搜索
- 状态筛选
- 分类筛选
- 分页
- 新增商品
- 编辑商品
- 删除商品
- 上下架切换

表单校验必须覆盖：

- 商品名称不能为空
- 价格不能小于 `0`
- 库存不能小于 `0`
- 分类必选
- 图片地址不能为空

#### `src/pages/admin/AdminOrderPage.jsx`

订单管理页必须实现：

- 订单列表
- 订单状态筛选
- 查看订单详情
- 已支付订单可发货
- 发货表单包含物流公司与物流单号
- 发货后写入订单物流信息，并把状态变为 `shipped`

#### `src/pages/admin/AdminAccountPage.jsx`

账号设置页本轮只做轻量实现：

- 当前后台账号信息
- 角色展示
- 退出登录

#### `src/pages/admin/NoPermissionPage.jsx`

无权限页保留现有语义，但要在视觉上与后台整体统一。

#### 只读/占位后台页

以下页面本轮只保留“结构完整 + 信息明确”的只读或占位实现，不做复杂管理逻辑：

- `AdminCategoryPage.jsx`
- `AdminRolePage.jsx`
- `AdminUserPage.jsx`
- `AdminLogPage.jsx`

它们必须可访问、版面整洁、信息明确，但不是本轮功能重点。

## 5. 数据与服务扩展

本轮继续沿用 `src/mock/mockService.js` 作为唯一数据入口，不允许页面直接读写 `localStorage`。

### 5.1 保留现有导出

以下现有导出保持不变并继续使用：

- `STORAGE_KEYS`
- `databaseService`
- `productService`
- `categoryService`
- `authService`
- `permissionService`
- `cartService`
- `addressService`
- `orderService`
- `logService`

### 5.2 新增或补强的精确服务能力

下一轮实现中，服务层需要补强为以下能力集合：

#### `productService`

- `listProducts(filters)`
- `getProductByIdSync(productId)`
- `createProduct(productPayload)`
- `updateProduct(productPayload)`
- `deleteProduct(productId)`
- `toggleProductStatus(productId, status)`
- `listPagedProducts(params)`

#### `cartService`

- `addItem(payload)`
- `listCartSync(userId)`
- `updateItemQuantity(cartItemId, quantity)`
- `toggleItemSelected(cartItemId, selected)`
- `toggleAllSelected(userId, selected)`
- `removeItem(cartItemId)`
- `calculateSelectedTotal(userId)`
- `clearSelectedItems(userId)`

#### `addressService`

- `listByUserSync(userId)`
- `getByIdSync(addressId)`
- `createAddress(payload)`
- `updateAddress(addressId, payload)`
- `deleteAddress(addressId)`
- `setDefaultAddress(userId, addressId)`

#### `orderService`

- `createOrder(payload)`
- `payOrder(orderId)`
- `listOrdersSync(userId?)`
- `getOrderByIdSync(orderId)`
- `shipOrder(orderId, payload)`
- `listPagedOrders(params)`

#### 新增 `favoriteService`

本轮新增精确导出名：`favoriteService`

负责：

- `listFavoritesSync(userId)`
- `toggleFavorite(userId, productId)`

#### 新增 `dashboardService`

本轮新增精确导出名：`dashboardService`

负责：

- 聚合商品数量
- 聚合订单数量
- 聚合待发货数量
- 生成后台首页最近订单列表

### 5.3 联动规则

- 前台首页、分类页、详情页只读取 `online` 商品
- 后台下架商品后，前台不可购买；若用户直接进入详情页，页面显示“商品已下架”
- 订单创建后，后台订单页立即可见
- 后台发货后，前台订单详情刷新可见物流信息
- 前后台登录态继续分离：`mall_session` 与 `mall_admin_session`

## 6. 组件拆分原则

下一轮实现建议拆出以下组件，以避免页面文件过大：

前台建议组件：

- `src/components/shop/ProductCard.jsx`
- `src/components/shop/SectionHeader.jsx`
- `src/components/shop/QuantityStepper.jsx`
- `src/components/shop/StatusTag.jsx`
- `src/components/shop/EmptyState.jsx`

后台建议组件：

- `src/components/admin/PageHeaderCard.jsx`
- `src/components/admin/ProductFormDrawer.jsx`
- `src/components/admin/OrderShipModal.jsx`
- `src/components/admin/StatisticCardGrid.jsx`

这些名称在下一轮计划中直接采用，不再重新命名。

## 7. 权限与异常处理

### 7.1 权限

- 前台未登录访问购物车、创建订单、订单列表、订单详情、我的、地址、收藏时，继续跳转 `/shop/login`
- 后台未登录访问 `/admin/*` 时继续跳转 `/admin/login`
- 普通运营仅允许访问：
  - `/admin/dashboard`
  - `/admin/orders`
  - `/admin/account`
- 普通运营访问 `/admin/products`、`/admin/categories`、`/admin/roles`、`/admin/users`、`/admin/logs` 时显示 `NoPermissionPage`

### 7.2 异常

- 商品不存在：详情页显示错误态并提供返回入口
- 商品下架：详情页不可购买
- 库存不足：加购、下单都要阻止
- 地址缺失：创建订单页要阻止下单并引导去地址页
- 订单不存在：订单详情显示错误态
- 支付超时：支付页禁用确认支付
- 发货参数为空：后台发货表单禁止提交

## 8. 测试与验收

下一轮测试必须覆盖以下四类行为：

1. 商品上下架后，前台商品列表过滤生效
2. 前台创建订单并支付后，后台订单列表可见新订单
3. 后台发货后，前台订单详情显示物流信息
4. 普通运营访问商品管理页显示无权限

验收通过标准：

- 用户按“演示链定义”可完整走通
- 页面刷新后购物车、订单、登录态不丢失
- `npm run test`、`npm run lint`、`npm run build` 通过
- 本轮不要求 `Report.md`、`check.cjs`、`pack.cjs`

## 9. 本轮明确不做的事

- 不接入真实后端
- 不实现后台分类、角色、用户、日志的完整 CRUD
- 不在本轮追求部署上线
- 不为了“功能看起来多”引入与演示链无关的页面

本轮的成功标准不是页面数量，而是这一条链路足够完整、足够稳定、足够像一个真实商城系统。
