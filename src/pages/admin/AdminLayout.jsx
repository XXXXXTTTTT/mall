import { Layout, Menu, Space, Tag, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../mock/mockService.js';

const { Header, Sider, Content } = Layout;

const menuPaths = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/orders',
  '/admin/roles',
  '/admin/users',
  '/admin/account',
  '/admin/logs',
];

export function AdminLayout() {
  const location = useLocation();
  const session = authService.getAdminSession();
  const menuItems = [
    { key: '/admin/dashboard', label: <Link to="/admin/dashboard">数据看板</Link> },
    { key: '/admin/products', label: <Link to="/admin/products">商品管理</Link> },
    { key: '/admin/categories', label: <Link to="/admin/categories">分类管理</Link> },
    { key: '/admin/orders', label: <Link to="/admin/orders">订单管理</Link> },
    { key: '/admin/roles', label: <Link to="/admin/roles">权限角色</Link> },
    { key: '/admin/users', label: <Link to="/admin/users">用户管理</Link> },
    { key: '/admin/account', label: <Link to="/admin/account">账号设置</Link> },
    { key: '/admin/logs', label: <Link to="/admin/logs">操作日志</Link> },
  ];
  const selectedKey = menuPaths.find((path) => location.pathname.startsWith(path)) || '/admin/dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{
          background: 'linear-gradient(180deg, #173439 0%, #27484d 100%)',
        }}
        width={236}
      >
        <div style={{ padding: '28px 24px 20px' }}>
          <Typography.Title level={4} style={{ color: '#ffffff', margin: 0 }}>
            商城管理端
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.72)' }}>云仓后台</Typography.Text>
        </div>
        <Menu
          items={menuItems}
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: 'transparent', borderInlineEnd: 0 }}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header
          style={{
            alignItems: 'center',
            background: '#f3f7f6',
            borderBottom: '1px solid #d8e2e1',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <Space direction="vertical" size={0}>
            <Typography.Text strong style={{ color: '#173439', fontSize: 18 }}>
              商城管理端
            </Typography.Text>
            <Typography.Text style={{ color: '#647275' }}>云仓后台</Typography.Text>
          </Space>
          <Space>
            <Tag color="cyan">{session?.roleCode || 'guest'}</Tag>
            <Typography.Text style={{ color: '#173439' }}>{session?.name || '未登录'}</Typography.Text>
          </Space>
        </Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
