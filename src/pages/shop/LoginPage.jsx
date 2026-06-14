import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
import { useAppContext } from '../../contexts/AppContext.jsx';

const EMPTY_FORM = {
  username: '',
  password: '',
  name: '',
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, registerUser, state } = useAppContext();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');
  const redirectTo = location.state?.from || '/shop';
  const isRegisterMode = mode === 'register';

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (message) setMessage('');
  }

  function toggleMode() {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setMessage('');
  }

  async function handleQuickLogin() {
    const result = await loginUser('member', '123456');
    if (result.success) navigate(redirectTo, { replace: true });
    else setMessage(result.message || '登录失败');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = isRegisterMode
      ? await registerUser({
          username: form.username,
          password: form.password,
          name: form.name,
        })
      : await loginUser(form.username, form.password);

    if (result.success) {
      navigate(redirectTo, { replace: true });
      return;
    }

    setMessage(result.message || (isRegisterMode ? '注册失败' : '登录失败'));
  }

  return (
    <>
      <ShopNavigationBar title="前台登录" />
      <main className="mx-auto flex min-h-screen max-w-md items-center bg-[#F5F7F6] px-5 pb-8 pt-24 text-slate-900">
        <section className="w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[#FBFCFA] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_18px_42px_rgba(15,23,42,0.2)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShopIcon name="user" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">MEMBER</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">{isRegisterMode ? '注册账号' : '前台登录'}</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {isRegisterMode ? '创建会员账号后，将直接进入前台会员中心。' : '测试账号：member / 123456'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              用户名
              <input
                value={form.username}
                onChange={(event) => updateForm('username', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                autoComplete="username"
              />
            </label>

            <label className="block text-sm font-bold text-slate-700">
              密码
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateForm('password', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              />
            </label>

            {isRegisterMode ? (
              <label className="block text-sm font-bold text-slate-700">
                昵称
                <input
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  autoComplete="name"
                />
              </label>
            ) : null}

            {message ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600" role="alert">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={state.loading}
              className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:bg-[#1F6F8B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F8B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isRegisterMode ? '注册' : '登录'}
            </button>
          </form>

          {!isRegisterMode ? (
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={state.loading}
              className="mt-3 w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              使用测试会员登录
            </button>
          ) : null}

          <button
            type="button"
            onClick={toggleMode}
            className="mt-4 w-full rounded-full px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            {isRegisterMode ? '去登录' : '去注册'}
          </button>
        </section>
      </main>
    </>
  );
}
