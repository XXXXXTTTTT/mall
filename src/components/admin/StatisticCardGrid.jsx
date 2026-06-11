import { Card, Statistic } from 'antd';

export function StatisticCardGrid({ items }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}
    >
      {items.map((item) => (
        <Card
          key={item.label}
          style={{
            background: '#ffffff',
            borderColor: '#d8e2e1',
            borderRadius: 18,
            boxShadow: '0 14px 34px rgba(23, 52, 57, 0.07)',
          }}
        >
          <Statistic
            title={<span style={{ color: '#647275' }}>{item.label}</span>}
            value={item.value}
            valueStyle={{ color: '#173439', fontWeight: 700 }}
          />
        </Card>
      ))}
    </div>
  );
}
