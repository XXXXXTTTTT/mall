import { Button, Card, Descriptions, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { authService } from '../../mock/mockService.js';

export function AdminAccountPage() {
  const navigate = useNavigate();
  const session = authService.getAdminSession();

  function handleLogout() {
    authService.logoutAdmin();
    navigate('/admin/login', { replace: true });
  }

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard title="账号设置" description="查看当前后台登录账号与角色信息。" />
      <Card style={{ borderRadius: 18 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="账号姓名">{session?.name || '未登录'}</Descriptions.Item>
          <Descriptions.Item label="登录账号">{session?.username || '-'}</Descriptions.Item>
          <Descriptions.Item label="角色标识">{session?.roleCode || '-'}</Descriptions.Item>
        </Descriptions>
        <Typography.Paragraph style={{ marginBottom: 0, marginTop: 16 }}>
          当前账号：{session?.name || '未登录'}
        </Typography.Paragraph>
        <Button onClick={handleLogout} style={{ marginTop: 16 }}>
          退出登录
        </Button>
      </Card>
    </Space>
  );
}
