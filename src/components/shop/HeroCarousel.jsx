import { Link } from 'react-router-dom';
import { ProductTag } from './ProductTag.jsx';
import { ShopIcon } from './ShopIcon.jsx';

export function HeroCarousel({ products }) {
  const carouselProducts = products.slice(0, 3);

  return (
    <section
      data-testid="shop-hero-carousel"
      aria-label="首页轮播图"
      className="space-y-3 overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_24px_60px_rgba(24,36,51,0.12)] backdrop-blur-md"
    >
      <div className="flex gap-3 overflow-x-auto pb-1">
        {carouselProducts.map((product) => {
          const tags = Array.isArray(product.tags) ? product.tags.slice(0, 2) : [];

          return (
            <Link
              key={product.id}
              to={`/shop/detail/${product.id}`}
              className="group relative min-w-[82%] overflow-hidden rounded-[1.75rem] bg-slate-950 text-white shadow-[0_20px_44px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full object-cover opacity-80 transition duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <ProductTag key={tag} tag={tag} />
                  ))}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-100">精选上新</p>
                    <h2 className="mt-1 line-clamp-2 text-2xl font-bold leading-tight">{product.name}</h2>
                  </div>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg">
                    <ShopIcon name="chevronRight" className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
