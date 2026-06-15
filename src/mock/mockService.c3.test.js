// 业务链路测试。
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ORDER_STATUS,
  adminUserService,
  addressService,
  authService,
  categoryService,
  cartService,
  dashboardService,
  databaseService,
  favoriteService,
  orderService,
  permissionService,
  productService,
  roleService,
  userService,
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
      description: 'C3 演示商品描述',
    });

    expect(created.success).toBe(true);
    expect(created.data.id).toMatch(/^p-/);
    expect(created.data).not.toHaveProperty('skuOptions');
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

  it('ignores legacy sku option payloads after product creation', async () => {
    const first = await productService.createProduct({
      name: '后台新增商品一号',
      categoryId: 'cat-digital-office',
      price: 128,
      stock: 8,
      image: 'https://dummyimage.com/640x480/e8eef3/203244&text=sku-1',
      status: 'online',
      skuOptions: [{ id: 'new-standard', name: '标准版', stock: 8, price: 128 }],
    });
    const second = await productService.createProduct({
      name: '后台新增商品二号',
      categoryId: 'cat-digital-office',
      price: 168,
      stock: 6,
      image: 'https://dummyimage.com/640x480/e8eef3/203244&text=sku-2',
      status: 'online',
      skuOptions: [{ id: 'new-standard', name: '标准版', stock: 6, price: 168 }],
    });

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(first.data).not.toHaveProperty('skuOptions');
    expect(second.data).not.toHaveProperty('skuOptions');
    expect(productService.getProductByIdSync(first.data.id)).toMatchObject({
      price: 128,
      stock: 8,
    });
    expect(productService.getProductByIdSync(second.data.id)).toMatchObject({
      price: 168,
      stock: 6,
    });
  });

  it('updates cart selection, preserves cart after order creation, and clears selected items explicitly', async () => {
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

    const createdOrder = await orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 3 }],
      addressId: 'addr-001',
      remark: '购物车副作用检查',
    });

    expect(createdOrder.success).toBe(true);
    expect(cartService.listCartSync('user-001')).toHaveLength(2);
    expect(cartService.listCartSync('user-001').find((item) => item.id === firstItem.id)).toMatchObject({
      productId: 'p-001',
      quantity: 3,
      selected: true,
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

    const keywordPaged = await orderService.listPagedOrders({ page: 1, pageSize: 10, keyword: 'C3 演示订单' });

    expect(keywordPaged.success).toBe(true);
    expect(keywordPaged.data.list.map((order) => order.id)).toEqual([created.data.id]);

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

  it('returns required product and cart error messages', async () => {
    await expect(productService.deleteProduct('p-missing')).resolves.toMatchObject({
      success: false,
      message: '商品不存在',
    });
    await expect(cartService.addItem({ userId: 'user-001', productId: 'p-008', skuId: 'p-008-standard', quantity: 1 })).resolves.toMatchObject({
      success: false,
      message: '商品已下架',
    });
    await expect(cartService.addItem({ userId: 'user-001', productId: 'p-001', skuId: 'sku-missing', quantity: 1 })).resolves.toMatchObject({
      success: false,
      message: '商品规格不存在',
    });
    await expect(cartService.addItem({ userId: 'user-001', productId: 'p-001', skuId: 'p-001-standard', quantity: 0 })).resolves.toMatchObject({
      success: false,
      message: '商品数量必须大于 0',
    });
    await expect(cartService.addItem({ userId: 'user-001', productId: 'p-001', skuId: 'p-001-standard', quantity: 99 })).resolves.toMatchObject({
      success: false,
      message: '库存不足',
    });

    await cartService.addItem({ userId: 'user-001', productId: 'p-001', skuId: 'p-001-standard', quantity: 90 });
    await expect(cartService.addItem({ userId: 'user-001', productId: 'p-001', skuId: 'p-001-standard', quantity: 9 })).resolves.toMatchObject({
      success: false,
      message: '库存不足',
    });
    expect(cartService.listCartSync('user-001')[0].quantity).toBe(90);

    await expect(cartService.removeItem('cart-missing')).resolves.toMatchObject({
      success: false,
      message: '购物车商品不存在',
    });
  });

  it('returns required address and order error messages', async () => {
    await expect(addressService.updateAddress('addr-missing', { userId: 'user-001' })).resolves.toMatchObject({
      success: false,
      message: '收货地址不存在',
    });
    await expect(orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 1 }],
      addressId: 'addr-missing',
    })).resolves.toMatchObject({
      success: false,
      message: '收货地址不存在',
    });
    await expect(orderService.payOrder('order-missing')).resolves.toMatchObject({
      success: false,
      message: '订单不存在',
    });
    await expect(orderService.payOrder('ORD_202606010001')).resolves.toMatchObject({
      success: false,
      message: '订单状态不允许支付',
    });
    await expect(orderService.shipOrder('order-missing', { company: '顺丰速运', trackingNo: 'SF1000000001' })).resolves.toMatchObject({
      success: false,
      message: '订单不存在',
    });

    const created = await orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 1 }],
      addressId: 'addr-001',
    });

    await expect(orderService.shipOrder(created.data.id, { company: '顺丰速运', trackingNo: 'SF1000000001' })).resolves.toMatchObject({
      success: false,
      message: '订单状态不允许发货',
    });

    await orderService.payOrder(created.data.id);

    await expect(orderService.shipOrder(created.data.id, { company: '', trackingNo: 'SF1000000001' })).resolves.toMatchObject({
      success: false,
      message: '物流公司不能为空',
    });
    await expect(orderService.shipOrder(created.data.id, { company: '顺丰速运', trackingNo: '' })).resolves.toMatchObject({
      success: false,
      message: '物流单号不能为空',
    });
  });

  it('reads roles and users through service APIs', () => {
    expect(roleService.listRolesSync()).toHaveLength(2);
    expect(userService.listUsersSync()).toHaveLength(1);
  });

  it('updates role permissions and changes permission checks immediately', async () => {
    const updated = await roleService.updateRolePermissions('operator', ['dashboard', 'orders', 'users']);

    expect(updated.success).toBe(true);
    expect(roleService.getRoleByCodeSync('operator').permissions).toEqual(['dashboard', 'orders', 'users']);
    expect(permissionService.canAccess('operator', 'users')).toBe(true);
  });

  it('creates edits and deletes custom roles while protecting the super admin role', async () => {
    const created = await roleService.createRole({
      name: '商品专员',
      code: 'product_specialist',
      permissions: ['dashboard', 'products', 'categories'],
    });

    expect(created.success).toBe(true);
    expect(roleService.getRoleByCodeSync('product_specialist')).toMatchObject({
      name: '商品专员',
      permissions: ['dashboard', 'products', 'categories'],
    });

    const updated = await roleService.updateRole('product_specialist', {
      name: '高级商品专员',
      permissions: ['dashboard', 'products', 'categories', 'orders'],
    });

    expect(updated.success).toBe(true);
    expect(roleService.getRoleByCodeSync('product_specialist')).toMatchObject({
      name: '高级商品专员',
      permissions: ['dashboard', 'products', 'categories', 'orders'],
    });

    await expect(roleService.updateRolePermissions('admin', ['dashboard'])).resolves.toMatchObject({
      success: false,
      message: '超级管理员角色与账号属于系统核心底座，严禁编辑或删除！',
    });
    await expect(roleService.deleteRole('admin')).resolves.toMatchObject({
      success: false,
      message: '超级管理员角色与账号属于系统核心底座，严禁编辑或删除！',
    });

    const deleted = await roleService.deleteRole('product_specialist');

    expect(deleted.success).toBe(true);
    expect(roleService.getRoleByCodeSync('product_specialist')).toBeNull();
  });

  it('creates updates disables resets and deletes admin accounts with role binding', async () => {
    const created = await adminUserService.createAdmin({
      username: 'xiaoming',
      name: '小明',
      password: 'xm123456',
      roleCode: 'operator',
    });

    expect(created.success).toBe(true);
    expect(adminUserService.getAdminByIdSync(created.data.id)).toMatchObject({
      username: 'xiaoming',
      name: '小明',
      roleCode: 'operator',
      isEnabled: true,
    });

    const updated = await adminUserService.updateAdmin(created.data.id, {
      username: 'xiaoming',
      name: '订单小明',
      roleCode: 'operator',
    });

    expect(updated.success).toBe(true);
    expect(adminUserService.getAdminByIdSync(created.data.id)).toMatchObject({
      username: 'xiaoming',
      name: '订单小明',
      roleCode: 'operator',
    });

    const paged = await adminUserService.listPagedAdmins({ page: 1, pageSize: 10, keyword: 'xiaoming' });

    expect(paged.success).toBe(true);
    expect(paged.data.list[0]).toMatchObject({
      username: 'xiaoming',
      roleCode: 'operator',
    });

    const toggled = await adminUserService.toggleAdminStatus(created.data.id, false);

    expect(toggled.success).toBe(true);
    expect(adminUserService.getAdminByIdSync(created.data.id).isEnabled).toBe(false);
    await expect(authService.loginAdmin('xiaoming', 'xm123456')).resolves.toMatchObject({
      success: false,
      message: '账号已被禁用',
    });

    const reset = await adminUserService.resetAdminPassword(created.data.id);

    expect(reset.success).toBe(true);
    expect(adminUserService.getAdminByIdSync(created.data.id).password).toBe('xm123456');

    await adminUserService.toggleAdminStatus(created.data.id, true);

    await expect(authService.loginAdmin('xiaoming', 'xm123456')).resolves.toMatchObject({
      success: true,
    });

    const deleted = await adminUserService.deleteAdmin(created.data.id);

    expect(deleted.success).toBe(true);
    expect(adminUserService.getAdminByIdSync(created.data.id)).toBeNull();
  });

  it('protects the system admin account and roles that still have bound accounts', async () => {
    await expect(
      adminUserService.updateAdmin('admin-001', {
        username: 'admin',
        name: '管理员',
        roleCode: 'operator',
      }),
    ).resolves.toMatchObject({
      success: false,
      message: '超级管理员角色与账号属于系统核心底座，严禁编辑或删除！',
    });
    await expect(adminUserService.toggleAdminStatus('admin-001', false)).resolves.toMatchObject({
      success: false,
      message: '超级管理员角色与账号属于系统核心底座，严禁编辑或删除！',
    });
    await expect(adminUserService.deleteAdmin('admin-001')).resolves.toMatchObject({
      success: false,
      message: '超级管理员角色与账号属于系统核心底座，严禁编辑或删除！',
    });
    await expect(roleService.deleteRole('operator')).resolves.toMatchObject({
      success: false,
      message: '当前角色下仍有关联账号，无法删除',
    });
  });

  it('creates edits toggles and deletes tree categories with local persistence', async () => {
    const created = await categoryService.createCategory({
      name: '办公灯具',
      parentId: 'cat-home',
      sort: 23,
      isActive: true,
    });

    expect(created.success).toBe(true);
    expect(
      categoryService
        .listCategoryTreeSync()
        .find((item) => item.id === 'cat-home')
        .children.some((item) => item.id === created.data.id),
    ).toBe(true);

    const updated = await categoryService.updateCategory(created.data.id, {
      name: '办公灯具升级版',
      sort: 24,
      isActive: true,
    });

    expect(updated.success).toBe(true);
    expect(categoryService.getCategoryByIdSync(created.data.id).name).toBe('办公灯具升级版');

    const toggled = await categoryService.toggleCategoryStatus(created.data.id, false);

    expect(toggled.success).toBe(true);
    expect(categoryService.getCategoryByIdSync(created.data.id).isActive).toBe(false);

    const deleted = await categoryService.deleteCategory(created.data.id);

    expect(deleted.success).toBe(true);
    expect(categoryService.getCategoryByIdSync(created.data.id)).toBeNull();
  });

  it('pages users with createdAt metadata for admin user table', async () => {
    const result = await userService.listPagedUsers({ page: 1, pageSize: 10, keyword: 'member' });

    expect(result.success).toBe(true);
    expect(result.data.list[0]).toMatchObject({
      id: 'user-001',
      username: 'member',
      name: '测试会员',
    });
    expect(result.data.list[0].createdAt).toBeTruthy();
  });
});
