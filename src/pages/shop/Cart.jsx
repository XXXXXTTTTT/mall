import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { QuantityStepper } from '../../components/shop/QuantityStepper.jsx';
import { authService, cartService, productService } from '../../mock/mockService.js';

export function Cart() {
  const user = authService.getUserSession();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalQuantity: 0, totalAmount: 0 });

  function refreshCart() {
    if (!user) return;
    setItems(cartService.listCartSync(user.id));
    setSummary(cartService.calculateSelectedTotal(user.id));
  }

  useEffect(() => {
    refreshCart();
  }, []);

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
    <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 py-6 text-slate-900">
      <header className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Cart</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">购物车</h1>
      </header>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="购物车还是空的" description="先挑选一件心仪商品，再回来结算。" actionText="返回首页" actionTo="/shop" />
        </div>
      ) : (
        <section className="mt-6 space-y-4">
          <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-[#fbfcfa] px-5 py-4 text-sm font-semibold shadow-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(event) => toggleAll(event.target.checked)}
              className="h-4 w-4 accent-teal-700"
            />
            全选
          </label>

          {enrichedItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] p-4 shadow-[0_18px_48px_rgba(24,36,51,0.08)]"
            >
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={(event) => toggleSelected(item.id, event.target.checked)}
                  className="mt-8 h-4 w-4 accent-teal-700"
                  aria-label={`选择 ${item.product?.name || item.productId}`}
                />
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
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  删除
                </button>
              </div>
            </article>
          ))}

          <div className="sticky bottom-4 rounded-[2rem] border border-slate-200 bg-[#fbfcfa] p-4 shadow-[0_18px_48px_rgba(24,36,51,0.14)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">已选 {summary.totalQuantity} 件</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">¥{summary.totalAmount}</p>
              </div>
              <Link
                to="/shop/create-order"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                去结算
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
