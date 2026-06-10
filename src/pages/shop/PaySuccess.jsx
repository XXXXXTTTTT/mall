import { useParams } from 'react-router-dom';

export function PaySuccess() {
  const { orderId } = useParams();
  return <main className="mx-auto max-w-md p-6 text-slate-900">支付成功：{orderId}</main>;
}
