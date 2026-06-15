// 基础数据与服务层测试。
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

  it('uses generated no-watermark product images instead of dummy text boxes', () => {
    const products = productService.listProductsSync();

    expect(products).toHaveLength(30);
    expect(products.every((product) => product.image.startsWith('data:image/svg+xml;charset=UTF-8,'))).toBe(true);
    expect(products.every((product) => !product.image.includes('dummyimage.com'))).toBe(true);
    expect(products.find((product) => product.id === 'p-001').image).toContain('headphones');
    expect(products.find((product) => product.id === 'p-003').image).toContain('mouse');
    expect(products.find((product) => product.id === 'p-004').image).toContain('projector');
  });

  it('uses products as the single stock and sales source without sku options', () => {
    const product = productService.getProductByIdSync('p-001');

    expect(product.stock).toBe(98);
    expect(product.sales).toBe(320);
    expect(product).not.toHaveProperty('skuOptions');
  });

  it('migrates legacy dummy product images without resetting edited fields', () => {
    const legacyProducts = productService.listProductsSync().map((product) =>
      product.id === 'p-001'
        ? {
            ...product,
            image: 'https://dummyimage.com/640x480/e8eef3/203244&text=legacy',
            stock: 77,
          }
        : product,
    );
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(legacyProducts));

    databaseService.initializeDatabase();

    const product = productService.getProductByIdSync('p-001');
    expect(product.image.startsWith('data:image/svg+xml;charset=UTF-8,')).toBe(true);
    expect(product.image).toContain('headphones');
    expect(product.image).not.toContain('dummyimage.com');
    expect(product.stock).toBe(77);
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
    const beforeProduct = productService.getProductByIdSync('p-001');
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

    const afterProduct = productService.getProductByIdSync('p-001');
    expect(afterProduct.stock).toBe(beforeProduct.stock - 1);
    expect(afterProduct.sales).toBe(beforeProduct.sales + 1);
  });

  it('logs in frontend and admin users separately', async () => {
    const userResult = await authService.loginUser('member', '123456');
    const adminResult = await authService.loginAdmin('admin', 'admin123');

    expect(userResult.success).toBe(true);
    expect(adminResult.success).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.session)).username).toBe('member');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.adminSession)).roleCode).toBe(ADMIN_ROLE_CODES.admin);
  });

  it('rejects registration with empty username', async () => {
    const result = await authService.registerUser({
      username: '',
      password: '123456',
      name: '新会员',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名不能为空');
  });

  it('rejects registration when password is shorter than 6 characters', async () => {
    const result = await authService.registerUser({
      username: 'new-member',
      password: '12345',
      name: '新会员',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('密码至少 6 位');
  });

  it('rejects registration with empty password', async () => {
    const result = await authService.registerUser({
      username: 'new-member',
      password: '   ',
      name: '新会员',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('密码不能为空');
  });

  it('rejects registration with empty name', async () => {
    const result = await authService.registerUser({
      username: 'new-member',
      password: '123456',
      name: '   ',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('昵称不能为空');
  });

  it('rejects registration with duplicate username member', async () => {
    const result = await authService.registerUser({
      username: 'member',
      password: '123456',
      name: '新会员',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('用户名已存在');
  });

  it('registers new-member and creates a frontend user session', async () => {
    const result = await authService.registerUser({
      username: 'new-member',
      password: '123456',
      name: '新会员',
    });

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      username: 'new-member',
      name: '新会员',
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.session)).username).toBe('new-member');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.users)).find((user) => user.username === 'new-member'),
    ).toMatchObject({
      id: expect.any(String),
      username: 'new-member',
      password: '123456',
      name: '新会员',
      phone: '',
    });
  });

  it('trims registration username, password, and name before creating user', async () => {
    const result = await authService.registerUser({
      username: ' new-member ',
      password: ' 123456 ',
      name: ' 新会员 ',
    });

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      username: 'new-member',
      name: '新会员',
    });
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.users)).find((user) => user.username === 'new-member'),
    ).toMatchObject({
      username: 'new-member',
      password: '123456',
      name: '新会员',
      phone: '',
    });
  });

  it('logs in with the same normalized credentials after registration and logout', async () => {
    await authService.registerUser({
      username: ' padded-member ',
      password: ' 123456 ',
      name: ' 空格会员 ',
    });
    authService.logoutUser();

    const result = await authService.loginUser(' padded-member ', ' 123456 ');

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      username: 'padded-member',
      name: '空格会员',
    });
  });
});
