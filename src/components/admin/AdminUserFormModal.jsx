// 后台账号表单弹窗。
import { Button, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

// 渲染后台账号新增与编辑弹窗。
export function AdminUserFormModal({ open, mode, admin, roles, onClose, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      return;
    }
    form.resetFields();
    form.setFieldsValue({
      username: admin?.username || '',
      name: admin?.name || '',
      roleCode: admin?.roleCode,
    });
  }, [admin, form, open]);

  // 校验账号表单后提交到外层。
  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        onSubmit({
          username: values.username.trim(),
          name: values.name.trim(),
          ...(mode === 'create' ? { password: values.password.trim() } : {}),
          roleCode: values.roleCode,
        });
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnHidden
      getContainer={false}
      open={open}
      title={mode === 'create' ? '新增后台账号' : `编辑后台账号 ${admin?.username || ''}`}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          保存账号
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input aria-label="用户名" placeholder="例如：xiaoming" />
        </Form.Item>
        <Form.Item name="name" label="显示名称" rules={[{ required: true, message: '请输入显示名称' }]}>
          <Input aria-label="显示名称" placeholder="例如：小明" />
        </Form.Item>
        {mode === 'create' ? (
          <Form.Item
            name="password"
            label="初始密码"
            rules={[{ required: true, message: '请输入初始密码' }]}
          >
            <Input.Password aria-label="初始密码" placeholder="用于首次登录的密码" />
          </Form.Item>
        ) : null}
        <Form.Item name="roleCode" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select options={roles} placeholder="选择权限包" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
