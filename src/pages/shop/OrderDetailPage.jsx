import { useParams } from 'react-router-dom';

export function OrderDetailPage() {
  const { orderId } = useParams();
  return <main className="mx-auto max-w-md p-6 text-slate-900">订单详情：{orderId}</main>;
}
