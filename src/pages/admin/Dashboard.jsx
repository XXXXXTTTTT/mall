import { Card, List, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { StatisticCardGrid } from '../../components/admin/StatisticCardGrid.jsx';
import { dashboardService } from '../../mock/mockService.js';

export function Dashboard() {
  const [summary, setSummary] = useState({
    productTotal: 0,
    onlineProductTotal: 0,
    orderTotal: 0,
    paidOrderTotal: 0,
    pendingShipmentTotal: 0,
    recentOrders: [],
  });

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      const result = await dashboardService.getSummary();
      if (active && result.success) {
        setSummary(result.data);
      }
    }

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard
        title="数据看板"
        description="统一查看商品、订单与待发货情况，便于后台运营日常巡检。"
      />
      <StatisticCardGrid
        items={[
          { label: '商品总数', value: summary.productTotal },
          { label: '上架商品', value: summary.onlineProductTotal },
          { label: '订单总数', value: summary.orderTotal },
          { label: '已支付订单', value: summary.paidOrderTotal },
          { label: '待发货订单', value: summary.pendingShipmentTotal },
        ]}
      />
      <Card style={{ borderRadius: 18 }}>
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            最近订单
          </Typography.Title>
          <List
            dataSource={summary.recentOrders}
            locale={{ emptyText: '暂无订单' }}
            renderItem={(order) => (
              <List.Item>
                <Space direction="vertical" size={4}>
                  <Typography.Text strong>{order.id}</Typography.Text>
                  <Typography.Text type="secondary">{order.remark || '无备注'}</Typography.Text>
                </Space>
                <Space>
                  <Tag color="blue">{order.status}</Tag>
                  <Typography.Text>{`¥ ${order.totalAmount}`}</Typography.Text>
                </Space>
              </List.Item>
            )}
          />
        </Space>
      </Card>
    </Space>
  );
}
