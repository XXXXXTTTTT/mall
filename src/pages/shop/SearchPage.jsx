// 前台搜索页。
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { ProductCard } from '../../components/shop/ProductCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
import { categoryService, productService } from '../../mock/mockService.js';

// 渲染商品搜索页并按关键词过滤结果。
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const categories = categoryService.listCategoriesSync();
  const onlineProducts = productService.listProductsSync().filter((product) => product.status === 'online');
  const normalizedKeyword = keyword.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedKeyword) return onlineProducts;
    return onlineProducts.filter((product) => {
      const category = categories.find((item) => item.id === product.categoryId);
      return [product.name, product.description, category?.name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedKeyword));
    });
  }, [categories, normalizedKeyword, onlineProducts]);

  return (
    <>
      <ShopNavigationBar title="搜索商品" />
      <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F6] px-4 pb-8 pt-20 text-slate-900">
        <label className="sticky top-20 z-40 flex min-h-12 items-center gap-3 rounded-full border border-white/80 bg-white/90 px-4 shadow-[0_14px_32px_rgba(24,36,51,0.08)] backdrop-blur-md focus-within:ring-2 focus-within:ring-teal-500">
          <ShopIcon name="search" className="h-5 w-5 shrink-0 text-slate-400" />
          <span className="sr-only">输入商品关键词</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            type="search"
            autoFocus
            placeholder="搜索商品、分类或生活方式"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
          />
        </label>

        <section className="mt-5 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Search</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {normalizedKeyword ? `找到 ${results.length} 件商品` : '全部可售商品'}
              </h1>
            </div>
          </div>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState title="没有找到商品" description="换一个关键词试试，例如耳机、咖啡、灯。" actionText="返回首页" actionTo="/shop" />
          )}
        </section>
      </main>
    </>
  );
}
