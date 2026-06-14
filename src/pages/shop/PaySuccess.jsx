// 前台支付成功页。
import { Link, useParams } from 'react-router-dom';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';

// 渲染支付完成后的结果页。
export function PaySuccess() {
  const { orderId } = useParams();
  return (
    <>
      <ShopNavigationBar title="支付成功" />
      <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
        <section className="rounded-[2rem] bg-[#fbfcfa] p-8 text-center shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-teal-50 text-3xl font-bold text-teal-700">
            <ShopIcon name="check" className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">支付成功</h1>
          <p className="mt-3 text-sm text-slate-500">订单 {orderId} 已完成支付。</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link
              to={`/shop/orders/${orderId}`}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              查看订单详情
            </Link>
            <Link
              to="/shop"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-500/40 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              继续逛逛
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
