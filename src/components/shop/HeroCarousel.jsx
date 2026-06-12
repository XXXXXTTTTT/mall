import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductTag } from './ProductTag.jsx';
import { ShopIcon } from './ShopIcon.jsx';

const AUTO_ADVANCE_MS = 3600;
const SWIPE_THRESHOLD = 36;

export function HeroCarousel({ products }) {
  const carouselProducts = products.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef(null);

  useEffect(() => {
    if (carouselProducts.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % carouselProducts.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [carouselProducts.length]);

  useEffect(() => {
    if (carouselProducts.length === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((index) => Math.min(index, carouselProducts.length - 1));
  }, [carouselProducts.length]);

  if (carouselProducts.length === 0) return null;

  const safeActiveIndex = Math.min(activeIndex, carouselProducts.length - 1);
  const product = carouselProducts[safeActiveIndex];
  const tags = Array.isArray(product.tags) ? product.tags.slice(0, 2) : [];

  function goTo(index) {
    setActiveIndex(index);
  }

  function handleTouchStart(event) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event) {
    if (touchStartXRef.current === null || carouselProducts.length <= 1) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = touchStartXRef.current - endX;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    setActiveIndex((index) => {
      if (deltaX > 0) return (index + 1) % carouselProducts.length;
      return (index - 1 + carouselProducts.length) % carouselProducts.length;
    });
  }

  return (
    <section
      data-testid="shop-hero-carousel"
      aria-label="首页轮播图"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="space-y-3 overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_24px_60px_rgba(24,36,51,0.12)] backdrop-blur-md"
    >
      <Link
        key={product.id}
        to={`/shop/detail/${product.id}`}
        className="group relative block overflow-hidden rounded-[1.75rem] bg-slate-950 text-white shadow-[0_20px_44px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]"
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
      <div className="flex items-center justify-center gap-2">
        {carouselProducts.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`切换到第 ${index + 1} 张轮播图`}
            aria-pressed={safeActiveIndex === index}
            onClick={() => goTo(index)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <span
              className={`h-2.5 rounded-full transition-all ${
                safeActiveIndex === index ? 'w-7 bg-slate-950' : 'w-2.5 bg-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
