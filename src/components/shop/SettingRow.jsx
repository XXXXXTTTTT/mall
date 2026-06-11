import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

const TONE_STYLES = {
  default: 'bg-slate-100 text-slate-700',
  teal: 'bg-teal-50 text-teal-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
};

export function SettingRow({ icon, title, description = '', to, onClick, tone = 'default' }) {
  const Component = to ? Link : onClick ? 'button' : 'div';
  const actionProps = to ? { to } : onClick ? { type: 'button', onClick } : {};

  return (
    <Component
      className="flex w-full items-center gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white px-4 py-3 text-left shadow-sm transition hover:border-teal-200 hover:bg-teal-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      {...actionProps}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          TONE_STYLES[tone] || TONE_STYLES.default
        }`}
      >
        <ShopIcon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-950">{title}</span>
        {description ? <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span> : null}
      </span>
      <ShopIcon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-400" />
    </Component>
  );
}
