import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  }, 10000);

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
