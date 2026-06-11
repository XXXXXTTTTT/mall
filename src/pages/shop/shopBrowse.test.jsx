import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from '../../context/AppContext.jsx';
import { databaseService, productService } from '../../mock/mockService.js';
import { Category } from './Category.jsx';
import { Detail } from './Detail.jsx';
import { Home } from './Home.jsx';
import { LoginPage } from './LoginPage.jsx';
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
          { path: 'login', element: <LoginPage /> },
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

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('shop browse pages', () => {
  it('hides offline products on home and category pages', async () => {
    renderShop(['/shop']);

    expect(await screen.findByText('可信赖的精选商城')).toBeInTheDocument();
    expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();

    renderShop(['/shop/category']);

    expect(await screen.findByText('全部分类')).toBeInTheDocument();
    expect(screen.queryByText('恒温香薰加湿器')).not.toBeInTheDocument();
  });

  it('blocks add cart for offline product detail', async () => {
    renderShop(['/shop/detail/p-008']);

    expect(await screen.findByText('商品已下架')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '加入购物车' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '立即购买' })).toBeDisabled();
  });

  it('adds online product to cart after login', async () => {
    const user = userEvent.setup();
    await productService.toggleProductStatus('p-001', 'online');
    renderShop(['/shop/detail/p-001']);

    expect(await screen.findByText('曜石无线降噪耳机')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '加入购物车' }));

    await waitFor(() => expect(screen.getByText('已加入购物车')).toBeInTheDocument());
  });
});
