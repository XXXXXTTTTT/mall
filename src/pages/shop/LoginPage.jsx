import { useLocation, useNavigate } from 'react-router-dom';
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
    <main className="flex min-h-screen items-center px-5 py-8 text-slate-900">
      <section className="w-full rounded-[2rem] border border-slate-200/80 bg-[#FBFCFA] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F6F8B]">MEMBER</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">前台登录</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">测试账号：member / 123456</p>
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
  );
}
