import { Link } from 'react-router-dom';
import { StatusTag } from './StatusTag.jsx';

export function ProductCard({ product }) {
  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <Link
      to={`/shop/detail/${product.id}`}
      className="group block overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[#fbfcfa] shadow-[0_18px_48px_rgba(24,36,51,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-teal-500/30 hover:shadow-[0_24px_58px_rgba(24,36,51,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <StatusTag status={product.status} />
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-950">{product.name}</h3>
          <div className="flex items-end justify-between gap-3">
            <p className="text-xl font-bold tracking-tight text-slate-950">¥{product.price}</p>
            <p className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              库存 {product.stock}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
