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
    <main className="mx-auto max-w-md p-6 text-slate-900">
      <h1 className="text-2xl font-bold">前台登录</h1>
      {state.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      <button type="button" onClick={handleLogin} className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-white">
        使用测试会员登录
      </button>
    </main>
  );
}
