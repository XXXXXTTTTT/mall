// 后台业务链路测试。
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  adminUserService,
  authService,
  categoryService,
  databaseService,
  orderService,
  productService,
  roleService,
} from '../../mock/mockService.js';
import { AdminAccountPage } from './AdminAccountPage.jsx';
import { AdminCategoryPage } from './AdminCategoryPage.jsx';
import { AdminLayout } from './AdminLayout.jsx';
import { AdminLogPage } from './AdminLogPage.jsx';
import { AdminLoginPage } from './AdminLoginPage.jsx';
import { AdminOrderPage } from './AdminOrderPage.jsx';
import { AdminProductPage } from './AdminProductPage.jsx';
import { AdminRolePage } from './AdminRolePage.jsx';
import { AdminUserPage } from './AdminUserPage.jsx';
import { Dashboard } from './Dashboard.jsx';
import { NoPermissionPage } from './NoPermissionPage.jsx';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 使用单页路由渲染后台页面。
function renderAdmin(initialEntries, element) {
  const router = createMemoryRouter([{ path: initialEntries[0], element }], { initialEntries });
  return render(<RouterProvider router={router} />);
}

// 渲染后台登录链路并返回路由实例。
function renderLoginWithRoutes(initialEntries) {
  const router = createMemoryRouter(
    [
      { path: '/admin/login', element: <AdminLoginPage /> },
      { path: '/admin/dashboard', element: <div>快捷登录已跳转</div> },
    ],
    { initialEntries },
  );
  return {
    router,
    ...render(<RouterProvider router={router} />),
  };
}

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('admin c3 pages', () => {
  it('logs in from the single-card admin form and redirects with replace', async () => {
    const user = userEvent.setup();
    const { router } = renderLoginWithRoutes(['/admin/login']);

    expect(await screen.findByText('后台登录')).toBeInTheDocument();
    await user.clear(screen.getByLabelText('账号'));
    await user.type(screen.getByLabelText('账号'), 'admin');
    await user.clear(screen.getByLabelText('密码'));
    await user.type(screen.getByLabelText('密码'), 'admin123');
    await user.click(screen.getByRole('button', { name: '登录后台' }));

    await waitFor(() => expect(authService.getAdminSession().roleCode).toBe('admin'));
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin/dashboard'));
    expect(router.state.historyAction).toBe('REPLACE');
    expect(screen.getByText('快捷登录已跳转')).toBeInTheDocument();
  });

  it('blocks disabled admin accounts from logging in', async () => {
    const user = userEvent.setup();
    const { router } = renderLoginWithRoutes(['/admin/login']);
    await adminUserService.toggleAdminStatus('admin-002', false);

    await user.clear(screen.getByLabelText('账号'));
    await user.type(screen.getByLabelText('账号'), 'operator');
    await user.clear(screen.getByLabelText('密码'));
    await user.type(screen.getByLabelText('密码'), 'op123456');
    await user.click(screen.getByRole('button', { name: '登录后台' }));

    expect(await screen.findByText('账号已被禁用')).toBeInTheDocument();
    expect(authService.getAdminSession()).toBeNull();
    expect(router.state.location.pathname).toBe('/admin/login');
  });

  it('shows dashboard summary from current service data', async () => {
    await authService.loginAdmin('admin', 'admin123');
    renderAdmin(['/admin/dashboard'], <Dashboard />);

    expect(await screen.findByText('数据看板')).toBeInTheDocument();
    expect(screen.getByText('商品总数')).toBeInTheDocument();
    expect(screen.getByText('上架商品')).toBeInTheDocument();
    expect(screen.getByText('订单总数')).toBeInTheDocument();
    expect(screen.getByText('已支付订单')).toBeInTheDocument();
    expect(screen.getByText('待发货订单')).toBeInTheDocument();
    expect(screen.getByText('最近订单')).toBeInTheDocument();
  });

  it('renders admin layout navigation and outlet content', async () => {
    await authService.loginAdmin('admin', 'admin123');
    const router = createMemoryRouter(
      [
        {
          path: '/admin',
          element: <AdminLayout />,
          children: [{ path: 'dashboard', element: <div>Outlet 子元素</div> }],
        },
      ],
      { initialEntries: ['/admin/dashboard'] },
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('Outlet 子元素')).toBeInTheDocument();
    expect(screen.queryByText('云仓后台')).not.toBeInTheDocument();
    expect(screen.getByText('数据看板')).toBeInTheDocument();
    expect(screen.getByText('商品管理')).toBeInTheDocument();
    expect(screen.getByText('分类管理')).toBeInTheDocument();
    expect(screen.getByText('订单管理')).toBeInTheDocument();
    expect(screen.getByText('权限角色')).toBeInTheDocument();
    expect(screen.getByText('账号管理')).toBeInTheDocument();
    expect(screen.getByText('账号设置')).toBeInTheDocument();
    expect(screen.getByText('操作日志')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /admin/ })).toBeInTheDocument();
  });

  it('filters admin layout navigation by operator permissions', async () => {
    await authService.loginAdmin('operator', 'op123456');
    const router = createMemoryRouter(
      [
        {
          path: '/admin',
          element: <AdminLayout />,
          children: [{ path: 'orders', element: <div>运营订单页</div> }],
        },
      ],
      { initialEntries: ['/admin/orders'] },
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('数据看板')).toBeInTheDocument();
    expect(screen.getByText('订单管理')).toBeInTheDocument();
    expect(screen.getByText('账号设置')).toBeInTheDocument();
    expect(screen.queryByText('商品管理')).not.toBeInTheDocument();
    expect(screen.queryByText('分类管理')).not.toBeInTheDocument();
    expect(screen.queryByText('权限角色')).not.toBeInTheDocument();
    expect(screen.queryByText('账号管理')).not.toBeInTheDocument();
    expect(screen.queryByText('操作日志')).not.toBeInTheDocument();
    expect(screen.getByText('运营订单页')).toBeInTheDocument();
  });

  it('hides admin layout navigation before admin session exists', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/admin',
          element: <AdminLayout />,
          children: [{ path: 'dashboard', element: <div>未登录布局内容</div> }],
        },
      ],
      { initialEntries: ['/admin/dashboard'] },
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('未登录布局内容')).toBeInTheDocument();
    expect(screen.queryByText('数据看板')).not.toBeInTheDocument();
    expect(screen.queryByText('商品管理')).not.toBeInTheDocument();
    expect(screen.queryByText('分类管理')).not.toBeInTheDocument();
    expect(screen.queryByText('订单管理')).not.toBeInTheDocument();
    expect(screen.queryByText('权限角色')).not.toBeInTheDocument();
    expect(screen.queryByText('账号管理')).not.toBeInTheDocument();
    expect(screen.queryByText('账号设置')).not.toBeInTheDocument();
    expect(screen.queryByText('操作日志')).not.toBeInTheDocument();
    expect(screen.queryByText('云仓后台')).not.toBeInTheDocument();
  });

  it('opens header dropdown and logs out from admin layout shell', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    const router = createMemoryRouter(
      [
        {
          path: '/admin',
          element: <AdminLayout />,
          children: [{ path: 'dashboard', element: <div>后台内容区</div> }],
        },
        { path: '/admin/login', element: <div>后台登录已显示</div> },
      ],
      { initialEntries: ['/admin/dashboard'] },
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('后台内容区')).toBeInTheDocument();
    expect(screen.queryByText('云仓后台')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /admin/ }));

    expect(await screen.findByText('个人设置')).toBeInTheDocument();
    expect(screen.getByText('安全退出登录')).toBeInTheDocument();

    await user.click(screen.getByText('安全退出登录'));

    await waitFor(() => expect(authService.getAdminSession()).toBeNull());
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin/login'));
  });

  it('renders redesigned single-card admin login page', async () => {
    renderLoginWithRoutes(['/admin/login']);

    expect(await screen.findByRole('heading', { level: 1, name: '商城系统管理端' })).toBeInTheDocument();
    expect(screen.getByText('后台登录')).toBeInTheDocument();
    expect(screen.getByLabelText('账号')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录后台' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '管理员登录' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '普通运营登录' })).not.toBeInTheDocument();
  });

  it('logs out admin account and returns to login', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('operator', 'op123456');
    const router = createMemoryRouter(
      [
        { path: '/admin/account', element: <AdminAccountPage /> },
        { path: '/admin/login', element: <div>后台登录已显示</div> },
      ],
      { initialEntries: ['/admin/account'] },
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('账号设置')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '退出登录' }));

    await waitFor(() => expect(authService.getAdminSession()).toBeNull());
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin/login'));
    expect(router.state.historyAction).toBe('REPLACE');
    expect(screen.getByText('后台登录已显示')).toBeInTheDocument();
  });

  it('creates edits toggles and deletes a product', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    renderAdmin(['/admin/products'], <AdminProductPage />);

    expect(await screen.findByText('商品管理')).toBeInTheDocument();
    expect(screen.getByText('商品图片')).toBeInTheDocument();
    expect(screen.getByText('商品名称')).toBeInTheDocument();
    expect(screen.getByText('分类')).toBeInTheDocument();
    expect(screen.getByText('价格')).toBeInTheDocument();
    expect(screen.getByText('库存')).toBeInTheDocument();
    expect(screen.getByText('销量')).toBeInTheDocument();
    expect(screen.getByText('状态')).toBeInTheDocument();
    expect(screen.getByText('操作')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('搜索商品名称')).toBeInTheDocument();
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

    await user.click(screen.getByRole('button', { name: `编辑 ${created.name}` }));
    await user.clear(screen.getByLabelText('商品名称'));
    await user.type(screen.getByLabelText('商品名称'), '后台 C3 商品已编辑');
    await user.clear(screen.getByLabelText('商品价格'));
    await user.type(screen.getByLabelText('商品价格'), '299');
    await user.click(screen.getByRole('button', { name: '保存商品' }));

    await waitFor(() => expect(productService.getProductByIdSync(created.id).name).toBe('后台 C3 商品已编辑'));
    expect(productService.getProductByIdSync(created.id).price).toBe(299);
    await waitFor(() => expect(screen.getByText('后台 C3 商品已编辑')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: '下架 后台 C3 商品已编辑' }));
    await waitFor(() => expect(productService.getProductByIdSync(created.id).status).toBe('offline'));

    await user.click(screen.getByRole('button', { name: '删除 后台 C3 商品已编辑' }));
    await waitFor(() => expect(productService.getProductByIdSync(created.id)).toBeNull());
  }, 30000);

  it('shows product service failure messages', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    const product = productService.getProductByIdSync('p-001');
    vi.spyOn(productService, 'deleteProduct').mockResolvedValue({
      success: false,
      data: null,
      message: '商品不存在',
    });

    renderAdmin(['/admin/products'], <AdminProductPage />);

    await user.click(await screen.findByRole('button', { name: `删除 ${product.name}` }));
    expect(await screen.findByText('商品不存在')).toBeInTheDocument();
  });

  it('shows product list loading failure messages', async () => {
    await authService.loginAdmin('admin', 'admin123');
    vi.spyOn(productService, 'listPagedProducts').mockResolvedValue({
      success: false,
      data: null,
      message: '商品列表加载失败',
    });

    renderAdmin(['/admin/products'], <AdminProductPage />);

    expect(await screen.findByText('商品列表加载失败')).toBeInTheDocument();
  });

  it('loads order page data through paged order service on first render', async () => {
    await authService.loginAdmin('admin', 'admin123');
    const listPagedOrdersSpy = vi.spyOn(orderService, 'listPagedOrders').mockResolvedValue({
      success: true,
      data: { list: [], total: 0, page: 1, pageSize: 10 },
      message: '',
    });
    const listOrdersSyncSpy = vi.spyOn(orderService, 'listOrdersSync').mockImplementation(() => {
      throw new Error('AdminOrderPage 必须通过 listPagedOrders 加载订单列表');
    });

    renderAdmin(['/admin/orders'], <AdminOrderPage />);

    expect(await screen.findByText('订单管理')).toBeInTheDocument();
    await waitFor(() =>
      expect(listPagedOrdersSpy).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        status: undefined,
        keyword: '',
      }),
    );
    expect(listOrdersSyncSpy).not.toHaveBeenCalled();
  });

  it('shows order list loading failure messages', async () => {
    await authService.loginAdmin('admin', 'admin123');
    vi.spyOn(orderService, 'listPagedOrders').mockResolvedValue({
      success: false,
      data: null,
      message: '订单列表加载失败',
    });

    renderAdmin(['/admin/orders'], <AdminOrderPage />);

    expect(await screen.findByText('订单列表加载失败')).toBeInTheDocument();
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
    expect(screen.getAllByText('订单状态').length).toBeGreaterThan(0);
    const orderIdCell = await screen.findByText(created.data.id);
    const orderRow = orderIdCell.closest('tr');
    expect(orderRow).toBeTruthy();
    expect(within(orderRow).getByRole('button', { name: '查看详情' })).toBeInTheDocument();

    await user.click(within(orderRow).getByRole('button', { name: '查看详情' }));
    expect(await screen.findByText('订单详情')).toBeInTheDocument();
    expect(screen.getAllByText('订单状态').length).toBeGreaterThan(1);
    expect(screen.getByText('物流信息')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: `发货 ${created.data.id}` }));
    await user.type(screen.getByLabelText('物流公司'), '顺丰速运');
    await user.type(screen.getByLabelText('物流单号'), 'SF1000000001');
    await user.click(screen.getByRole('button', { name: '确认发货' }));

    await waitFor(() => expect(orderService.getOrderByIdSync(created.data.id).status).toBe('shipped'));
    expect(orderService.getOrderByIdSync(created.data.id).logistics[0].trackingNo).toBe('SF1000000001');
  }, 30000);

  it('shows shipment service failure messages and keeps modal open', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    const created = await orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 1 }],
      addressId: 'addr-001',
      remark: '后台发货失败测试',
    });
    await orderService.payOrder(created.data.id);
    vi.spyOn(orderService, 'shipOrder').mockResolvedValue({
      success: false,
      data: null,
      message: '物流公司不能为空',
    });

    renderAdmin(['/admin/orders'], <AdminOrderPage />);

    await user.click(await screen.findByRole('button', { name: `发货 ${created.data.id}` }));
    await user.type(screen.getByLabelText('物流公司'), '顺丰速运');
    await user.type(screen.getByLabelText('物流单号'), 'SF1000000001');
    await user.click(screen.getByRole('button', { name: '确认发货' }));

    expect(await screen.findByText('物流公司不能为空')).toBeInTheDocument();
    expect(screen.getByText(`订单发货 ${created.data.id}`)).toBeInTheDocument();
  });

  it('renders account, no permission, and read-only admin pages', async () => {
    await authService.loginAdmin('operator', 'op123456');

    renderAdmin(['/admin/account'], <AdminAccountPage />);
    expect(await screen.findByText('账号设置')).toBeInTheDocument();
    expect(screen.getByText('当前账号：普通运营')).toBeInTheDocument();

    renderAdmin(['/admin/products'], <NoPermissionPage />);
    expect(await screen.findByText('无权限')).toBeInTheDocument();

    renderAdmin(['/admin/categories'], <AdminCategoryPage />);
    expect(await screen.findByRole('heading', { name: '分类管理' })).toBeInTheDocument();

    renderAdmin(['/admin/roles'], <AdminRolePage />);
    expect(await screen.findByRole('heading', { name: '角色管理' })).toBeInTheDocument();

    renderAdmin(['/admin/users'], <AdminUserPage />);
    expect(await screen.findByRole('heading', { name: '后台账号管理' })).toBeInTheDocument();

    renderAdmin(['/admin/logs'], <AdminLogPage />);
    expect(await screen.findByRole('heading', { name: '操作日志' })).toBeInTheDocument();
  });

  it('renders admin account table with role status and created time columns', async () => {
    await authService.loginAdmin('admin', 'admin123');
    renderAdmin(['/admin/users'], <AdminUserPage />);

    expect(await screen.findByRole('heading', { name: '后台账号管理' })).toBeInTheDocument();
    expect(await screen.findByText('admin')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('角色')).toBeInTheDocument();
    expect(screen.getByText('状态')).toBeInTheDocument();
    expect(screen.getByText('创建时间')).toBeInTheDocument();
  });

  it('creates roles and updates permission packages from admin role page', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    renderAdmin(['/admin/roles'], <AdminRolePage />);

    expect(await screen.findByRole('heading', { name: '角色管理' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增角色' }));
    await user.type(screen.getByLabelText('角色名称'), '商品专员');
    await user.type(screen.getByLabelText('角色标识'), 'product_specialist');
    await user.click((await screen.findAllByText('商品管理')).at(-1));
    await user.click((await screen.findAllByText('分类管理')).at(-1));
    await user.click(screen.getByRole('button', { name: '保存角色' }));

    await waitFor(() => expect(roleService.getRoleByCodeSync('product_specialist')).toBeTruthy());
    const editRoleButton = await screen.findByRole('button', { name: '编辑角色 商品专员' });
    expect(editRoleButton).toBeInTheDocument();

    await user.click(editRoleButton);
    await user.clear(screen.getByLabelText('角色名称'));
    await user.type(screen.getByLabelText('角色名称'), '高级商品专员');
    await user.click((await screen.findAllByText('订单管理')).at(-1));
    await user.click(screen.getByRole('button', { name: '保存角色' }));

    await waitFor(() =>
      expect(roleService.getRoleByCodeSync('product_specialist').permissions).toContain('orders'),
    );
    expect(roleService.getRoleByCodeSync('product_specialist').name).toBe('高级商品专员');
    expect(screen.queryByRole('button', { name: '删除角色 超级管理员' })).not.toBeInTheDocument();
  }, 30000);

  it('creates child categories toggles status and deletes leaf rows in admin category page', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    renderAdmin(['/admin/categories'], <AdminCategoryPage />);

    expect(await screen.findByRole('heading', { name: '分类管理' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增子分类 数码办公' }));
    await user.type(screen.getByLabelText('分类名称'), '桌面氛围灯');
    await user.type(screen.getByLabelText('排序'), '13');
    await user.click(screen.getByRole('button', { name: '保存分类' }));

    expect(await screen.findByText('桌面氛围灯')).toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: '切换分类状态 桌面氛围灯' }));
    await waitFor(() =>
      expect(categoryService.listCategoriesSync().find((item) => item.name === '桌面氛围灯').isActive).toBe(false),
    );

    await user.click(screen.getByRole('button', { name: '删除分类 桌面氛围灯' }));
    await waitFor(() =>
      expect(categoryService.listCategoriesSync().some((item) => item.name === '桌面氛围灯')).toBe(false),
    );
  }, 30000);

  it('creates edits disables resets and deletes admin accounts from admin user page', async () => {
    const user = userEvent.setup();
    await authService.loginAdmin('admin', 'admin123');
    await roleService.createRole({
      name: '商品专员',
      code: 'product_specialist',
      permissions: ['dashboard', 'products', 'categories'],
    });
    renderAdmin(['/admin/users'], <AdminUserPage />);

    expect(await screen.findByRole('heading', { name: '后台账号管理' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增账号' }));
    await user.type(screen.getByLabelText('用户名'), 'xiaoming');
    await user.type(screen.getByLabelText('显示名称'), '小明');
    await user.type(screen.getByLabelText('初始密码'), 'xm123456');
    await user.click(screen.getByLabelText('角色'));
    await user.click((await screen.findAllByText('商品专员')).at(-1));
    await user.click(screen.getByRole('button', { name: '保存账号' }));

    await waitFor(() => expect(adminUserService.getAdminByUsernameSync('xiaoming')).toBeTruthy());
    expect(await screen.findByText('xiaoming')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '编辑账号 xiaoming' }));
    await user.clear(screen.getByLabelText('显示名称'));
    await user.type(screen.getByLabelText('显示名称'), '订单小明');
    await user.click(screen.getByLabelText('角色'));
    await user.click((await screen.findAllByText('普通运营')).at(-1));
    await user.click(screen.getByRole('button', { name: '保存账号' }));

    await waitFor(() =>
      expect(adminUserService.getAdminByUsernameSync('xiaoming').roleCode).toBe('operator'),
    );
    expect(adminUserService.getAdminByUsernameSync('xiaoming').name).toBe('订单小明');

    await user.click(screen.getByRole('button', { name: '重置密码 xiaoming' }));
    await waitFor(() =>
      expect(adminUserService.getAdminByUsernameSync('xiaoming').password).toBe('xm123456'),
    );

    await user.click(screen.getByRole('switch', { name: '切换账号状态 xiaoming' }));
    await waitFor(() => expect(adminUserService.getAdminByUsernameSync('xiaoming').isEnabled).toBe(false));
    await expect(authService.loginAdmin('xiaoming', 'xm123456')).resolves.toMatchObject({
      success: false,
      message: '账号已被禁用',
    });

    await user.click(screen.getByRole('button', { name: '删除账号 xiaoming' }));
    await waitFor(() => expect(adminUserService.getAdminByUsernameSync('xiaoming')).toBeNull());
    expect(screen.queryByRole('button', { name: '编辑账号 admin' })).not.toBeInTheDocument();
  }, 30000);
});
