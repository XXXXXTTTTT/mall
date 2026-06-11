import { Button, Card, Form, Input, Space, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../mock/mockService.js';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin/dashboard';

  async function handleFinish(values) {
    const result = await authService.loginAdmin(values.username, values.password);
    if (result.success) navigate(redirectTo, { replace: true });
  }

  async function handleQuickLogin(username, password) {
    await authService.loginAdmin(username, password);
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #edf4f2 0%, #d9e6e4 100%)' }}
    >
      <Card
        className="w-full max-w-sm"
        style={{ borderRadius: 24, boxShadow: '0 24px 54px rgba(23, 52, 57, 0.12)' }}
        title="后台登录"
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Text style={{ color: '#647275' }}>
            使用测试账号进入商城管理端，快速体验云仓后台流程。
          </Typography.Text>
          <Space size={12} style={{ width: '100%' }}>
            <Button block onClick={() => handleQuickLogin('admin', 'admin123')} type="default">
              管理员登录
            </Button>
            <Button block onClick={() => handleQuickLogin('operator', 'op123456')} type="default">
              普通运营登录
            </Button>
          </Space>
        </Space>
        <Form
          initialValues={{ username: 'admin', password: 'admin123' }}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入后台账号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入后台密码' }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
      </Card>
    </main>
  );
}
