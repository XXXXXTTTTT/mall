import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { GlassBar } from '../../components/shop/GlassBar.jsx';
import { IconButton } from '../../components/shop/IconButton.jsx';
import { QuantityStepper } from '../../components/shop/QuantityStepper.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { authService, cartService, productService } from '../../mock/mockService.js';

export function Cart() {
  const user = authService.getUserSession();
  const [items, setItems] = useState(() => (user ? cartService.listCartSync(user.id) : []));
  const [summary, setSummary] = useState(() =>
    user ? cartService.calculateSelectedTotal(user.id) : { totalQuantity: 0, totalAmount: 0 },
  );

  function refreshCart() {
    if (!user) return;
    setItems(cartService.listCartSync(user.id));
    setSummary(cartService.calculateSelectedTotal(user.id));
  }

  const enrichedItems = useMemo(
    () =>
      items.map((item) => {
        const product = productService.getProductByIdSync(item.productId);
        const sku = product?.skuOptions.find((skuItem) => skuItem.id === item.skuId) || null;
        return { ...item, product, sku };
      }),
    [items],
  );
  const allSelected = items.length > 0 && items.every((item) => item.selected);

  async function updateQuantity(cartItemId, quantity) {
    await cartService.updateItemQuantity(cartItemId, quantity);
    refreshCart();
  }

  async function toggleSelected(cartItemId, selected) {
    await cartService.toggleItemSelected(cartItemId, selected);
    refreshCart();
  }

  async function toggleAll(selected) {
    if (!user) return;
    await cartService.toggleAllSelected(user.id, selected);
    refreshCart();
  }

  async function removeItem(cartItemId) {
    await cartService.removeItem(cartItemId);
    refreshCart();
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F6] px-4 pb-32 pt-36 text-slate-900">
      <header className="fixed inset-x-4 top-3 z-50 mx-auto max-w-md rounded-[2rem] border border-white/75 bg-[#fbfcfa]/90 p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)] backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Cart</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">购物车</h1>
          <p className="pb-1 text-sm font-semibold text-slate-500">已选 {summary.totalQuantity} 件</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon="bag" title="购物车还是空的" description="先挑选一件心仪商品，再回来结算。" actionText="返回首页" actionTo="/shop" />
        </div>
      ) : (
        <section className="mt-6 space-y-4">
          <button
            type="button"
            aria-pressed={allSelected}
            onClick={() => toggleAll(!allSelected)}
            className="flex min-h-14 w-full items-center gap-3 rounded-3xl border border-white/75 bg-[#fbfcfa] px-4 py-2 text-left text-sm font-semibold shadow-sm transition hover:border-teal-100 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <span
              aria-hidden="true"
              className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                allSelected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-400'
              }`}
            >
              <ShopIcon name="check" className="h-4 w-4" />
            </span>
            全选
          </button>

          {enrichedItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-4 shadow-[0_18px_48px_rgba(24,36,51,0.08)]"
            >
              <div className="flex gap-4">
                <button
                  type="button"
                  aria-label={`选择 ${item.product?.name || item.productId} ${item.sku?.name || item.skuId}`}
                  aria-pressed={item.selected}
                  onClick={() => toggleSelected(item.id, !item.selected)}
                  className={`mt-7 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    item.selected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <ShopIcon name="check" className="h-4 w-4" />
                </button>
                {item.product ? (
                  <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-3xl object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold leading-6 text-slate-950">{item.product?.name || item.productId}</h2>
                  <p className="mt-1 text-sm text-slate-500">{item.sku?.name || item.skuId}</p>
                  <p className="mt-3 text-lg font-bold text-slate-950">¥{item.sku?.price || 0}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <QuantityStepper value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
                <IconButton
                  ariaLabel={`删除 ${item.product?.name || item.productId} ${item.sku?.name || item.skuId}`}
                  icon="trash"
                  onClick={() => removeItem(item.id)}
                />
              </div>
            </article>
          ))}

          <GlassBar data-testid="cart-checkout-bar" className="fixed inset-x-4 bottom-24 z-30 mx-auto max-w-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">已选 {summary.totalQuantity} 件</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">¥{summary.totalAmount}</p>
              </div>
              <Link
                to="/shop/create-order"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                去结算
              </Link>
            </div>
          </GlassBar>
        </section>
      )}
    </main>
  );
}
