import { ShopIcon } from './ShopIcon.jsx';

export function MetricTile({ icon, label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/75 bg-white/85 p-4 shadow-[0_16px_34px_rgba(24,36,51,0.08)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <ShopIcon name={icon} />
        </span>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
