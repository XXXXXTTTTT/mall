// 后台登录页。
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../mock/mockService.js';

// 渲染后台登录页并处理认证跳转。
export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin/dashboard';
  const [errorMessage, setErrorMessage] = useState('');

  // 提交后台账号密码并写入登录态。
  async function handleFinish(values) {
    const result = await authService.loginAdmin(values.username, values.password);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage('');
    navigate(redirectTo, { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#e8f4f2_0%,#f8fafc_42%,#eef4f8_100%)] px-6 py-10">
      <section className="w-full max-w-[460px] rounded-[34px] border border-white/80 bg-white/95 p-8 shadow-[0_34px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-2xl text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)]">
            <SafetyCertificateOutlined />
          </div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-[0.34em] !text-slate-400">
            Admin Portal
          </Typography.Text>
          <Typography.Title className="!mb-0 !mt-3 !text-[34px] !font-bold !tracking-tight !text-slate-950" level={1}>
            商城系统管理端
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !mt-3 !text-sm !leading-7 !text-slate-500">
            后台登录
          </Typography.Paragraph>
        </div>
        {errorMessage ? <Alert className="mb-5" message={errorMessage} showIcon type="error" /> : null}
        <Form
          initialValues={{ username: 'admin', password: 'admin123' }}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入后台账号' }]}>
            <Input
              aria-label="账号"
              className="rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              prefix={<UserOutlined className="text-slate-500" />}
              size="large"
            />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入后台密码' }]}>
            <Input.Password
              aria-label="密码"
              className="rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              prefix={<LockOutlined className="text-slate-500" />}
              size="large"
            />
          </Form.Item>
          <Button className="!h-12 rounded-xl !font-semibold tracking-wide" type="primary" htmlType="submit" block size="large">
            登录后台
          </Button>
        </Form>
      </section>
    </main>
  );
}
