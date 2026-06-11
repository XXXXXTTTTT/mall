import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { QuantityStepper } from '../../components/shop/QuantityStepper.jsx';
import { StatusTag } from '../../components/shop/StatusTag.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { cartService, favoriteService, productService } from '../../mock/mockService.js';

export function Detail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = productService.getProductByIdSync(productId);
  const { state, loginUser } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return (
      <main className="px-5 pb-8 pt-6">
        <EmptyState title="商品不存在" description="该商品不存在或已被移除。" actionText="返回首页" actionTo="/shop" />
      </main>
    );
  }

  const isOnline = product.status === 'online';
  const selectedSku = product.skuOptions[0];

  async function resolveUserId() {
    if (state.user) return state.user.id;

    const loginResult = await loginUser('member', '123456');
    if (!loginResult?.success) {
      setMessage(loginResult?.message || '登录失败');
      return '';
    }
    return loginResult.data.id;
  }

  async function handleAddToCart() {
    if (!isOnline || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');
    const userId = await resolveUserId();
    if (!userId) {
      setIsSubmitting(false);
      return;
    }

    const result = await cartService.addItem({
      userId,
      productId: product.id,
      skuId: selectedSku.id,
      quantity,
    });
    setMessage(result.success ? '已加入购物车' : result.message);
    setIsSubmitting(false);
  }

  async function handleToggleFavorite() {
    const userId = await resolveUserId();
    if (!userId) return;

    const result = await favoriteService.toggleFavorite(userId, product.id);
    if (result.success) {
      setIsFavorite(result.data.isFavorite);
    } else {
      setMessage(result.message);
    }
  }

  return (
    <main className="space-y-6 px-5 pb-8 pt-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[#FBFCFA] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="relative aspect-[4/3] bg-slate-100">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <div className="absolute left-4 top-4">
            <StatusTag status={product.status} />
          </div>
          {!isOnline ? (
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/88 px-4 py-3 text-center text-sm font-semibold text-white">
              商品已下架
            </div>
          ) : null}
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="text-sm font-semibold text-[#1F6F8B]">¥{product.price}</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-950">{product.name}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{product.description}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">规格</p>
            <p className="mt-1 text-sm text-slate-500">{selectedSku.name}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">数量</span>
              <QuantityStepper value={quantity} onChange={setQuantity} max={selectedSku.stock} disabled={!isOnline} />
            </div>
          </div>

          {message ? (
            <p className="rounded-2xl bg-[#E7F3F4] px-4 py-3 text-center text-sm font-semibold text-[#1F6F8B]">
              {message}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-[0.8fr_1fr_1fr] gap-3">
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#1F6F8B]/30 hover:text-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B]"
        >
          {isFavorite ? '取消收藏' : '收藏'}
        </button>
        <button
          type="button"
          disabled={!isOnline || isSubmitting}
          onClick={handleAddToCart}
          className="rounded-full bg-[#1F6F8B] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(31,111,139,0.28)] transition hover:bg-[#185C74] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          加入购物车
        </button>
        <button
          type="button"
          disabled={!isOnline}
          onClick={() => navigate('/shop/create-order')}
          className="rounded-full bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          立即购买
        </button>
      </section>
    </main>
  );
}
