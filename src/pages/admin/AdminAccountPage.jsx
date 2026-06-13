import { Button, Descriptions, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AdminSurfaceCard } from '../../components/admin/AdminSurfaceCard.jsx';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { authService, roleService } from '../../mock/mockService.js';

export function AdminAccountPage() {
  const navigate = useNavigate();
  const session = authService.getAdminSession();
  const roleName = session ? roleService.getRoleByCodeSync(session.roleCode)?.name || session.roleCode : '-';

  function handleLogout() {
    authService.logoutAdmin();
    navigate('/admin/login', { replace: true });
  }

  return (
    <Space direction="vertical" size={20} className="!flex">
      <PageHeaderCard title="账号设置" description="查看当前后台登录账号与角色信息，并保持与顶部管理员面板一致的退出体验。" />
      <AdminSurfaceCard>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="账号姓名">{session?.name || '未登录'}</Descriptions.Item>
          <Descriptions.Item label="登录账号">{session?.username || '-'}</Descriptions.Item>
          <Descriptions.Item label="角色权限包">{roleName}</Descriptions.Item>
        </Descriptions>
        <Typography.Paragraph className="!mb-0 !mt-4 !text-base !text-slate-500">
          当前账号：{session?.name || '未登录'}
        </Typography.Paragraph>
        <Space size={12} className="mt-5">
          <Button onClick={handleLogout}>
            切换账号
          </Button>
          <Button danger onClick={handleLogout}>
            退出登录
          </Button>
        </Space>
      </AdminSurfaceCard>
    </Space>
  );
}
