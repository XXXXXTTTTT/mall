/* eslint-disable react-refresh/only-export-components */
// 应用路由定义与访问控制入口。
import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom';
import { authService, permissionService } from './mock/mockService.js';
import { AdminLayout } from './pages/admin/AdminLayout.jsx';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.jsx';
import { AdminAccountPage } from './pages/admin/AdminAccountPage.jsx';
import { AdminCategoryPage } from './pages/admin/AdminCategoryPage.jsx';
import { AdminLogPage } from './pages/admin/AdminLogPage.jsx';
import { AdminOrderPage } from './pages/admin/AdminOrderPage.jsx';
import { AdminProductPage } from './pages/admin/AdminProductPage.jsx';
import { AdminRolePage } from './pages/admin/AdminRolePage.jsx';
import { AdminUserPage } from './pages/admin/AdminUserPage.jsx';
import { Dashboard } from './pages/admin/Dashboard.jsx';
import { NoPermissionPage } from './pages/admin/NoPermissionPage.jsx';
import { AddressPage } from './pages/shop/AddressPage.jsx';
import { Cart } from './pages/shop/Cart.jsx';
import { Category } from './pages/shop/Category.jsx';
import { CreateOrder } from './pages/shop/CreateOrder.jsx';
import { Detail } from './pages/shop/Detail.jsx';
import { FavoritesPage } from './pages/shop/FavoritesPage.jsx';
import { Home } from './pages/shop/Home.jsx';
import { LoginPage } from './pages/shop/LoginPage.jsx';
import { OrderDetailPage } from './pages/shop/OrderDetailPage.jsx';
import { OrderListPage } from './pages/shop/OrderListPage.jsx';
import { Pay } from './pages/shop/Pay.jsx';
import { PaySuccess } from './pages/shop/PaySuccess.jsx';
import { SearchPage } from './pages/shop/SearchPage.jsx';
import { ShopLayout } from './pages/shop/ShopLayout.jsx';
import { UserPage } from './pages/shop/UserPage.jsx';

function RequireShopAuth({ children }) {
  const location = useLocation();
  const session = authService.getUserSession();
  if (!session) {
    // 前台受保护页面统一回退到登录页，保留原始跳转路径。
    return <Navigate to="/shop/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function RequireAdminAuth({ permission, children }) {
  const location = useLocation();
  const session = authService.getAdminSession();
  if (!session) {
    // 后台未登录时先进入后台登录页，再继续处理权限判断。
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  if (!permissionService.canAccess(session.roleCode, permission)) {
    return <NoPermissionPage />;
  }
  return children;
}

// 前台和后台共用同一棵路由树，便于集中管理跳转与访问控制。
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/shop" replace /> },
  {
    path: '/shop',
    element: <ShopLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'category', element: <Category /> },
      { path: 'detail/:productId', element: <Detail /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'pay/:orderId', element: <Pay /> },
      { path: 'pay-success/:orderId', element: <PaySuccess /> },
      {
        path: 'cart',
        element: (
          <RequireShopAuth>
            <Cart />
          </RequireShopAuth>
        ),
      },
      {
        path: 'create-order',
        element: (
          <RequireShopAuth>
            <CreateOrder />
          </RequireShopAuth>
        ),
      },
      {
        path: 'orders',
        element: (
          <RequireShopAuth>
            <OrderListPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'orders/:orderId',
        element: (
          <RequireShopAuth>
            <OrderDetailPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'user',
        element: (
          <RequireShopAuth>
            <UserPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'address',
        element: (
          <RequireShopAuth>
            <AddressPage />
          </RequireShopAuth>
        ),
      },
      {
        path: 'favorites',
        element: (
          <RequireShopAuth>
            <FavoritesPage />
          </RequireShopAuth>
        ),
      },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RequireAdminAuth permission="dashboard">
            <Dashboard />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'products',
        element: (
          <RequireAdminAuth permission="products">
            <AdminProductPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'categories',
        element: (
          <RequireAdminAuth permission="categories">
            <AdminCategoryPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'orders',
        element: (
          <RequireAdminAuth permission="orders">
            <AdminOrderPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'roles',
        element: (
          <RequireAdminAuth permission="roles">
            <AdminRolePage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'users',
        element: (
          <RequireAdminAuth permission="users">
            <AdminUserPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'account',
        element: (
          <RequireAdminAuth permission="account">
            <AdminAccountPage />
          </RequireAdminAuth>
        ),
      },
      {
        path: 'logs',
        element: (
          <RequireAdminAuth permission="logs">
            <AdminLogPage />
          </RequireAdminAuth>
        ),
      },
    ],
  },
]);

export default router;
