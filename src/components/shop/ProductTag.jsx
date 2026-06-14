// 前台商品标签。
import { ShopIcon } from './ShopIcon.jsx';

const TAG_STYLES = {
  热门: { icon: 'flame', className: 'border-orange-200/70 bg-orange-50 text-orange-700' },
  新品: { icon: 'spark', className: 'border-sky-200/70 bg-sky-50 text-sky-700' },
  限时特惠: { icon: 'clock', className: 'border-amber-200/70 bg-amber-50 text-amber-700' },
  精选: { icon: 'star', className: 'border-teal-200/70 bg-teal-50 text-teal-700' },
};

// 按标签类型渲染商品标签样式。
export function ProductTag({ tag }) {
  const tagStyle = TAG_STYLES[tag] || { icon: 'spark', className: 'border-slate-200 bg-slate-50 text-slate-600' };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tagStyle.className}`}>
      <ShopIcon name={tagStyle.icon} className="h-3.5 w-3.5" />
      {tag}
    </span>
  );
}
