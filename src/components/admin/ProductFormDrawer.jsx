// 后台商品表单抽屉。
import { useEffect } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Select, Space } from 'antd';

const statusOptions = [
  { label: '上架', value: 'online' },
  { label: '下架', value: 'offline' },
];

// 将商品对象映射为抽屉表单初始值。
function buildInitialValues(product) {
  return {
    id: product?.id,
    name: product?.name,
    categoryId: product?.categoryId,
    price: product?.price,
    stock: product?.stock,
    image: product?.image,
    status: product?.status ?? 'online',
    tags: product?.tags || [],
    description: product?.description,
  };
}

// 渲染后台商品新增与编辑抽屉。
export function ProductFormDrawer({ open, mode, product, categories, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const title = mode === 'edit' ? '编辑商品' : '新增商品';

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue(buildInitialValues(product));
  }, [form, mode, open, product]);

  // 组装商品表单结果并提交。
  function handleFinish(values) {
    const id = product?.id || values.id;
    const payload = {
      id,
      name: values.name,
      categoryId: values.categoryId,
      price: values.price,
      stock: values.stock,
      image: values.image,
      status: values.status,
      tags: values.tags || [],
      description: values.description || '',
    };

    onSubmit(payload);
  }

  return (
    <Drawer
      destroyOnHidden
      extra={
        <Space>
          <Button onClick={onClose} type="default">
            取消
          </Button>
          <Button form="admin-product-form" htmlType="submit" type="primary">
            保存商品
          </Button>
        </Space>
      }
      getContainer={false}
      onClose={onClose}
      open={open}
      title={title}
      width={520}
    >
      <Form
        form={form}
        id="admin-product-form"
        initialValues={buildInitialValues(product)}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item label="商品名称" name="name" rules={[{ required: true, message: '请输入商品名称' }]}>
          <Input placeholder="请输入商品名称" />
        </Form.Item>
        <Form.Item label="商品分类" name="categoryId" rules={[{ required: true, message: '请选择商品分类' }]}>
          <Select
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            placeholder="请选择商品分类"
          />
        </Form.Item>
        <Form.Item label="商品图片" name="image" rules={[{ required: true, message: '请输入商品图片地址' }]}>
          <Input placeholder="请输入商品图片地址" />
        </Form.Item>
        <Form.Item
          label="商品价格"
          name="price"
          rules={[
            { required: true, message: '价格不能小于 0' },
            { type: 'number', min: 0, message: '价格不能小于 0' },
          ]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="商品库存"
          name="stock"
          rules={[
            { required: true, message: '库存不能小于 0' },
            { type: 'number', min: 0, message: '库存不能小于 0' },
          ]}
        >
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="商品状态" name="status">
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item label="商品标签" name="tags">
          <Select mode="tags" placeholder="输入标签后回车" />
        </Form.Item>
        <Form.Item label="商品描述" name="description">
          <Input.TextArea placeholder="请输入商品描述" rows={4} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
