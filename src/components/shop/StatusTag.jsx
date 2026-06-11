import { ShopIcon } from './ShopIcon.jsx';

const STATUS_LABELS = {
  online: '上架',
  offline: '下架',
  pending_payment: '待支付',
  paid: '已支付',
  shipped: '已发货',
  completed: '已完成',
  canceled: '已取消',
};

const STATUS_STYLES = {
  online: 'border-teal-200/70 bg-teal-50/80 text-teal-700',
  offline: 'border-slate-200 bg-slate-100/80 text-slate-500',
  pending_payment: 'border-amber-200/70 bg-amber-50/80 text-amber-700',
  paid: 'border-teal-200/70 bg-teal-50/80 text-teal-700',
  shipped: 'border-sky-200/70 bg-sky-50/80 text-sky-700',
  completed: 'border-emerald-200/70 bg-emerald-50/80 text-emerald-700',
  canceled: 'border-slate-200 bg-slate-100/80 text-slate-500',
};

const STATUS_ICONS = {
  online: 'check',
  offline: 'alert',
  pending_payment: 'clock',
  paid: 'check',
  shipped: 'truck',
  completed: 'check',
  canceled: 'alert',
};

export function StatusTag({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
        STATUS_STYLES[status] || STATUS_STYLES.offline
      }`}
    >
      <ShopIcon name={STATUS_ICONS[status] || 'alert'} className="h-3.5 w-3.5" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
