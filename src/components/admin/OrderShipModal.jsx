// 后台订单发货弹窗。
import { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

// 渲染后台订单发货弹窗。
export function OrderShipModal({ open, orderId, onClose, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [form, open]);

  // 校验物流表单后提交发货信息。
  async function handleOk() {
    const values = await form.validateFields();
    onSubmit({
      company: values.company,
      trackingNo: values.trackingNo,
    });
  }

  return (
    <Modal
      destroyOnHidden
      getContainer={false}
      okText="确认发货"
      onCancel={onClose}
      onOk={handleOk}
      open={open}
      title={`订单发货 ${orderId}`}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="物流公司" name="company" rules={[{ required: true, message: '请输入物流公司' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="物流单号" name="trackingNo" rules={[{ required: true, message: '请输入物流单号' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
