// 前台空状态组件。
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

// 渲染前台空状态及可选操作入口。
export function EmptyState({ icon = 'bag', title, description = '', actionText = '', actionTo = '' }) {
  return (
    <section className="rounded-[2rem] border border-white/75 bg-[#fbfcfa] px-6 py-10 text-center shadow-[0_22px_58px_rgba(24,36,51,0.1)]">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-teal-100 bg-teal-50 text-teal-700"
      >
        <ShopIcon name={icon} className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      {actionText && actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(24,36,51,0.18)] transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          {actionText}
        </Link>
      ) : null}
    </section>
  );
}
