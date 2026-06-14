// 前台图标按钮组件。
import { Link } from 'react-router-dom';
import { ShopIcon } from './ShopIcon.jsx';

const BASE_CLASS =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-[0_14px_28px_rgba(24,36,51,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

// 渲染前台图标按钮或图标链接。
export function IconButton({ ariaLabel, icon, to, onClick, disabled = false, className = '' }) {
  const composedClassName = `${BASE_CLASS} ${className}`.trim();
  const content = <ShopIcon name={icon} />;

  if (to) {
    return (
      <Link
        to={to}
        aria-label={ariaLabel}
        aria-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        className={`${composedClassName} ${disabled ? 'pointer-events-none' : ''}`.trim()}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel} disabled={disabled} onClick={onClick} className={composedClassName}>
      {content}
    </button>
  );
}
