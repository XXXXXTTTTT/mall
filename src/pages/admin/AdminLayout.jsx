import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', label: <Link to="/admin/dashboard">数据看板</Link> },
  { key: 'products', label: <Link to="/admin/products">商品管理</Link> },
  { key: 'categories', label: <Link to="/admin/categories">分类管理</Link> },
  { key: 'orders', label: <Link to="/admin/orders">订单管理</Link> },
  { key: 'roles', label: <Link to="/admin/roles">权限角色</Link> },
  { key: 'users', label: <Link to="/admin/users">用户管理</Link> },
  { key: 'account', label: <Link to="/admin/account">账号设置</Link> },
  { key: 'logs', label: <Link to="/admin/logs">操作日志</Link> },
];

export function AdminLayout() {
  return (
    <Layout className="min-h-screen">
      <Sider width={220}>
        <div className="px-5 py-4 text-lg font-bold text-white">云仓后台</div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header className="bg-white text-lg font-semibold text-slate-900">商城管理端</Header>
        <Content className="m-6 rounded-2xl bg-white p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
