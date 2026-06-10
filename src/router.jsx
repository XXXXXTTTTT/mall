import { createBrowserRouter, Navigate } from 'react-router-dom';

function TemporaryHome() {
  return (
    <main className="min-h-screen p-6 text-slate-900">
      <h1 className="text-3xl font-bold">云仓优品</h1>
      <p className="mt-3 text-slate-600">商城系统基础路由已启动。</p>
    </main>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/shop" replace /> },
  { path: '/shop', element: <TemporaryHome /> },
]);

export default router;
