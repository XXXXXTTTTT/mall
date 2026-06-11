import { Space, Table, Tag } from 'antd';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { roleService } from '../../mock/mockService.js';

export function AdminRolePage() {
  const roles = roleService.listRolesSync();

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard title="权限角色" description="角色配置当前为只读展示，供后台权限联调使用。" />
      <Table
        columns={[
          { title: '角色名称', dataIndex: 'name', key: 'name' },
          { title: '角色标识', dataIndex: 'code', key: 'code' },
          {
            title: '权限集合',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions) => (
              <Space wrap>
                {permissions.map((permission) => (
                  <Tag key={permission}>{permission}</Tag>
                ))}
              </Space>
            ),
          },
        ]}
        dataSource={roles}
        pagination={false}
        rowKey="code"
      />
    </Space>
  );
}
