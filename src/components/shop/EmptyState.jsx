import { Link } from 'react-router-dom';

export function EmptyState({ title, description = '', actionText = '', actionTo = '' }) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-[#fbfcfa] px-6 py-10 text-center shadow-[0_18px_48px_rgba(24,36,51,0.08)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-teal-100 bg-teal-50 text-2xl text-teal-700">
        ·
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
