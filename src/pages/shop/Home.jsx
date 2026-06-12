import { Link } from 'react-router-dom';
import { HeroCarousel } from '../../components/shop/HeroCarousel.jsx';
import { IconButton } from '../../components/shop/IconButton.jsx';
import { ProductCard } from '../../components/shop/ProductCard.jsx';
import { SectionHeader } from '../../components/shop/SectionHeader.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { productService } from '../../mock/mockService.js';

export function Home() {
  const onlineProducts = productService.listProductsSync().filter((product) => product.status === 'online');
  const hotProducts = onlineProducts.filter((product) => product.tags?.includes('热门')).slice(0, 4);
  const newProducts = onlineProducts.filter((product) => product.tags?.includes('新品')).slice(0, 4);
  const dealProducts = onlineProducts.filter((product) => product.tags?.includes('限时特惠')).slice(0, 4);

  return (
    <main className="space-y-8 px-5 pb-8 pt-6">
      <header className="sticky top-0 z-50 -mx-5 border-b border-white/70 bg-[#FBFCFA]/90 px-5 py-4 shadow-[0_14px_34px_rgba(24,36,51,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/shop/search"
            aria-label="搜索商品"
            className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-slate-200/80 bg-white px-4 text-left text-sm font-semibold text-slate-400 shadow-sm transition hover:border-teal-200 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <ShopIcon name="search" className="h-5 w-5 shrink-0" />
            <span>搜索商品、分类或生活方式</span>
          </Link>
          <IconButton ariaLabel="打开分类" icon="grid" to="/shop/category" />
        </div>
      </header>

      <HeroCarousel products={onlineProducts} />

      <section className="space-y-4">
        <SectionHeader eyebrow="HOT" title="热门商品" actionText="查看全部" actionTo="/shop/category" />
        <div className="grid gap-4">
          {hotProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="NEW" title="新品精选" actionText="去索引" actionTo="/shop/category" />
        <div className="grid grid-cols-2 gap-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="DEAL" title="限时特惠" actionText="更多商品" actionTo="/shop/category" />
        <div className="grid grid-cols-2 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
