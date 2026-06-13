import { Alert, Avatar, Button, Input, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { AdminSurfaceCard } from '../../components/admin/AdminSurfaceCard.jsx';
import { AdminUserFormModal } from '../../components/admin/AdminUserFormModal.jsx';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { adminUserService, roleService } from '../../mock/mockService.js';

function formatDateTime(value) {
  return value ? value.replace('T', ' ').slice(0, 16) : '-';
}

export function AdminUserPage() {
  const [admins, setAdmins] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [roleCode, setRoleCode] = useState(undefined);
  const [isEnabled, setIsEnabled] = useState(undefined);
  const [modalMode, setModalMode] = useState('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const roles = roleService.listRolesSync();

  useEffect(() => {
    let active = true;

    async function loadAdmins() {
      const result = await adminUserService.listPagedAdmins({
        page: 1,
        pageSize: 20,
        keyword,
        roleCode,
        isEnabled,
      });
      if (!active) {
        return;
      }
      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      setErrorMessage('');
      setAdmins(result.data.list);
    }

    void loadAdmins();

    return () => {
      active = false;
    };
  }, [isEnabled, keyword, roleCode]);

  async function loadAdmins() {
    const result = await adminUserService.listPagedAdmins({
      page: 1,
      pageSize: 20,
      keyword,
      roleCode,
      isEnabled,
    });
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
    setAdmins(result.data.list);
  }

  const roleOptions = useMemo(() => {
    return roles.map((role) => ({
      label: role.name,
      value: role.code,
    }));
  }, [roles]);

  const roleMap = useMemo(() => {
    return roles.reduce((summary, role) => {
      summary[role.code] = role.name;
      return summary;
    }, {});
  }, [roles]);

  async function handleSubmit(payload) {
    const result = modalMode === 'create'
      ? await adminUserService.createAdmin(payload)
      : await adminUserService.updateAdmin(currentAdmin.id, payload);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
    setModalOpen(false);
    setCurrentAdmin(null);
    await loadAdmins();
  }

  async function handleToggle(admin, checked) {
    const result = await adminUserService.toggleAdminStatus(admin.id, checked);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
    await loadAdmins();
  }

  async function handleResetPassword(admin) {
    const result = await adminUserService.resetAdminPassword(admin.id);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
    await loadAdmins();
  }

  async function handleDelete(admin) {
    const result = await adminUserService.deleteAdmin(admin.id);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
    await loadAdmins();
  }

  return (
    <Space direction="vertical" size={20} className="!flex">
      <PageHeaderCard
        title="后台账号管理"
        description="创建后台员工账号并分发角色权限包，禁用状态、重置密码和角色调整都会立即写入本地缓存。"
        extra={(
          <Button
            type="primary"
            onClick={() => {
              setModalMode('create');
              setCurrentAdmin(null);
              setModalOpen(true);
            }}
          >
            新增账号
          </Button>
        )}
      />
      {errorMessage ? <Alert message={errorMessage} showIcon type="error" /> : null}
      <AdminSurfaceCard>
        <Space direction="vertical" size={16} className="!flex">
          <Space wrap>
            <Input
              placeholder="搜索用户名或显示名称"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              style={{ width: 260 }}
            />
            <Select
              allowClear
              aria-label="角色筛选"
              placeholder="筛选角色"
              options={roleOptions}
              style={{ width: 180 }}
              value={roleCode}
              onChange={setRoleCode}
            />
            <Select
              allowClear
              aria-label="状态筛选"
              placeholder="筛选状态"
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
              style={{ width: 160 }}
              value={isEnabled}
              onChange={setIsEnabled}
            />
          </Space>
          <Table
            rowKey="id"
            pagination={false}
            dataSource={admins}
            columns={[
              {
                title: '账号信息',
                key: 'profile',
                render: (_, admin) => (
                  <Space>
                    <Avatar className="!bg-slate-900">{admin.username.slice(0, 1).toUpperCase()}</Avatar>
                    <div>
                      <Typography.Text className="block !font-semibold !text-slate-900">
                        {admin.name}
                      </Typography.Text>
                      <Typography.Text className="!text-xs !text-slate-500">
                        {admin.id}
                      </Typography.Text>
                    </div>
                  </Space>
                ),
              },
              { title: '用户名', dataIndex: 'username', key: 'username' },
              {
                title: '角色',
                dataIndex: 'roleCode',
                key: 'roleCode',
                render: (value) => <Tag color={value === 'admin' ? 'gold' : 'blue'}>{roleMap[value] || value}</Tag>,
              },
              {
                title: '状态',
                key: 'status',
                render: (_, admin) => (
                  <Switch
                    aria-label={`切换账号状态 ${admin.username}`}
                    checked={admin.isEnabled}
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                    disabled={admin.username === 'admin'}
                    onChange={(checked) => handleToggle(admin, checked)}
                  />
                ),
              },
              {
                title: '创建时间',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (value) => formatDateTime(value),
              },
              {
                title: '操作',
                key: 'actions',
                render: (_, admin) =>
                  admin.username === 'admin' ? (
                    <Typography.Text className="!text-sm !text-slate-400">系统保护</Typography.Text>
                  ) : (
                    <Space wrap>
                      <Button
                        aria-label={`编辑账号 ${admin.username}`}
                        type="link"
                        onClick={() => {
                          setModalMode('edit');
                          setCurrentAdmin(admin);
                          setModalOpen(true);
                        }}
                      >
                        编辑账号
                      </Button>
                      <Button
                        aria-label={`重置密码 ${admin.username}`}
                        type="link"
                        onClick={() => handleResetPassword(admin)}
                      >
                        重置密码
                      </Button>
                      <Button
                        aria-label={`删除账号 ${admin.username}`}
                        type="link"
                        danger
                        onClick={() => handleDelete(admin)}
                      >
                        删除账号
                      </Button>
                    </Space>
                  ),
              },
            ]}
          />
        </Space>
      </AdminSurfaceCard>
      <AdminUserFormModal
        open={modalOpen}
        mode={modalMode}
        admin={currentAdmin}
        roles={roleOptions}
        onClose={() => {
          setModalOpen(false);
          setCurrentAdmin(null);
        }}
        onSubmit={handleSubmit}
      />
    </Space>
  );
}
