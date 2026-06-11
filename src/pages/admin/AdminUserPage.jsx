import { Space, Table } from 'antd';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { userService } from '../../mock/mockService.js';

export function AdminUserPage() {
  const users = userService.listUsersSync();

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard title="用户管理" description="用户数据当前为只读展示，便于验证订单与地址来源。" />
      <Table
        columns={[
          { title: '用户名称', dataIndex: 'name', key: 'name' },
          { title: '登录账号', dataIndex: 'username', key: 'username' },
          { title: '手机号', dataIndex: 'phone', key: 'phone' },
        ]}
        dataSource={users}
        pagination={false}
        rowKey="id"
      />
    </Space>
  );
}
