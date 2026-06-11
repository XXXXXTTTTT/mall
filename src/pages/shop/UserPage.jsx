import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../mock/mockService.js';

export function UserPage() {
  const navigate = useNavigate();
  const user = authService.getUserSession();

  function logout() {
    authService.logoutUser();
    navigate('/shop/login');
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 py-6 text-slate-900">
      <section className="rounded-[2rem] bg-[#fbfcfa] p-6 shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Member</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{user?.name || '未登录'}</h1>
        <p className="mt-2 text-sm text-slate-500">{user?.username || ''}</p>
      </section>

      <nav className="mt-6 grid gap-3">
        <Link
          to="/shop/orders"
          className="rounded-[1.5rem] border border-slate-200 bg-[#fbfcfa] px-5 py-4 text-base font-bold text-slate-950 shadow-sm transition hover:border-teal-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          我的订单
        </Link>
        <Link
          to="/shop/favorites"
          className="rounded-[1.5rem] border border-slate-200 bg-[#fbfcfa] px-5 py-4 text-base font-bold text-slate-950 shadow-sm transition hover:border-teal-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          我的收藏
        </Link>
        <Link
          to="/shop/address"
          className="rounded-[1.5rem] border border-slate-200 bg-[#fbfcfa] px-5 py-4 text-base font-bold text-slate-950 shadow-sm transition hover:border-teal-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          地址管理
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-left text-base font-bold text-slate-500 shadow-sm transition hover:border-red-200 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          退出登录
        </button>
      </nav>
    </main>
  );
}
