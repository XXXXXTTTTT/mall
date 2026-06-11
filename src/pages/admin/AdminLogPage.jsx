import { Space, Table } from 'antd';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { logService } from '../../mock/mockService.js';

export function AdminLogPage() {
  const logs = logService.listLogsSync();

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard title="操作日志" description="记录本地演示数据中的后台动作，当前为只读页面。" />
      <Table
        columns={[
          { title: '操作人', dataIndex: 'actor', key: 'actor' },
          { title: '动作', dataIndex: 'action', key: 'action' },
          { title: '详情', dataIndex: 'detail', key: 'detail' },
          { title: '时间', dataIndex: 'createdAt', key: 'createdAt' },
        ]}
        dataSource={logs}
        pagination={false}
        rowKey="id"
      />
    </Space>
  );
}
