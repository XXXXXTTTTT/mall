import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusTag } from '../../components/shop/StatusTag.jsx';
import { authService, orderService } from '../../mock/mockService.js';

const FILTERS = [
  { label: '待支付', value: 'pending_payment' },
  { label: '已支付', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'canceled' },
];

export function OrderListPage() {
  const user = authService.getUserSession();
  const orders = useMemo(() => (user ? orderService.listOrdersSync(user.id) : []), [user]);
  const [status, setStatus] = useState('');
  const visibleOrders = useMemo(
    () => (status ? orders.filter((order) => order.status === status) : orders),
    [orders, status],
  );

  return (
    <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 py-6 text-slate-900">
      <header className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Orders</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">订单列表</h1>
      </header>
      <section className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatus((value) => (value === filter.value ? '' : filter.value))}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              status === filter.value
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-200 bg-[#fbfcfa] text-slate-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>
      <section className="mt-5 space-y-4">
        {visibleOrders.map((order) => (
          <Link
            key={order.id}
            to={`/shop/orders/${order.id}`}
            className="block rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)] transition hover:border-teal-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-slate-950">{order.id}</p>
              <StatusTag status={order.status} />
            </div>
            <p className="mt-3 text-sm text-slate-500">{order.items.map((item) => item.productName).join('、')}</p>
            <p className="mt-4 text-2xl font-bold text-slate-950">¥{order.totalAmount}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
