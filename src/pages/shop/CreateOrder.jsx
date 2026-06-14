// 前台确认订单页。
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassBar } from '../../components/shop/GlassBar.jsx';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
import { addressService, authService, cartService, orderService, productService } from '../../mock/mockService.js';

// 渲染确认订单页并生成待支付订单。
export function CreateOrder() {
  const navigate = useNavigate();
  const user = authService.getUserSession();
  const [items] = useState(() => (user ? cartService.listCartSync(user.id).filter((item) => item.selected) : []));
  const [addresses] = useState(() => (user ? addressService.listByUserSync(user.id) : []));
  const [addressId, setAddressId] = useState(() => {
    if (!user) return '';
    const userAddresses = addressService.listByUserSync(user.id);
    return userAddresses.find((address) => address.isDefault)?.id || userAddresses[0]?.id || '';
  });
  const [remark, setRemark] = useState('');
  const [message, setMessage] = useState('');

  const enrichedItems = useMemo(
    () =>
      items.map((item) => {
        const product = productService.getProductByIdSync(item.productId);
        const sku = product?.skuOptions.find((skuItem) => skuItem.id === item.skuId) || null;
        return { ...item, product, sku };
      }),
    [items],
  );
  const totalAmount = enrichedItems.reduce((sum, item) => sum + (item.sku?.price || 0) * item.quantity, 0);

  // 校验结算信息并提交新订单。
  async function submitOrder(event) {
    event.preventDefault();
    if (items.length === 0) {
      setMessage('请选择要结算的商品');
      return;
    }
    if (!addressId) {
      setMessage('请选择收货地址后再提交订单');
      return;
    }

    const result = await orderService.createOrder({
      userId: user.id,
      items: items.map((item) => ({
        productId: item.productId,
        skuId: item.skuId,
        quantity: item.quantity,
      })),
      addressId,
      remark,
    });

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    await cartService.clearSelectedItems(user.id);
    navigate(`/shop/pay/${result.data.id}`);
  }

  return (
    <>
      <ShopNavigationBar title="确认订单" />
      <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F6] px-4 pb-32 pt-20 text-slate-900">
        <header className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Checkout</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">确认订单</h1>
        </header>

        <form onSubmit={submitOrder} className="mt-6 space-y-5">
        <IOSCard as="section" className="p-5">
          <h2 className="text-lg font-bold text-slate-950">默认地址</h2>
          {addresses.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-500">暂无收货地址</p>
          ) : (
            <div className="mt-4 space-y-3">
              {addresses.map((address) => (
                <label key={address.id} className="block rounded-3xl border border-slate-200 bg-white p-4">
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="addressId"
                      checked={addressId === address.id}
                      onChange={() => setAddressId(address.id)}
                      className="h-4 w-4 accent-teal-700"
                    />
                    <span className="font-bold text-slate-950">{address.receiver}</span>
                    <span className="text-sm text-slate-500">{address.phone}</span>
                    {address.isDefault ? <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">默认</span> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-500">
                    {address.province} {address.city} {address.detail}
                  </span>
                </label>
              ))}
            </div>
          )}
        </IOSCard>

        <IOSCard as="section" className="p-5">
          <h2 className="text-lg font-bold text-slate-950">商品清单</h2>
          {items.length === 0 ? <p className="mt-4 text-sm font-semibold text-amber-700">请选择要结算的商品</p> : null}
          <div className="mt-4 space-y-3">
            {enrichedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-3xl bg-slate-50 p-3">
                {item.product ? <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-2xl object-cover" /> : null}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-950">{item.product?.name || item.productId}</p>
                  <p className="text-sm text-slate-500">
                    {item.sku?.name || item.skuId} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-slate-950">¥{(item.sku?.price || 0) * item.quantity}</p>
              </div>
            ))}
          </div>
        </IOSCard>

        <IOSCard as="section" className="p-5">
          <h2 className="text-lg font-bold text-slate-950">金额明细</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>商品总额</span>
            <span className="text-2xl font-bold text-slate-950">¥{totalAmount}</span>
          </div>
        </IOSCard>

        <IOSCard as="label" className="block p-5">
          <span className="text-lg font-bold text-slate-950">订单备注</span>
          <textarea
            value={remark}
            onChange={(event) => setRemark(event.target.value)}
            rows={3}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            placeholder="可填写配送偏好"
          />
        </IOSCard>

        {message ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">{message}</p> : null}
        <GlassBar data-testid="create-order-submit-bar" className="fixed inset-x-4 bottom-0 z-30 mx-auto max-w-md p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">应付金额</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">¥{totalAmount}</p>
            </div>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <ShopIcon name="check" className="h-4 w-4" />
              提交订单
            </button>
          </div>
        </GlassBar>
        </form>
      </main>
    </>
  );
}
