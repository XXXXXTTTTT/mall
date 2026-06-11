import { useState } from 'react';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { ProductCard } from '../../components/shop/ProductCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { categoryService, productService } from '../../mock/mockService.js';

const sortOptions = ['综合', '价格升序', '价格降序', '销量优先'];

export function Category() {
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [activeSort, setActiveSort] = useState('综合');
  const categories = categoryService.listCategoriesSync();
  const parentCategories = categories.filter((category) => category.parentId === null);
  const onlineProducts = productService.listProductsSync().filter((product) => product.status === 'online');
  const visibleProducts = onlineProducts
    .filter((product) => {
      if (activeCategoryId === 'all') return true;
      const childCategoryIds = categories
        .filter((category) => category.parentId === activeCategoryId)
        .map((category) => category.id);
      return product.categoryId === activeCategoryId || childCategoryIds.includes(product.categoryId);
    })
    .sort((left, right) => {
      if (activeSort === '价格升序') return left.price - right.price;
      if (activeSort === '价格降序') return right.price - left.price;
      if (activeSort === '销量优先') return right.sales - left.sales;
      return 0;
    });

  return (
    <main className="space-y-6 px-5 pb-8 pt-6">
      <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_48px_rgba(24,36,51,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F3F4] text-[#1F6F8B]">
            <ShopIcon name="grid" className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F6F8B]">CATEGORY</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">分类索引</h1>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`min-h-11 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeCategoryId === 'all' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            全部
          </button>
          {parentCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={`min-h-11 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
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
            className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
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
