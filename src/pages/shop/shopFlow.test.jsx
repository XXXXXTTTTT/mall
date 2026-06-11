import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from '../../context/AppContext.jsx';
import { addressService, authService, cartService, databaseService, orderService } from '../../mock/mockService.js';
import { AddressPage } from './AddressPage.jsx';
import { Cart } from './Cart.jsx';
import { CreateOrder } from './CreateOrder.jsx';
import { FavoritesPage } from './FavoritesPage.jsx';
import { OrderDetailPage } from './OrderDetailPage.jsx';
import { OrderListPage } from './OrderListPage.jsx';
import { Pay } from './Pay.jsx';
import { PaySuccess } from './PaySuccess.jsx';
import { UserPage } from './UserPage.jsx';

function renderRoutes(initialEntries) {
  const router = createMemoryRouter(
    [
      { path: '/shop/cart', element: <Cart /> },
      { path: '/shop/create-order', element: <CreateOrder /> },
      { path: '/shop/pay/:orderId', element: <Pay /> },
      { path: '/shop/pay-success/:orderId', element: <PaySuccess /> },
      { path: '/shop/orders', element: <OrderListPage /> },
      { path: '/shop/orders/:orderId', element: <OrderDetailPage /> },
      { path: '/shop/user', element: <UserPage /> },
      { path: '/shop/address', element: <AddressPage /> },
      { path: '/shop/favorites', element: <FavoritesPage /> },
    ],
    { initialEntries },
  );

  return render(
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>,
  );
}

beforeEach(async () => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
  await authService.loginUser('member', '123456');
});

describe('shop transaction flow pages', () => {
  it('creates an order from selected cart items and pays it', async () => {
    const user = userEvent.setup();
    await cartService.addItem({
      userId: 'user-001',
      productId: 'p-001',
      skuId: 'p-001-standard',
      quantity: 1,
      selected: true,
    });

    renderRoutes(['/shop/cart']);

    expect(await screen.findByText('购物车')).toBeInTheDocument();
    expect(screen.getByText('曜石无线降噪耳机')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: '去结算' }));

    await waitFor(() => expect(screen.getByText('确认订单')).toBeInTheDocument());
    await user.type(screen.getByLabelText('订单备注'), 'C3 页面测试');
    await user.click(screen.getByRole('button', { name: '提交订单' }));

    await waitFor(() => expect(screen.getByText('模拟支付')).toBeInTheDocument());
    expect(cartService.listCartSync('user-001')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: '确认已支付' }));

    await waitFor(() => expect(screen.getByText('支付成功')).toBeInTheDocument());
    const paidOrder = orderService.listOrdersSync('user-001')[0];
    expect(paidOrder.status).toBe('paid');
    expect(cartService.listCartSync('user-001')).toHaveLength(0);
  });

  it('blocks paid order from showing payable state', async () => {
    renderRoutes(['/shop/pay/ORD_202606010001']);

    expect(await screen.findByText('订单已支付，无需重复支付')).toBeInTheDocument();
    expect(screen.queryByText('支付倒计时')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确认已支付' })).toBeDisabled();
  });

  it('shows shipment logistics after admin service ships order', async () => {
    const created = await orderService.createOrder({
      userId: 'user-001',
      items: [{ productId: 'p-001', skuId: 'p-001-standard', quantity: 1 }],
      addressId: 'addr-001',
      remark: '等待发货',
    });
    await orderService.payOrder(created.data.id);
    await orderService.shipOrder(created.data.id, {
      company: '顺丰速运',
      trackingNo: 'SF1000000001',
    });

    renderRoutes([`/shop/orders/${created.data.id}`]);

    expect(await screen.findByText('订单详情')).toBeInTheDocument();
    expect(screen.getByText('已发货')).toBeInTheDocument();
    expect(screen.getByText('顺丰速运')).toBeInTheDocument();
    expect(screen.getByText('SF1000000001')).toBeInTheDocument();
  });

  it('manages address and favorites pages', async () => {
    const user = userEvent.setup();
    renderRoutes(['/shop/address']);

    expect(await screen.findByText('地址管理')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增地址' }));
    await user.type(screen.getByLabelText('收货人'), '新收货人');
    await user.type(screen.getByLabelText('手机号'), '13900000000');
    await user.type(screen.getByLabelText('省份'), '上海市');
    await user.type(screen.getByLabelText('城市'), '上海市');
    await user.type(screen.getByLabelText('详细地址'), '演示路 1 号');
    await user.click(screen.getByRole('button', { name: '保存地址' }));

    await waitFor(() => expect(screen.getByText('新收货人')).toBeInTheDocument());

    renderRoutes(['/shop/favorites']);

    expect(await screen.findByText('我的收藏')).toBeInTheDocument();
  });

  it('guards address actions when no user session exists', async () => {
    const user = userEvent.setup();
    await addressService.createAddress({
      userId: 'user-001',
      receiver: '备用收货人',
      phone: '13900000001',
      province: '上海市',
      city: '上海市',
      detail: '备用路 2 号',
      isDefault: false,
    });
    authService.logoutUser();

    renderRoutes(['/shop/address']);

    expect(await screen.findByText('地址管理')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增地址' }));
    await user.click(screen.getByRole('button', { name: '保存地址' }));

    expect(await screen.findByText('请先登录后管理收货地址')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '去登录' })).toHaveAttribute('href', '/shop/login');

    expect(screen.queryByRole('button', { name: '设置默认' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '删除' })).not.toBeInTheDocument();
  });

  it('renders user center entries and order list filter', async () => {
    renderRoutes(['/shop/user']);

    expect(await screen.findByText('测试会员')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '我的订单' })).toHaveAttribute('href', '/shop/orders');
    expect(screen.getByRole('link', { name: '我的收藏' })).toHaveAttribute('href', '/shop/favorites');
    expect(screen.getByRole('link', { name: '地址管理' })).toHaveAttribute('href', '/shop/address');

    renderRoutes(['/shop/orders']);

    expect(await screen.findByText('订单列表')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '已支付' })).toBeInTheDocument();
  });
});
