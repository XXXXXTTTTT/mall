import { Button, Form, Input, InputNumber, Modal, Switch } from 'antd';
import { useEffect } from 'react';

export function CategoryFormModal({ open, mode, category, parentCategory, onClose, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: category?.name || '',
      sort: category?.sort,
      isActive: category?.isActive ?? true,
    });
  }, [category, form, open]);

  return (
    <Modal
      destroyOnHidden
      getContainer={false}
      open={open}
      title={mode === 'edit' ? `编辑分类 ${category?.name || ''}` : `新增子分类 ${parentCategory?.name || ''}`}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          保存分类
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
          <Input aria-label="分类名称" />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序"
          rules={[
            {
              validator: (_, value) =>
                Number(value) >= 0 ? Promise.resolve() : Promise.reject(new Error('排序不能小于 0')),
            },
          ]}
        >
          <InputNumber aria-label="排序" className="w-full" />
        </Form.Item>
        <Form.Item name="isActive" label="分类状态" valuePropName="checked">
          <Switch checkedChildren="上架" unCheckedChildren="停用" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
