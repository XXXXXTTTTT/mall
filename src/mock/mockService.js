import {
  ADMIN_ROLE_CODES,
  ORDER_STATUS,
  initialDatabase,
} from './mockData.js';
import { createProductImage } from './productImages.js';

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

function paginate(list, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
  };
}

function seedKey(key, value, force) {
  if (force || localStorage.getItem(key) === null) {
    writeJson(key, value);
  }
}

function migrateProductImages() {
  const products = readJson(STORAGE_KEYS.products, initialDatabase.products);
  let hasChanged = false;
  const nextProducts = products.map((product) => {
    if (typeof product.image === 'string' && product.image.includes('dummyimage.com')) {
      hasChanged = true;
      return { ...product, image: createProductImage(product.id, product.name) };
    }
    return product;
  });

  if (hasChanged) {
    writeJson(STORAGE_KEYS.products, nextProducts);
  }
}

export const databaseService = {
  initializeDatabase({ force = false } = {}) {
    seedKey(STORAGE_KEYS.products, initialDatabase.products, force);
    migrateProductImages();
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
  async createProduct(productPayload) {
    const validationResult = validateProductPayload(productPayload);
    if (validationResult) return delay(validationResult);

    const now = new Date().toISOString();
    const productId = `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const product = {
      ...productPayload,
      id: productId,
      sales: productPayload.sales || 0,
      tags: productPayload.tags || [],
      skuOptions: normalizeCreatedSkuOptions(productId, productPayload.skuOptions || []),
      description: productPayload.description || '',
      createdAt: now,
      updatedAt: now,
    };
    const products = productService.listProductsSync();
    products.unshift(product);
    writeJson(STORAGE_KEYS.products, products);
    appendLog('管理员', '商品新增', `新增商品 ${product.name}`);
    return delay(ok(product));
  },
  async updateProduct(product) {
    const validationResult = validateProductPayload(product);
    if (validationResult) return delay(validationResult);

    const products = productService.listProductsSync();
    if (!products.some((item) => item.id === product.id)) return delay(fail('商品不存在'));

    const updatedProduct = { ...product, updatedAt: new Date().toISOString() };
    const nextProducts = products.map((item) =>
      item.id === product.id ? { ...item, ...updatedProduct } : item,
    );
    writeJson(STORAGE_KEYS.products, nextProducts);
    appendLog('管理员', '商品编辑', `编辑商品 ${product.name}`);
    return delay(ok(updatedProduct));
  },
  async deleteProduct(productId) {
    const products = productService.listProductsSync();
    const product = products.find((item) => item.id === productId);
    if (!product) return delay(fail('商品不存在'));

    writeJson(STORAGE_KEYS.products, products.filter((item) => item.id !== productId));
    appendLog('管理员', '商品删除', `删除商品 ${product.name}`);
    return delay(ok(product));
  },
  async toggleProductStatus(productId, status) {
    const products = productService.listProductsSync();
    const product = products.find((item) => item.id === productId);
    if (!product) return delay(fail('商品不存在'));

    product.status = status;
    product.updatedAt = new Date().toISOString();
    writeJson(STORAGE_KEYS.products, products);
    appendLog('管理员', '商品状态', `更新商品 ${product.name} 状态为 ${status}`);
    return delay(ok(product));
  },
  async listPagedProducts(params = {}) {
    const { page = 1, pageSize = 10, ...filters } = params;
    const productsResult = await productService.listProducts(filters);
    return delay(ok(paginate(productsResult.data, page, pageSize)));
  },
};

function normalizeCreatedSkuOptions(productId, skuOptions) {
  return skuOptions.map((skuOption) => ({
    ...skuOption,
    id: skuOption.id === 'new-standard' ? `${productId}-standard` : skuOption.id,
  }));
}

function validateProductPayload(product) {
  if (!product.name?.trim()) return fail('商品名称不能为空');
  if (Number(product.price) < 0) return fail('商品价格不能小于 0');
  if (Number(product.stock) < 0) return fail('商品库存不能小于 0');
  if (!product.categoryId?.trim()) return fail('商品分类不能为空');
  if (!product.image?.trim()) return fail('商品图片不能为空');
  return null;
}

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
  async registerUser({ username, password, name }) {
    const normalizedUsername = username?.trim() || '';
    const normalizedPassword = password?.trim() || '';
    const normalizedName = name?.trim() || '';
    if (!normalizedUsername) return delay(fail('用户名不能为空'));
    if (!normalizedPassword) return delay(fail('密码不能为空'));
    if (normalizedPassword.length < 6) return delay(fail('密码至少 6 位'));
    if (!normalizedName) return delay(fail('昵称不能为空'));

    const users = readJson(STORAGE_KEYS.users, initialDatabase.users);
    if (users.some((item) => item.username === normalizedUsername)) return delay(fail('用户名已存在'));

    const user = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      username: normalizedUsername,
      password: normalizedPassword,
      name: normalizedName,
      phone: '',
    };
    users.push(user);
    writeJson(STORAGE_KEYS.users, users);
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

export const roleService = {
  listRolesSync() {
    return readJson(STORAGE_KEYS.roles, initialDatabase.roles);
  },
};

export const userService = {
  listUsersSync() {
    return readJson(STORAGE_KEYS.users, initialDatabase.users);
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
      if (sku.stock < existing.quantity + quantity) return delay(fail('库存不足'));
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
  async updateItemQuantity(cartItemId, quantity) {
    if (quantity <= 0) return delay(fail('商品数量必须大于 0'));

    const cart = readJson(STORAGE_KEYS.cart, initialDatabase.cart);
    const cartItem = cart.find((item) => item.id === cartItemId);
    if (!cartItem) return delay(fail('购物车商品不存在'));

    const product = productService.getProductByIdSync(cartItem.productId);
    if (!product) return delay(fail('商品不存在'));
    if (product.status !== 'online') return delay(fail('商品已下架'));
    const sku = product.skuOptions.find((item) => item.id === cartItem.skuId);
    if (!sku) return delay(fail('商品规格不存在'));
    if (sku.stock < quantity) return delay(fail('库存不足'));

    cartItem.quantity = quantity;
    writeJson(STORAGE_KEYS.cart, cart);
    return delay(ok(cartItem));
  },
  async toggleItemSelected(cartItemId, selected) {
    const cart = readJson(STORAGE_KEYS.cart, initialDatabase.cart);
    const cartItem = cart.find((item) => item.id === cartItemId);
    if (!cartItem) return delay(fail('购物车商品不存在'));

    cartItem.selected = selected;
    writeJson(STORAGE_KEYS.cart, cart);
    return delay(ok(cartItem));
  },
  async toggleAllSelected(userId, selected) {
    const cart = readJson(STORAGE_KEYS.cart, initialDatabase.cart);
    const userCart = cart.filter((item) => item.userId === userId);
    userCart.forEach((item) => {
      item.selected = selected;
    });
    writeJson(STORAGE_KEYS.cart, cart);
    return delay(ok(userCart));
  },
  async removeItem(cartItemId) {
    const cart = readJson(STORAGE_KEYS.cart, initialDatabase.cart);
    const cartItem = cart.find((item) => item.id === cartItemId);
    if (!cartItem) return delay(fail('购物车商品不存在'));

    writeJson(STORAGE_KEYS.cart, cart.filter((item) => item.id !== cartItemId));
    return delay(ok(cartItem));
  },
  async clearSelectedItems(userId) {
    const cart = readJson(STORAGE_KEYS.cart, initialDatabase.cart);
    const nextCart = cart.filter((item) => item.userId !== userId || !item.selected);
    writeJson(STORAGE_KEYS.cart, nextCart);
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
  async createAddress(payload) {
    const addresses = readJson(STORAGE_KEYS.addresses, initialDatabase.addresses);
    const address = {
      ...payload,
      id: `addr-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };
    if (address.isDefault) {
      addresses.forEach((item) => {
        if (item.userId === address.userId) item.isDefault = false;
      });
    }
    addresses.push(address);
    writeJson(STORAGE_KEYS.addresses, addresses);
    return delay(ok(address));
  },
  async updateAddress(addressId, payload) {
    const addresses = readJson(STORAGE_KEYS.addresses, initialDatabase.addresses);
    const address = addresses.find((item) => item.id === addressId);
    if (!address) return delay(fail('收货地址不存在'));

    const nextAddress = { ...payload };
    if (payload.isDefault) {
      addresses.forEach((item) => {
        if (item.userId === payload.userId) item.isDefault = false;
      });
    } else {
      nextAddress.isDefault = address.isDefault;
    }
    Object.assign(address, nextAddress, { id: addressId });
    writeJson(STORAGE_KEYS.addresses, addresses);
    return delay(ok(address));
  },
  async deleteAddress(addressId) {
    const addresses = readJson(STORAGE_KEYS.addresses, initialDatabase.addresses);
    const address = addresses.find((item) => item.id === addressId);
    if (!address) return delay(fail('收货地址不存在'));
    if (address.isDefault) return delay(fail('默认地址不能删除'));

    writeJson(STORAGE_KEYS.addresses, addresses.filter((item) => item.id !== addressId));
    return delay(ok(address));
  },
  async setDefaultAddress(userId, addressId) {
    const addresses = readJson(STORAGE_KEYS.addresses, initialDatabase.addresses);
    const address = addresses.find((item) => item.id === addressId && item.userId === userId);
    if (!address) return delay(fail('收货地址不存在'));

    addresses.forEach((item) => {
      if (item.userId === userId) item.isDefault = item.id === addressId;
    });
    writeJson(STORAGE_KEYS.addresses, addresses);
    return delay(ok(address));
  },
};

export const orderService = {
  listOrdersSync(userId) {
    const orders = readJson(STORAGE_KEYS.orders, initialDatabase.orders);
    return userId ? orders.filter((order) => order.userId === userId) : orders;
  },
  getOrderByIdSync(orderId) {
    return orderService.listOrdersSync().find((order) => order.id === orderId) || null;
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
      if (item.quantity <= 0) return delay(fail('商品数量必须大于 0'));
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
  async shipOrder(orderId, payload) {
    const orders = orderService.listOrdersSync();
    const order = orders.find((item) => item.id === orderId);
    if (!order) return delay(fail('订单不存在'));
    if (order.status !== ORDER_STATUS.paid) return delay(fail('订单状态不允许发货'));
    if (!payload.company?.trim()) return delay(fail('物流公司不能为空'));
    if (!payload.trackingNo?.trim()) return delay(fail('物流单号不能为空'));

    const logisticsItem = {
      company: payload.company,
      trackingNo: payload.trackingNo,
      shippedAt: new Date().toISOString(),
    };
    order.status = ORDER_STATUS.shipped;
    order.logistics = [logisticsItem, ...(order.logistics || [])];
    writeJson(STORAGE_KEYS.orders, orders);
    return delay(ok(order));
  },
  async listPagedOrders(params = {}) {
    const { page = 1, pageSize = 10, status, userId, keyword } = params;
    const orders = orderService.listOrdersSync(userId).filter((order) => {
      if (status && order.status !== status) return false;
      if (keyword && !order.id.includes(keyword) && !order.remark.includes(keyword)) return false;
      return true;
    });
    return delay(ok(paginate(orders, page, pageSize)));
  },
};

export const favoriteService = {
  listFavoritesSync(userId) {
    return readJson(STORAGE_KEYS.favorites, initialDatabase.favorites).filter((item) => item.userId === userId);
  },
  async toggleFavorite(userId, productId) {
    const product = productService.getProductByIdSync(productId);
    if (!product) return delay(fail('商品不存在'));

    const favorites = readJson(STORAGE_KEYS.favorites, initialDatabase.favorites);
    const existing = favorites.find((item) => item.userId === userId && item.productId === productId);
    if (existing) {
      writeJson(STORAGE_KEYS.favorites, favorites.filter((item) => item.id !== existing.id));
      return delay(ok({ isFavorite: false }));
    }

    const favorite = {
      id: `fav-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      userId,
      productId,
      createdAt: new Date().toISOString(),
    };
    favorites.unshift(favorite);
    writeJson(STORAGE_KEYS.favorites, favorites);
    return delay(ok({ isFavorite: true, favorite }));
  },
};

export const dashboardService = {
  async getSummary() {
    const products = productService.listProductsSync();
    const orders = orderService.listOrdersSync();
    const paidOrders = orders.filter((order) => order.status === ORDER_STATUS.paid);
    return delay(ok({
      productTotal: products.length,
      onlineProductTotal: products.filter((product) => product.status === 'online').length,
      orderTotal: orders.length,
      paidOrderTotal: paidOrders.length,
      pendingShipmentTotal: paidOrders.length,
      recentOrders: orders.slice(0, 5),
    }));
  },
};

export const logService = {
  listLogsSync() {
    return readJson(STORAGE_KEYS.logs, initialDatabase.logs);
  },
};
