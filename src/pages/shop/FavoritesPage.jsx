import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { authService, favoriteService, productService } from '../../mock/mockService.js';

export function FavoritesPage() {
  const user = authService.getUserSession();
  const [favorites, setFavorites] = useState(() => (user ? favoriteService.listFavoritesSync(user.id) : []));

  function refreshFavorites() {
    if (!user) return;
    setFavorites(favoriteService.listFavoritesSync(user.id));
  }

  const products = useMemo(
    () =>
      favorites
        .map((favorite) => productService.getProductByIdSync(favorite.productId))
        .filter((product) => product !== null),
    [favorites],
  );

  async function cancelFavorite(productId) {
    await favoriteService.toggleFavorite(user.id, productId);
    refreshFavorites();
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 py-6 text-slate-900">
      <header className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Favorites</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">我的收藏</h1>
      </header>

      {products.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="还没有收藏商品" description="收藏喜欢的商品后，会在这里集中展示。" actionText="继续逛逛" actionTo="/shop" />
        </div>
      ) : (
        <section className="mt-6 space-y-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-4 shadow-[0_18px_48px_rgba(24,36,51,0.08)]"
            >
              <div className="flex gap-4">
                <img src={product.image} alt={product.name} className="h-24 w-24 rounded-3xl object-cover" />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/shop/detail/${product.id}`}
                    className="text-base font-bold leading-6 text-slate-950 transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-3 text-lg font-bold text-slate-950">¥{product.price}</p>
                  <button
                    type="button"
                    onClick={() => cancelFavorite(product.id)}
                    className="mt-3 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    取消收藏
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
