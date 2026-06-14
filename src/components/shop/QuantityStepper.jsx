// 前台数量步进器。
import { ShopIcon } from './ShopIcon.jsx';

// 渲染受控数量步进器。
export function QuantityStepper({ value, onChange, min = 1, max = 999, disabled = false }) {
  const safeValue = Math.min(max, Math.max(min, value));
  const canDecrease = !disabled && safeValue > min;
  const canIncrease = !disabled && safeValue < max;

  // 按上下限约束后提交新的数量值。
  function updateQuantity(nextValue) {
    if (disabled) {
      return;
    }

    const nextSafeValue = Math.min(max, Math.max(min, nextValue));
    if (nextSafeValue !== safeValue) {
      onChange(nextSafeValue);
    }
  }

  return (
    <div className="inline-flex items-center rounded-full border border-white/75 bg-white/85 p-1 shadow-sm backdrop-blur-md">
      <button
        type="button"
        aria-label="减少数量"
        disabled={!canDecrease}
        onClick={() => updateQuantity(safeValue - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <ShopIcon name="minus" className="h-4 w-4" />
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-semibold tabular-nums text-slate-950">{safeValue}</span>
      <button
        type="button"
        aria-label="增加数量"
        disabled={!canIncrease}
        onClick={() => updateQuantity(safeValue + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <ShopIcon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}
