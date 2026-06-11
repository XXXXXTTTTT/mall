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
  online: 'border-teal-200 bg-teal-50 text-teal-700',
  offline: 'border-slate-200 bg-slate-100 text-slate-500',
  pending_payment: 'border-amber-200 bg-amber-50 text-amber-700',
  paid: 'border-teal-200 bg-teal-50 text-teal-700',
  shipped: 'border-sky-200 bg-sky-50 text-sky-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  canceled: 'border-slate-200 bg-slate-100 text-slate-500',
};

export function StatusTag({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${
        STATUS_STYLES[status] || STATUS_STYLES.offline
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
