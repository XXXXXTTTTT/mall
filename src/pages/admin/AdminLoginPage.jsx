import { Button, Card, Form, Input } from 'antd';
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card title="后台登录" className="w-full max-w-sm">
        <Form layout="vertical" onFinish={handleFinish} initialValues={{ username: 'admin', password: 'admin123' }}>
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
