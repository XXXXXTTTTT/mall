// 前台分区标题。
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

// 渲染前台分区标题和右侧跳转入口。
export function SectionHeader({ eyebrow, title, actionText, actionTo }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
      </div>
      {actionText && actionTo ? (
        <Link
          to={actionTo}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-500/40 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
        >
          {actionText}
          <ShopIcon name="chevronRight" className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
