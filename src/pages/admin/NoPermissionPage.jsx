import { Button, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { AdminSurfaceCard } from '../../components/admin/AdminSurfaceCard.jsx';

export function NoPermissionPage() {
  return (
    <AdminSurfaceCard className="min-h-[480px]">
      <Space direction="vertical" size={18} className="!flex !h-full !items-center !justify-center !py-12 !text-center">
        <Typography.Text className="text-xs font-semibold uppercase tracking-[0.32em] !text-amber-500">
          Access Control
        </Typography.Text>
        <Typography.Title className="!mb-0 !text-4xl !font-semibold !tracking-tight !text-slate-900" level={1}>
          无权限
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 max-w-xl !text-base !leading-8 !text-slate-500">
          当前后台账号无权访问该模块，请返回数据看板或切换具备权限的后台账号继续操作。
        </Typography.Paragraph>
        <Space size={12}>
          <Button type="primary">
            <Link to="/admin/dashboard">返回数据看板</Link>
          </Button>
          <Button>
            <Link to="/admin/account">前往账号设置</Link>
          </Button>
        </Space>
      </Space>
    </AdminSurfaceCard>
  );
}
