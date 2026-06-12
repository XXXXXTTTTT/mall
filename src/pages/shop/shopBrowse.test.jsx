import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from '../../context/AppContext.jsx';
import { authService, databaseService, favoriteService, productService } from '../../mock/mockService.js';
import { Category } from './Category.jsx';
import { CreateOrder } from './CreateOrder.jsx';
import { Detail } from './Detail.jsx';
import { Home } from './Home.jsx';
import { LoginPage } from './LoginPage.jsx';
import { SearchPage } from './SearchPage.jsx';
import { ShopLayout } from './ShopLayout.jsx';

function renderShop(initialEntries) {
  const router = createMemoryRouter(
    [
      {
        path: '/shop',
        element: <ShopLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'category', element: <Category /> },
          { path: 'detail/:productId', element: <Detail /> },
          { path: 'create-order', element: <CreateOrder /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'search', element: <SearchPage /> },
        ],
      },
    ],
    { initialEntries },
  );

  return render(
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>,
  );
}

function renderShopShell(initialEntries) {
  const router = createMemoryRouter(
    [
      {
        path: '/shop',
        element: <ShopLayout />,
        children: [
          { index: true, element: <div>首页桩</div> },
          { path: 'category', element: <div>分类桩</div> },
          { path: 'cart', element: <div>购物车桩</div> },
          { path: 'user', element: <div>我的桩</div> },
          { path: 'detail/:productId', element: <div>商品详情桩</div> },
          { path: 'create-order', element: <div>确认订单桩</div> },
          { path: 'pay/:orderId', element: <div>模拟支付桩</div> },
          { path: 'pay-success/:orderId', element: <div>支付成功桩</div> },
          { path: 'orders', element: <div>订单列表桩</div> },
          { path: 'orders/:orderId', element: <div>订单详情桩</div> },
          { path: 'address', element: <div>收货地址桩</div> },
          { path: 'favorites', element: <div>我的收藏桩</div> },
          { path: 'login', element: <div>前台登录桩</div> },
          { path: 'search', element: <div>搜索页桩</div> },
        ],
      },
    ],
    { initialEntries },
  );

  return render(<RouterProvider router={router} />);
}

function expectLatestNavigationTitle(title) {
  const bars = screen.getAllByTestId('shop-navigation-bar');
  expect(bars[bars.length - 1]).toHaveTextContent(title);
}

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('shop browse pages', () => {
  it('shows the bottom Dock only on primary shop tab routes', () => {
    const primaryPaths = ['/shop', '/shop/category', '/shop/cart', '/shop/user'];
    const secondaryPaths = [
      '/shop/detail/p-001',
      '/shop/create-order',
      '/shop/pay/ORD_202606010001',
      '/shop/pay-success/ORD_202606010001',
      '/shop/orders',
      '/shop/orders/ORD_202606010001',
      '/shop/address',
      '/shop/favorites',
      '/shop/login',
      '/shop/search',
    ];

    primaryPaths.forEach((path) => {
      const view = renderShopShell([path]);
      expect(screen.getByTestId('shop-bottom-dock')).toBeInTheDocument();
      view.unmount();
    });

    secondaryPaths.forEach((path) => {
      const view = renderShopShell([path]);
      expect(screen.queryByTestId('shop-bottom-dock')).not.toBeInTheDocument();
      view.unmount();
    });
  });

  it('hides offline products on home and category pages', async () => {
    renderShop(['/shop']);

    expect(await screen.findByRole('link', { name: /搜索商品/ })).toHaveAttribute('href', '/shop/search');
    expect(screen.queryByText('可信赖的精选商城')).not.toBeInTheDocument();
    expect(screen.getByTestId('shop-hero-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('shop-hero-carousel').className).not.toContain('overflow-x-auto');
    expect(screen.getByText('热门商品')).toBeInTheDocument();
    expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();

    renderShop(['/shop/category']);

    expect(await screen.findByRole('heading', { level: 1, name: '分类' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '一级分类' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '全部' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '数码办公' })).toBeInTheDocument();
    expect(screen.getByTestId('category-product-grid')).toBeInTheDocument();
    expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();
  });

  it('opens a dedicated search page and filters online products', async () => {
    const user = userEvent.setup();
    renderShop(['/shop/search']);

    expect(await screen.findByText('搜索商品')).toBeInTheDocument();
    const searchbox = screen.getByRole('searchbox', { name: '输入商品关键词' });

    await user.type(searchbox, '耳机');

    expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();
    expect(screen.queryByText('雾银桌面拓展坞')).not.toBeInTheDocument();
  });

  it('keeps README-required storefront modules visible from browse entry points', async () => {
    renderShop(['/shop']);

    expect(await screen.findByRole('link', { name: /搜索商品/ })).toBeInTheDocument();
    expect(screen.getByTestId('shop-hero-carousel')).toBeInTheDocument();
    expect(screen.getByText('热门商品')).toBeInTheDocument();

    renderShop(['/shop/category']);

    expect(await screen.findByRole('navigation', { name: '一级分类' })).toBeInTheDocument();
    expect(screen.getByTestId('category-product-grid')).toBeInTheDocument();
  });

  it('renders icon dock navigation with glass treatment', async () => {
    const { container } = renderShop(['/shop']);

    expect(await screen.findByRole('navigation', { name: '前台主导航' })).toBeInTheDocument();
    const dock = container.querySelector('[data-testid="shop-bottom-dock"]');
    expect(dock).toBeInTheDocument();
    expect(dock.className).toContain('backdrop-blur-md');
    expect(dock.className).toContain('bg-white/80');
    expect(within(dock).getByRole('link', { name: /首页/ }).className).toContain('min-h-11');
    expect(within(dock).getByRole('link', { name: /分类/ }).className).toContain('min-h-11');
  });

  it('uses a left category rail and marks category filters with pressed state', async () => {
    const user = userEvent.setup();
    renderShop(['/shop/category']);

    const allButton = await screen.findByRole('button', { name: '全部' });
    const digitalButton = screen.getByRole('button', { name: '数码办公' });
    const priceSortButton = screen.getByRole('button', { name: '价格升序' });

    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(digitalButton).toHaveAttribute('aria-pressed', 'false');
    expect(priceSortButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(digitalButton);
    await user.click(priceSortButton);

    expect(allButton).toHaveAttribute('aria-pressed', 'false');
    expect(digitalButton).toHaveAttribute('aria-pressed', 'true');
    expect(priceSortButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('blocks add cart for offline product detail', async () => {
    renderShop(['/shop/detail/p-008']);

    expect(await screen.findByText('商品已下架')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '加入购物车' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '立即购买' })).toBeDisabled();
  });

  it('renders product detail with glass purchase bar and touch-safe actions', async () => {
    renderShop(['/shop/detail/p-001']);

    expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();
    expectLatestNavigationTitle('商品详情');
    expect(screen.getByTestId('shop-back-button')).toHaveAccessibleName('返回');
    const purchaseBar = screen.getByTestId('detail-purchase-bar');
    expect(purchaseBar.className).toContain('backdrop-blur-md');
    expect(purchaseBar.className).toContain('bg-white/80');
    expect(screen.getByRole('button', { name: '收藏' }).className).toContain('h-11');
    expect(screen.getByRole('button', { name: '加入购物车' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '立即购买' })).toBeEnabled();
  });

  it('adds online product to cart after login', async () => {
    const user = userEvent.setup();
    await productService.toggleProductStatus('p-001', 'online');
    renderShop(['/shop/detail/p-001']);

    expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '加入购物车' }));

    await waitFor(() => expect(screen.getByText('已加入购物车')).toBeInTheDocument());
  });

  it('prepares the current product when buying immediately from detail', async () => {
    const user = userEvent.setup();
    renderShop(['/shop/detail/p-001']);

    expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '立即购买' }));

    await waitFor(() => expect(screen.getAllByText('确认订单')).not.toHaveLength(0));
    expectLatestNavigationTitle('确认订单');
    expect(screen.getByText('默认地址')).toBeInTheDocument();
    expect(screen.getByText('曜石无线降噪耳机')).toBeInTheDocument();
  });

  it('keeps empty-sku product detail stable and disables purchase actions', async () => {
    const created = await productService.createProduct({
      name: '空规格商品',
      categoryId: 'cat-digital-office',
      price: 128,
      stock: 8,
      image: 'https://dummyimage.com/640x480/e8eef3/203244&text=empty-sku',
      status: 'online',
      skuOptions: [],
    });

    renderShop([`/shop/detail/${created.data.id}`]);

    expect(await screen.findByText('空规格商品')).toBeInTheDocument();
    expect(screen.getByText('商品规格不存在')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '加入购物车' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '立即购买' })).toBeDisabled();
  });

  it('initializes and syncs favorite status for logged-in user', async () => {
    const user = userEvent.setup();
    await authService.loginUser('member', '123456');
    await favoriteService.toggleFavorite('user-001', 'p-001');

    renderShop(['/shop/detail/p-001']);

    const cancelButton = await screen.findByRole('button', { name: '取消收藏' });
    await user.click(cancelButton);

    await waitFor(() => expect(screen.getByRole('button', { name: '收藏' })).toBeInTheDocument());
    expect(favoriteService.listFavoritesSync('user-001')).toHaveLength(0);
  });
});
