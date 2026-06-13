import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { IconButton } from '../../components/shop/IconButton.jsx';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
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
    <>
      <ShopNavigationBar title="我的收藏" />
      <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
        <IOSCard as="header" className="p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-rose-50 text-rose-700">
              <ShopIcon name="heartFilled" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Favorites</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">我的收藏</h1>
            </div>
          </div>
        </IOSCard>

        {products.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="还没有收藏商品" description="收藏喜欢的商品后，会在这里集中展示。" actionText="继续逛逛" actionTo="/shop" />
          </div>
        ) : (
          <section className="mt-6 space-y-4">
            {products.map((product) => (
              <IOSCard
                as="article"
                key={product.id}
                className="p-4"
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
                  <div className="mt-3">
                    <IconButton ariaLabel={`取消收藏 ${product.name}`} icon="heartFilled" onClick={() => cancelFavorite(product.id)} />
                  </div>
                </div>
              </div>
              </IOSCard>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
