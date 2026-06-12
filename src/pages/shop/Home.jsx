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
      <section className="sticky top-0 z-50 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#98D3DC]">云仓优品</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight">可信赖的精选商城</h1>
          </div>
          <IconButton ariaLabel="打开索引" icon="grid" to="/shop/category" />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">精选高频生活商品，用稳定服务、透明库存和克制价格，让每一次下单更安心。</p>
        <label className="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-white px-5 py-3 text-slate-950 transition focus-within:border-[#98D3DC] focus-within:ring-2 focus-within:ring-[#98D3DC]/50">
          <ShopIcon name="search" className="h-5 w-5 shrink-0 text-slate-400" />
          <span className="sr-only">搜索商品</span>
          <input
            type="search"
            placeholder="搜索商品、分类或生活方式"
            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </label>
      </section>

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
