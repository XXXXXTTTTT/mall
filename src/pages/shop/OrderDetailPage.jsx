import { useParams } from 'react-router-dom';
import { StatusTag } from '../../components/shop/StatusTag.jsx';
import { orderService } from '../../mock/mockService.js';

export function OrderDetailPage() {
  const { orderId } = useParams();
  const order = orderService.getOrderByIdSync(orderId);

  if (!order) {
    return (
      <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 py-6 text-slate-900">
        <section className="rounded-[2rem] bg-[#fbfcfa] p-6 text-center shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
          <h1 className="text-2xl font-bold text-slate-950">订单不存在</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 py-6 text-slate-900">
      <header className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Detail</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">订单详情</h1>
          </div>
          <StatusTag status={order.status} />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500">{order.id}</p>
      </header>

      <section className="mt-5 rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <h2 className="text-lg font-bold text-slate-950">商品快照</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.skuId}`} className="rounded-3xl bg-slate-50 p-4">
              <p className="font-bold text-slate-950">{item.productName}</p>
              <p className="mt-1 text-sm text-slate-500">
                {item.skuName} × {item.quantity}
              </p>
              <p className="mt-2 font-bold text-slate-950">¥{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <h2 className="text-lg font-bold text-slate-950">收货信息</h2>
        <p className="mt-3 font-bold text-slate-950">
          {order.addressSnapshot.receiver} {order.addressSnapshot.phone}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {order.addressSnapshot.province} {order.addressSnapshot.city} {order.addressSnapshot.detail}
        </p>
      </section>

      <section className="mt-5 rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <h2 className="text-lg font-bold text-slate-950">支付信息</h2>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>实付金额</span>
          <span className="text-2xl font-bold text-slate-950">¥{order.totalAmount}</span>
        </div>
        {order.paidAt ? <p className="mt-2 text-sm text-slate-500">支付时间 {order.paidAt}</p> : null}
      </section>

      <section className="mt-5 rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <h2 className="text-lg font-bold text-slate-950">物流信息</h2>
        {order.logistics?.length ? (
          <div className="mt-4 space-y-3">
            {order.logistics.map((item) => (
              <div key={`${item.company}-${item.trackingNo}`} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-bold text-slate-950">{item.company}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{item.trackingNo}</p>
                <p className="mt-1 text-xs text-slate-400">{item.shippedAt}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">暂无物流信息</p>
        )}
      </section>
    </main>
  );
}
