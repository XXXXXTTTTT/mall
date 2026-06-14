// 前台支付页。
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
import { ORDER_STATUS, orderService } from '../../mock/mockService.js';

const PAID_STATUS_MESSAGES = {
  [ORDER_STATUS.paid]: '订单已支付，无需重复支付',
  [ORDER_STATUS.shipped]: '订单已发货，无需重复支付',
  [ORDER_STATUS.completed]: '订单已完成，无需重复支付',
  [ORDER_STATUS.canceled]: '订单已取消，无法继续支付',
};

// 渲染模拟支付页并更新订单支付状态。
export function Pay() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = orderService.getOrderByIdSync(orderId);
  const isPayable = order?.status === ORDER_STATUS.pendingPayment;
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isPayable) return undefined;
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [isPayable, secondsLeft]);

  // 确认支付并跳转到支付成功页。
  async function confirmPaid() {
    const result = await orderService.payOrder(orderId);
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    navigate(`/shop/pay-success/${orderId}`);
  }

  if (!order) {
    return (
      <>
        <ShopNavigationBar title="模拟支付" />
        <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
          <section className="rounded-[2rem] bg-[#fbfcfa] p-6 text-center shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
            <h1 className="text-2xl font-bold text-slate-950">订单不存在</h1>
          </section>
        </main>
      </>
    );
  }

  if (!isPayable) {
    return (
      <>
        <ShopNavigationBar title="模拟支付" />
        <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
          <section className="rounded-[2rem] bg-[#fbfcfa] p-6 text-center shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Pay</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">模拟支付</h1>
            <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-50 text-slate-700">
              <ShopIcon name="receipt" className="h-7 w-7" />
            </div>
            <p className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
              {PAID_STATUS_MESSAGES[order.status] || '订单状态不允许支付'}
            </p>
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-full bg-slate-300 px-6 py-4 text-sm font-bold text-white"
            >
              确认已支付
            </button>
          </section>
        </main>
      </>
    );
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <>
      <ShopNavigationBar title="模拟支付" />
      <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
        <section className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_18px_42px_rgba(15,23,42,0.18)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShopIcon name="receipt" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Pay</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">模拟支付</h1>
              </div>
            </div>
            <div className="mt-6 rounded-[1.5rem] bg-white/10 p-5">
              <p className="text-sm font-semibold text-slate-300">订单金额</p>
              <p className="mt-2 text-4xl font-bold">¥{order.totalAmount}</p>
            </div>
          </div>
          <div className="mt-5 rounded-[1.75rem] border border-teal-100 bg-teal-50 p-5 text-teal-800">
            <p className="text-sm font-bold">支付倒计时</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {minutes}:{seconds}
            </p>
          </div>
          {secondsLeft === 0 ? <p className="mt-4 text-sm font-semibold text-amber-700">支付已超时</p> : null}
          {message ? <p className="mt-4 text-sm font-semibold text-amber-700">{message}</p> : null}
          <button
            type="button"
            disabled={secondsLeft === 0}
            onClick={confirmPaid}
            className="mt-6 w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            确认已支付
          </button>
        </section>
      </main>
    </>
  );
}
