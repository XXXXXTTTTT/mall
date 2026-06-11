import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider } from './context/AppContext.jsx';
import { authService, databaseService } from './mock/mockService.js';
import { Cart } from './pages/shop/Cart.jsx';
import { LoginPage } from './pages/shop/LoginPage.jsx';
import { AdminProductPage } from './pages/admin/AdminProductPage.jsx';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.jsx';
import { NoPermissionPage } from './pages/admin/NoPermissionPage.jsx';

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

function RequireShopAuthForTest({ children }) {
  const session = authService.getUserSession();
  if (!session) return <LoginPage />;
  return children;
}

function RequireAdminProductsForTest({ children }) {
  const session = authService.getAdminSession();
  if (!session) return <AdminLoginPage />;
  if (session.roleCode !== 'admin') return <NoPermissionPage />;
  return children;
}

function renderWithRouter(routes, initialEntries) {
  const router = createMemoryRouter(routes, { initialEntries });
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

describe('route guards', () => {
  it('shows shop login when cart is accessed without user session', async () => {
    renderWithRouter(
      [
        {
          path: '/shop/cart',
          element: (
            <RequireShopAuthForTest>
              <Cart />
            </RequireShopAuthForTest>
          ),
        },
      ],
      ['/shop/cart'],
    );

    expect(await screen.findByRole('heading', { level: 1, name: '前台登录' })).toBeInTheDocument();
  });

  it('blocks operator from admin product page', async () => {
    await authService.loginAdmin('operator', 'op123456');
    renderWithRouter(
      [
        {
          path: '/admin/products',
          element: (
            <RequireAdminProductsForTest>
              <AdminProductPage />
            </RequireAdminProductsForTest>
          ),
        },
      ],
      ['/admin/products'],
    );

    await waitFor(() => expect(screen.getByText('无权限')).toBeInTheDocument());
  });

  it('allows admin to reach admin product page', async () => {
    await authService.loginAdmin('admin', 'admin123');
    renderWithRouter(
      [
        {
          path: '/admin/products',
          element: (
            <RequireAdminProductsForTest>
              <AdminProductPage />
            </RequireAdminProductsForTest>
          ),
        },
      ],
      ['/admin/products'],
    );

    await waitFor(() => expect(screen.getByText('商品管理')).toBeInTheDocument());
  });
});
