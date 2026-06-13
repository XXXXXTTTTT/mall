import { Space, Typography } from 'antd';
import { AdminSurfaceCard } from './AdminSurfaceCard.jsx';

export function PageHeaderCard({ title, description, extra }) {
  return (
    <AdminSurfaceCard
      className="overflow-hidden"
      styles={{
        body: {
          background: 'linear-gradient(135deg, #ffffff 0%, #f6fafc 100%)',
          padding: 32,
        },
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Space direction="vertical" size={6}>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide tracking-[0.28em] text-slate-400">
            ADMIN WORKSPACE
          </Typography.Text>
          <Typography.Title className="!mb-0 !text-[32px] !font-bold !tracking-tight !text-slate-900" level={2}>
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Paragraph className="!mb-0 max-w-3xl !text-sm !leading-7 !text-slate-500">
              {description}
            </Typography.Paragraph>
          ) : null}
        </Space>
        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>
    </AdminSurfaceCard>
  );
}
