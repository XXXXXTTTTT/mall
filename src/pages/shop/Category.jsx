import { useState } from 'react';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { ProductCard } from '../../components/shop/ProductCard.jsx';
import { categoryService, productService } from '../../mock/mockService.js';

const sortOptions = ['综合', '价格升序', '价格降序', '销量优先'];

export function Category() {
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [activeSort, setActiveSort] = useState('综合');
  const categories = categoryService.listCategoriesSync();
  const onlineProducts = productService.listProductsSync().filter((product) => product.status === 'online');
  const visibleProducts = onlineProducts
    .filter((product) => activeCategoryId === 'all' || product.categoryId === activeCategoryId)
    .sort((left, right) => {
      if (activeSort === '价格升序') return left.price - right.price;
      if (activeSort === '价格降序') return right.price - left.price;
      if (activeSort === '销量优先') return right.sales - left.sales;
      return 0;
    });

  return (
    <main className="space-y-6 px-5 pb-8 pt-6">
      <section className="rounded-[2rem] border border-slate-200/80 bg-[#FBFCFA] p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F6F8B]">CATEGORY</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">全部分类</h1>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategoryId === 'all' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategoryId === category.id
                  ? 'bg-slate-950 text-white'
                  : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sortOptions.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveSort(label)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeSort === label ? 'bg-[#E7F3F4] text-[#1F6F8B]' : 'bg-white text-slate-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleProducts.length > 0 ? (
        <section className="grid grid-cols-2 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <EmptyState title="暂无商品" description="当前分类暂时没有可购买商品。" />
      )}
    </main>
  );
}
