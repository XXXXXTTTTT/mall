import { Card, Space, Typography } from 'antd';

export function PageHeaderCard({ title, description, extra }) {
  return (
    <Card
      style={{
        borderColor: '#d8e2e1',
        borderRadius: 18,
        boxShadow: '0 18px 45px rgba(23, 52, 57, 0.08)',
      }}
      styles={{
        body: {
          alignItems: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #f5faf9 100%)',
          borderRadius: 18,
          display: 'flex',
          gap: 24,
          justifyContent: 'space-between',
          padding: 24,
        },
      }}
    >
      <Space direction="vertical" size={6}>
        <Typography.Title level={3} style={{ color: '#173439', margin: 0 }}>
          {title}
        </Typography.Title>
        {description ? (
          <Typography.Text style={{ color: '#647275', fontSize: 14 }}>
            {description}
          </Typography.Text>
        ) : null}
      </Space>
      {extra ? <div>{extra}</div> : null}
    </Card>
  );
}
