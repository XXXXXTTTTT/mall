// 前台固定顶部导航。
import { useNavigate } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

// 渲染前台固定顶部导航栏。
export function ShopNavigationBar({ title, onBack }) {
  const navigate = useNavigate();
  // 优先使用外部返回逻辑，否则返回上一页。
  const handleBack = onBack || (() => navigate(-1));

  return (
    <header
      data-testid="shop-navigation-bar"
      className="fixed inset-x-0 top-0 z-50 mx-auto flex min-h-16 w-full max-w-md items-center justify-center border-b border-neutral-100/60 bg-white/85 px-4 text-slate-950 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="返回"
        data-testid="shop-back-button"
        onClick={handleBack}
        className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <ShopIcon name="chevronLeft" className="h-6 w-6" />
      </button>
      <p className="max-w-[14rem] truncate text-base font-bold tracking-wide text-slate-950">{title}</p>
    </header>
  );
}
