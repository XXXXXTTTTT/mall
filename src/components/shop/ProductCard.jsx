// 前台商品卡片。
import { Link } from 'react-router-dom';
import { ProductTag } from './ProductTag.jsx';
import { StatusTag } from './StatusTag.jsx';

// 渲染商品卡片并跳转到详情页。
export function ProductCard({ product }) {
  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <Link
      to={`/shop/detail/${product.id}`}
      className="group block overflow-hidden rounded-[2rem] border border-white/75 bg-[#fbfcfa] shadow-[0_20px_54px_rgba(24,36,51,0.1)] transition duration-200 hover:-translate-y-0.5 hover:border-teal-500/30 hover:shadow-[0_28px_68px_rgba(24,36,51,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-teal-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <StatusTag status={product.status} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/18 to-transparent" />
      </div>
      <div className="space-y-3 p-3.5">
        <div className="space-y-2">
          <h3 className="line-clamp-1 text-sm font-semibold leading-5 text-slate-950">{product.name}</h3>
          <div className="flex flex-wrap items-end justify-between gap-1.5">
            <p className="text-lg font-bold tracking-tight text-slate-950">¥{product.price}</p>
            <p className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm">
              库存 {product.stock}
            </p>
          </div>
        </div>
        <div data-testid="product-card-tags" className="flex flex-wrap gap-1 items-center">
          {tags.map((tag) => (
            <ProductTag key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </Link>
  );
}
