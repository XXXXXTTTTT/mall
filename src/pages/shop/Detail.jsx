import { useParams } from 'react-router-dom';

export function Detail() {
  const { productId } = useParams();
  return <main className="mx-auto max-w-md p-6 text-slate-900">商品详情：{productId}</main>;
}
