import { Form, Input, Modal } from 'antd';

export function OrderShipModal({ open, orderId, onClose, onSubmit }) {
  const [form] = Form.useForm();

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
