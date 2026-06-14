import { Link, useParams } from 'react-router-dom';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
import { StatusTag } from '../../components/shop/StatusTag.jsx';
import { ORDER_STATUS, orderService } from '../../mock/mockService.js';

export function OrderDetailPage() {
  const { orderId } = useParams();
  const order = orderService.getOrderByIdSync(orderId);

  if (!order) {
    return (
      <>
        <ShopNavigationBar title="订单详情" />
        <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
          <IOSCard as="section" className="p-6 text-center">
            <h1 className="text-2xl font-bold text-slate-950">订单不存在</h1>
          </IOSCard>
        </main>
      </>
    );
  }

  return (
    <>
      <ShopNavigationBar title="订单详情" />
      <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
        <IOSCard as="header" className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Detail</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">订单详情</h1>
            </div>
            <StatusTag status={order.status} />
          </div>
          <p className="mt-4 break-all text-sm font-semibold leading-relaxed tracking-wide text-slate-500">{order.id}</p>
        </IOSCard>

        <IOSCard as="section" className="mt-5 p-5">
        <h2 className="text-lg font-bold text-slate-950">商品快照</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.skuId}`} className="rounded-3xl bg-slate-50 p-4">
              <p className="text-base font-bold leading-relaxed tracking-wide text-slate-950">{item.productName}</p>
              <p className="mt-1 text-sm leading-relaxed tracking-wide text-slate-500">
                {item.skuName} × {item.quantity}
              </p>
              <p className="mt-2 text-lg font-bold tracking-wide text-slate-950">¥{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        </IOSCard>

        <IOSCard as="section" className="mt-5 p-5">
        <h2 className="text-lg font-bold text-slate-950">收货信息</h2>
        <p className="mt-3 font-bold leading-relaxed tracking-wide text-slate-950">
          {order.addressSnapshot.receiver} {order.addressSnapshot.phone}
        </p>
        <p className="mt-1 text-sm leading-relaxed tracking-wide text-slate-500">
          {order.addressSnapshot.province} {order.addressSnapshot.city} {order.addressSnapshot.detail}
        </p>
        </IOSCard>

        <IOSCard as="section" className="mt-5 p-5">
        <h2 className="text-lg font-bold text-slate-950">支付信息</h2>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>实付金额</span>
          <span className="text-2xl font-bold tracking-wide text-slate-950">¥{order.totalAmount}</span>
        </div>
        {order.paidAt ? <p className="mt-2 text-sm leading-relaxed tracking-wide text-slate-500">支付时间 {order.paidAt}</p> : null}
        {order.status === ORDER_STATUS.pendingPayment ? (
          <div className="mt-4 flex justify-end">
            <Link
              to={`/shop/pay/${order.id}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              去支付
            </Link>
          </div>
        ) : null}
        </IOSCard>

        <IOSCard as="section" className="mt-5 p-5">
        <h2 className="text-lg font-bold text-slate-950">物流信息</h2>
        {order.logistics?.length ? (
          <div data-testid="order-logistics-timeline" className="mt-4 space-y-4">
            {order.logistics.map((item) => (
              <div key={`${item.company}-${item.trackingNo}`} className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <ShopIcon name="truck" />
                </span>
                <div className="min-w-0 flex-1 rounded-3xl bg-slate-50 p-4">
                  <p className="font-bold leading-relaxed tracking-wide text-slate-950">{item.company}</p>
                  <p className="mt-1 break-all text-sm font-semibold leading-relaxed tracking-wide text-slate-500">{item.trackingNo}</p>
                  <p className="mt-1 text-xs leading-relaxed tracking-wide text-slate-400">{item.shippedAt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">暂无物流信息</p>
        )}
        </IOSCard>
      </main>
    </>
  );
}
