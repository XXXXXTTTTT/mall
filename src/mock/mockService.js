import {
  ADMIN_ROLE_CODES,
  ORDER_STATUS,
  initialDatabase,
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
