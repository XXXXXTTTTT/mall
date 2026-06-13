import { useState } from 'react';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { ProductCard } from '../../components/shop/ProductCard.jsx';
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
    <main className="mx-auto h-screen max-w-md overflow-hidden bg-[#F5F7F6] text-slate-900">
      <header className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-md border-b border-white/70 bg-[#FBFCFA]/90 px-5 py-4 text-center shadow-[0_14px_34px_rgba(24,36,51,0.08)] backdrop-blur-md">
        <h1 className="text-lg font-bold tracking-tight text-slate-950">分类</h1>
      </header>

      <div className="mt-16 flex h-[calc(100vh-4rem-6rem)]">
        <nav
          aria-label="一级分类"
          data-testid="category-rail"
          className="scrollbar-none h-full overflow-y-auto w-[6.75rem] shrink-0 border-r border-slate-200/70 bg-white/65 py-3"
        >
          <button
            type="button"
            aria-pressed={activeCategoryId === 'all'}
            onClick={() => setActiveCategoryId('all')}
            className={`relative flex min-h-14 w-full items-center justify-center px-3 text-sm font-bold transition ${
              activeCategoryId === 'all' ? 'bg-white text-[#1F6F8B]' : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
            }`}
          >
            {activeCategoryId === 'all' ? <span className="absolute left-0 h-7 w-1 rounded-r-full bg-[#1F6F8B]" /> : null}
            全部
          </button>
          {parentCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={activeCategoryId === category.id}
              onClick={() => setActiveCategoryId(category.id)}
              className={`relative flex min-h-14 w-full items-center justify-center px-3 text-sm font-bold transition ${
                activeCategoryId === category.id
                  ? 'bg-white text-[#1F6F8B]'
                  : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
              }`}
            >
              {activeCategoryId === category.id ? (
                <span className="absolute left-0 h-7 w-1 rounded-r-full bg-[#1F6F8B]" />
              ) : null}
              {category.name}
            </button>
          ))}
        </nav>

        <section
          data-testid="category-product-scroll"
          className="h-full overflow-y-auto min-w-0 flex-1 px-3 pb-8 pt-4"
        >
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-3">
            {sortOptions.map((label) => (
              <button
                key={label}
                type="button"
                aria-pressed={activeSort === label}
                onClick={() => setActiveSort(label)}
                className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeSort === label ? 'bg-slate-950 text-white' : 'bg-white text-slate-500 shadow-sm'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {visibleProducts.length > 0 ? (
            <div data-testid="category-product-grid" className="grid grid-cols-2 gap-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState title="暂无商品" description="当前分类暂时没有可购买商品。" />
          )}
        </section>
      </div>
    </main>
  );
}
