import { Button, Card, Descriptions, Drawer, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { OrderShipModal } from '../../components/admin/OrderShipModal.jsx';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { ORDER_STATUS, orderService } from '../../mock/mockService.js';

export function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(undefined);
  const [keyword, setKeyword] = useState('');
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [shipOrderId, setShipOrderId] = useState(null);

  async function loadOrders(nextPage = page, nextPageSize = pageSize) {
    const result = await orderService.listPagedOrders({
      page: nextPage,
      pageSize: nextPageSize,
      status,
      keyword,
    });
    if (result.success) {
      setOrders(result.data.list);
      setPage(result.data.page);
      setPageSize(result.data.pageSize);
      setTotal(result.data.total);
    }
  }

  useEffect(() => {
    loadOrders(1, pageSize);
  }, [status, keyword]);

  const detailOrder = detailOrderId ? orderService.getOrderByIdSync(detailOrderId) : null;

  async function handleShip(payload) {
    const result = await orderService.shipOrder(shipOrderId, payload);
    if (result.success) {
      setShipOrderId(null);
      await loadOrders(page, pageSize);
    }
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <Tag color={value === ORDER_STATUS.paid ? 'gold' : value === ORDER_STATUS.shipped ? 'blue' : 'default'}>{value}</Tag>,
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => `¥ ${value}`,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, order) => (
        <Space wrap>
          <Button onClick={() => setDetailOrderId(order.id)} type="link">
            查看详情
          </Button>
          {order.status === ORDER_STATUS.paid ? (
            <Button aria-label={`发货 ${order.id}`} onClick={() => setShipOrderId(order.id)} type="link">
              发货
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard
        title="订单管理"
        description="查看订单状态、核对订单详情并完成已支付订单发货。"
      />
      <Space wrap>
        <Select
          allowClear
          onChange={setStatus}
          options={[
            { label: '待支付', value: ORDER_STATUS.pendingPayment },
            { label: '已支付', value: ORDER_STATUS.paid },
            { label: '已发货', value: ORDER_STATUS.shipped },
            { label: '已完成', value: ORDER_STATUS.completed },
            { label: '已取消', value: ORDER_STATUS.canceled },
          ]}
          placeholder="订单状态"
          style={{ width: 180 }}
          value={status}
        />
        <Input
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索订单号或备注"
          style={{ width: 240 }}
          value={keyword}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{
          current: page,
          onChange: (nextPage, nextPageSize) => loadOrders(nextPage, nextPageSize),
          pageSize,
          total,
        }}
        rowKey="id"
      />
      <Drawer
        getContainer={false}
        onClose={() => setDetailOrderId(null)}
        open={Boolean(detailOrder)}
        title="订单详情"
        width={520}
      >
        {detailOrder ? (
          <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="订单号">{detailOrder.id}</Descriptions.Item>
              <Descriptions.Item label="订单状态">{detailOrder.status}</Descriptions.Item>
              <Descriptions.Item label="订单备注">{detailOrder.remark || '无备注'}</Descriptions.Item>
            </Descriptions>
            <Card size="small" title="商品清单">
              {detailOrder.items.map((item) => (
                <Space direction="vertical" key={`${item.productId}-${item.skuId}`} size={2} style={{ display: 'flex' }}>
                  <Typography.Text strong>{item.productName}</Typography.Text>
                  <Typography.Text type="secondary">{`${item.skuName} x ${item.quantity}`}</Typography.Text>
                </Space>
              ))}
            </Card>
            <Card size="small" title="物流信息">
              {detailOrder.logistics.length ? (
                detailOrder.logistics.map((item) => (
                  <Space direction="vertical" key={`${item.company}-${item.trackingNo}`} size={2} style={{ display: 'flex' }}>
                    <Typography.Text>{item.company}</Typography.Text>
                    <Typography.Text type="secondary">{item.trackingNo}</Typography.Text>
                  </Space>
                ))
              ) : (
                <Typography.Text type="secondary">暂无物流信息</Typography.Text>
              )}
            </Card>
          </Space>
        ) : null}
      </Drawer>
      <OrderShipModal
        onClose={() => setShipOrderId(null)}
        onSubmit={handleShip}
        open={Boolean(shipOrderId)}
        orderId={shipOrderId}
      />
    </Space>
  );
}
