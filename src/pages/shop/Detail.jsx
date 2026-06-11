import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '../../components/shop/EmptyState.jsx';
import { GlassBar } from '../../components/shop/GlassBar.jsx';
import { IconButton } from '../../components/shop/IconButton.jsx';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { QuantityStepper } from '../../components/shop/QuantityStepper.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { StatusTag } from '../../components/shop/StatusTag.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { authService, favoriteService, productService } from '../../mock/mockService.js';

export function Detail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = productService.getProductByIdSync(productId);
  const { state, loginUser, addToCart, toggleFavorite } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sessionUser = state.user || authService.getUserSession();
  const isFavorite =
    Boolean(sessionUser && product) &&
    favoriteService.listFavoritesSync(sessionUser.id).some((favorite) => favorite.productId === product.id);

  if (!product) {
    return (
      <main className="px-5 pb-8 pt-6">
        <EmptyState title="商品不存在" description="该商品不存在或已被移除。" actionText="返回首页" actionTo="/shop" />
      </main>
    );
  }

  const isOnline = product.status === 'online';
  const selectedSku = product.skuOptions?.[0] || null;
  const unavailableMessage = !selectedSku ? '商品规格不存在' : selectedSku.stock < 1 ? '库存不足' : '';
  const canPurchase = isOnline && !unavailableMessage;

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
    if (!canPurchase || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');
    const userId = await resolveUserId();
    if (!userId) {
      setIsSubmitting(false);
      return;
    }

    const result = await addToCart({
      productId: product.id,
      skuId: selectedSku.id,
      quantity,
    });
    setMessage(result.success ? '已加入购物车' : result.message);
    setIsSubmitting(false);
  }

  async function handleToggleFavorite() {
    if (!(await resolveUserId())) return;

    const result = await toggleFavorite(product.id);
    if (result.success) {
      setMessage(result.data.isFavorite ? '已收藏' : '已取消收藏');
    } else {
      setMessage(result.message);
    }
  }

  return (
    <main className="space-y-6 px-5 pb-44 pt-6">
      <IOSCard as="section" className="overflow-hidden">
        <div className="relative min-h-[420px] overflow-hidden bg-slate-100">
          <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/72" />
          <div className="absolute left-4 top-4">
            <StatusTag status={product.status} />
          </div>
          <div className="absolute right-4 top-4">
            <IconButton
              ariaLabel={isFavorite ? '取消收藏商品' : '收藏商品'}
              icon={isFavorite ? 'heartFilled' : 'heart'}
              onClick={handleToggleFavorite}
            />
          </div>
          {!isOnline ? (
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/88 px-4 py-3 text-center text-sm font-semibold text-white">
              商品已下架
            </div>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1 text-sm font-semibold backdrop-blur-md">
              <ShopIcon name="spark" className="h-4 w-4" />
              ¥{product.price}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">{product.name}</h1>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-[1.75rem] bg-slate-50/80 p-4">
            <p className="text-sm leading-6 text-slate-500">{product.description}</p>
          </div>

          <IOSCard className="space-y-4 bg-white/80 p-4 shadow-[0_16px_38px_rgba(24,36,51,0.08)]">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-400">规格</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{selectedSku?.name || '暂无规格'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-400">库存</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{selectedSku?.stock ?? 0}</p>
              </div>
            </div>
            {unavailableMessage ? (
              <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                {unavailableMessage}
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">数量</span>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={selectedSku?.stock || 1}
                disabled={!canPurchase}
              />
            </div>
          </IOSCard>

          {message ? (
            <p className="rounded-2xl bg-[#E7F3F4] px-4 py-3 text-center text-sm font-semibold text-[#1F6F8B]">
              {message}
            </p>
          ) : null}
        </div>
      </IOSCard>

      <GlassBar
        className="fixed inset-x-0 bottom-24 z-20 mx-auto grid max-w-md grid-cols-[auto_1fr_1fr] gap-3 px-5 py-4"
        data-testid="detail-purchase-bar"
      >
        <IconButton
          ariaLabel={isFavorite ? '取消收藏' : '收藏'}
          icon={isFavorite ? 'heartFilled' : 'heart'}
          onClick={handleToggleFavorite}
        />
        <button
          type="button"
          disabled={!canPurchase || isSubmitting}
          onClick={handleAddToCart}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1F6F8B] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(31,111,139,0.28)] transition hover:bg-[#185C74] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <ShopIcon name="bag" className="h-4 w-4" />
          加入购物车
        </button>
        <button
          type="button"
          disabled={!canPurchase}
          onClick={() => navigate('/shop/create-order')}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-center text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <ShopIcon name="check" className="h-4 w-4" />
          立即购买
        </button>
      </GlassBar>
    </main>
  );
}
