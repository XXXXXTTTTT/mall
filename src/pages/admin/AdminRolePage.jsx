import { Alert, Button, Space, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import { AdminSurfaceCard } from '../../components/admin/AdminSurfaceCard.jsx';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { RolePermissionModal } from '../../components/admin/RolePermissionModal.jsx';
import { adminUserService, roleService } from '../../mock/mockService.js';
import { ADMIN_NAV_ITEMS } from './adminConfig.js';

function mapPermissionLabel(permission) {
  return ADMIN_NAV_ITEMS.find((item) => item.permission === permission)?.label || permission;
}

export function AdminRolePage() {
  const [roles, setRoles] = useState(roleService.listRolesSync());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentRole, setCurrentRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  function refreshRoles() {
    setRoles(roleService.listRolesSync());
  }

  async function handleSubmit(payload) {
    const result = modalMode === 'create'
      ? await roleService.createRole(payload)
      : await roleService.updateRole(currentRole.code, payload);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setCurrentRole(null);
    setModalOpen(false);
    setErrorMessage('');
    refreshRoles();
  }

  async function handleDelete(role) {
    const result = await roleService.deleteRole(role.code);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
    refreshRoles();
  }

  const roleUsageMap = adminUserService.listAdminsSync().reduce((summary, admin) => {
    summary[admin.roleCode] = (summary[admin.roleCode] || 0) + 1;
    return summary;
  }, {});

  return (
    <Space direction="vertical" size={20} className="!flex">
      <PageHeaderCard
        title="角色管理"
        description="通过树状权限包配置后台模块访问范围，角色与账号绑定关系刷新后会继续保留。"
        extra={(
          <Button
            type="primary"
            onClick={() => {
              setModalMode('create');
              setCurrentRole(null);
              setModalOpen(true);
            }}
          >
            新增角色
          </Button>
        )}
      />
      {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}
      <AdminSurfaceCard>
        <Table
          rowKey="code"
          pagination={false}
          dataSource={roles}
          columns={[
            {
              title: '角色名称',
              dataIndex: 'name',
              key: 'name',
              render: (value, role) => (
                <Space>
                  <Typography.Text className="!font-semibold !text-slate-900">{value}</Typography.Text>
                  {role.code === 'admin' ? <Tag color="gold">系统内置</Tag> : null}
                </Space>
              ),
            },
            { title: '角色标识', dataIndex: 'code', key: 'code' },
            {
              title: '权限模块',
              dataIndex: 'permissions',
              key: 'permissions',
              render: (permissions) => (
                <Space wrap>
                  {permissions.map((permission) => (
                    <Tag key={permission}>{mapPermissionLabel(permission)}</Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: '绑定账号数',
              key: 'usage',
              render: (_, role) => roleUsageMap[role.code] || 0,
            },
            {
              title: '操作',
              key: 'actions',
              render: (_, role) =>
                role.code === 'admin' ? (
                  <Typography.Text className="!text-sm !text-slate-400">系统保护</Typography.Text>
                ) : (
                  <Space wrap>
                    <Button
                      aria-label={`编辑角色 ${role.name}`}
                      type="link"
                      onClick={() => {
                        setModalMode('edit');
                        setCurrentRole(role);
                        setModalOpen(true);
                      }}
                    >
                      编辑角色
                    </Button>
                    <Button
                      aria-label={`删除角色 ${role.name}`}
                      type="link"
                      danger
                      onClick={() => handleDelete(role)}
                    >
                      删除角色
                    </Button>
                  </Space>
                ),
            },
          ]}
        />
      </AdminSurfaceCard>
      <RolePermissionModal
        open={modalOpen}
        mode={modalMode}
        role={currentRole}
        onClose={() => {
          setCurrentRole(null);
          setModalOpen(false);
          setModalMode('create');
        }}
        onSubmit={handleSubmit}
      />
    </Space>
  );
}
