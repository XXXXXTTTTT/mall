import { Button, Form, Input, Modal, Tree, Typography } from 'antd';
import { useState } from 'react';
import { ADMIN_PERMISSION_TREE } from '../../pages/admin/adminConfig.js';

function normalizeCheckedKeys(keys) {
  return Array.isArray(keys) ? keys : keys.checked;
}

function toggleCheckedKeys(checkedKeys, targetKey) {
  if (targetKey === 'system') {
    return checkedKeys;
  }
  return checkedKeys.includes(targetKey)
    ? checkedKeys.filter((item) => item !== targetKey)
    : [...checkedKeys, targetKey];
}

function RolePermissionModalDialog({ open, mode = 'edit', role, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState(role?.permissions || []);
  const [treeError, setTreeError] = useState('');

  function handleSave() {
    if (checkedKeys.filter((item) => item !== 'system').length === 0) {
      setTreeError('请至少选择一个权限模块');
    }
    form
      .validateFields()
      .then((values) => {
        const nextPermissions = checkedKeys.filter((item) => item !== 'system');
        if (nextPermissions.length === 0) {
          setTreeError('请至少选择一个权限模块');
          return;
        }
        onSubmit({
          name: values.name.trim(),
          code: mode === 'edit' ? role.code : values.code.trim(),
          permissions: nextPermissions,
        });
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnHidden
      getContainer={false}
      open={open}
      title={mode === 'create' ? '新增角色' : `编辑角色 ${role?.name || ''}`}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          保存角色
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={{
          name: role?.name || '',
          code: role?.code || '',
        }}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input aria-label="角色名称" placeholder="例如：商品专员" />
        </Form.Item>
        <Form.Item
          name="code"
          label="角色标识"
          rules={[{ required: true, message: '请输入角色标识' }]}
        >
          <Input
            aria-label="角色标识"
            disabled={mode === 'edit'}
            placeholder="例如：product_specialist"
          />
        </Form.Item>
        <div className="space-y-3">
          <Typography.Text className="text-sm font-semibold text-slate-700">
            可访问模块
          </Typography.Text>
          <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
            <Tree
              checkable
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={(keys) => {
                setCheckedKeys(normalizeCheckedKeys(keys));
                setTreeError('');
              }}
              onSelect={(_, info) => {
                setCheckedKeys((current) => toggleCheckedKeys(current, info.node.key));
                setTreeError('');
              }}
              treeData={ADMIN_PERMISSION_TREE}
            />
          </div>
          {treeError ? (
            <Typography.Text className="text-sm text-rose-500">
              {treeError}
            </Typography.Text>
          ) : null}
        </div>
      </Form>
    </Modal>
  );
}

export function RolePermissionModal({ open, mode = 'edit', role, onClose, onSubmit }) {
  const modalInstanceKey = `${mode}-${role?.code || 'create'}-${open ? 'open' : 'closed'}`;

  return (
    <RolePermissionModalDialog
      key={modalInstanceKey}
      open={open}
      mode={mode}
      role={role}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
