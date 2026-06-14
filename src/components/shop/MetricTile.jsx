// 前台数据指标卡片。
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

const TILE_CLASS =
  'rounded-[1.5rem] border border-white/75 bg-white/85 p-4 text-left shadow-[0_16px_34px_rgba(24,36,51,0.08)] backdrop-blur-md';

// 渲染前台个人中心的指标入口。
export function MetricTile({ icon, label, value, onClick, to }) {
  const Component = to ? Link : onClick ? 'button' : 'div';
  const actionProps = to ? { to, 'aria-label': label } : onClick ? { type: 'button', onClick, 'aria-label': label } : {};

  return (
    <Component
      className={`${TILE_CLASS} ${
        to || onClick ? 'w-full transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500' : ''
      }`.trim()}
      {...actionProps}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <ShopIcon name={icon} />
        </span>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
    </Component>
  );
}
