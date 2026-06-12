import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { MetricTile } from '../../components/shop/MetricTile.jsx';
import { SettingRow } from '../../components/shop/SettingRow.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { authService, favoriteService, orderService } from '../../mock/mockService.js';

export function UserPage() {
  const navigate = useNavigate();
  const [metricStatus, setMetricStatus] = useState('');
  const user = authService.getUserSession();
  const orders = user ? orderService.listOrdersSync(user.id) : [];
  const favorites = user ? favoriteService.listFavoritesSync(user.id) : [];
  const recentOrders = orders.slice(0, 2);

  function logout() {
    authService.logoutUser();
    navigate('/shop/login');
  }

  function openPoints() {
    setMetricStatus('积分明细已打开');
  }

  function openCoupons() {
    setMetricStatus('优惠券中心已打开');
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 py-6 text-slate-900">
      <IOSCard as="section" className="sticky top-0 z-50 overflow-hidden p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)]">
            <ShopIcon name="user" className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Member</p>
            <h1 className="mt-2 truncate text-3xl font-bold tracking-tight text-slate-950">
              {user?.username || '未登录'}
            </h1>
            {user?.name ? (
              <span className="mt-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                {user.name}
              </span>
            ) : null}
          </div>
        </div>
      </IOSCard>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <MetricTile icon="star" label="积分" value="1280" onClick={openPoints} />
        <MetricTile icon="coupon" label="优惠券" value="3" onClick={openCoupons} />
        <MetricTile icon="heart" label="收藏" value={favorites.length} to="/shop/favorites" />
        <MetricTile icon="receipt" label="订单" value={orders.length} to="/shop/orders" />
      </section>
      {metricStatus ? (
        <p className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg" role="status">
          {metricStatus}
        </p>
      ) : null}

      <IOSCard as="section" className="mt-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-950">最近订单</h2>
          <Link
            to="/shop/orders"
            className="text-sm font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            查看全部
          </Link>
        </div>
        {recentOrders.length ? (
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/shop/orders/${order.id}`}
                className="flex items-center gap-3 rounded-[1.5rem] bg-slate-50 px-4 py-3 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                  <ShopIcon name="receipt" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-950">{order.id}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {order.items.map((item) => item.productName).join('、')}
                  </span>
                </span>
                <span className="text-sm font-bold text-slate-950">¥{order.totalAmount}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-[1.5rem] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">暂无订单</p>
        )}
      </IOSCard>

      <nav className="mt-5 grid gap-3">
        <SettingRow icon="receipt" title="我的订单" to="/shop/orders" tone="teal" />
        <SettingRow icon="heart" title="我的收藏" to="/shop/favorites" tone="rose" />
        <SettingRow icon="location" title="地址管理" to="/shop/address" tone="amber" />
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white px-4 py-3 text-left shadow-sm transition hover:border-red-200 hover:bg-red-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <ShopIcon name="user" />
          </span>
          <span className="text-sm font-semibold text-slate-500">退出登录</span>
        </button>
      </nav>
    </main>
  );
}
