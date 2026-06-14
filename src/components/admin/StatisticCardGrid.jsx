// 后台数据统计卡片组。
import { Statistic, Typography } from 'antd';
import { AdminSurfaceCard } from './AdminSurfaceCard.jsx';

// 渲染后台统计指标卡片组。
export function StatisticCardGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <AdminSurfaceCard
          key={item.label}
          className="h-full bg-white/95"
          styles={{ body: { padding: 24 } }}
        >
          <Statistic
            title={
              <Typography.Text className="text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                {item.label}
              </Typography.Text>
            }
            value={item.value}
            valueStyle={{ color: '#0f172a', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}
          />
        </AdminSurfaceCard>
      ))}
    </div>
  );
}
