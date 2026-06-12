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
