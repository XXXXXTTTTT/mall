import { useLocation, useNavigate } from 'react-router-dom';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
import { useAppContext } from '../../context/AppContext.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, state } = useAppContext();
  const redirectTo = location.state?.from || '/shop';

  async function handleLogin() {
    const result = await loginUser('member', '123456');
    if (result.success) navigate(redirectTo, { replace: true });
  }

  return (
    <>
      <ShopNavigationBar title="前台登录" />
      <main className="flex min-h-screen items-center px-5 py-8 text-slate-900">
        <section className="w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[#FBFCFA] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_18px_42px_rgba(15,23,42,0.2)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShopIcon name="user" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">MEMBER</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">前台登录</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">测试账号：member / 123456</p>
          </div>
          {state.error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}
          <button
            type="button"
            onClick={handleLogin}
            className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:bg-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2"
          >
            使用测试会员登录
          </button>
        </section>
      </main>
    </>
  );
}
