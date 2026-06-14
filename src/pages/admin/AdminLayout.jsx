// 后台管理布局。
import {
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authService, permissionService, roleService } from '../../mock/mockService.js';
import { ADMIN_NAV_ITEMS, getAdminNavItem, getAdminSelectedKey } from './adminConfig.js';

// 渲染后台整体布局、菜单和顶部账号区域。
export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = authService.getAdminSession();
  const selectedKey = getAdminSelectedKey(location.pathname);
  const currentNav = getAdminNavItem(location.pathname);
  const roleName = session ? roleService.getRoleByCodeSync(session.roleCode)?.name || '未分配角色' : '未登录';
  const CurrentNavIcon = currentNav?.icon || AppstoreOutlined;
  const menuItems = session
    ? ADMIN_NAV_ITEMS
        .filter((item) => permissionService.canAccess(session.roleCode, item.permission))
        .map((item) => ({
          key: item.key,
          icon: <item.icon />,
          label: <Link to={item.key}>{item.label}</Link>,
        }))
    : [];

  // 清除后台会话并回到登录页。
  function handleLogout() {
    authService.logoutAdmin();
    navigate('/admin/login', { replace: true });
  }

  const dropdownMenu = {
    items: [
      { key: 'account', icon: <UserOutlined />, label: '个人设置' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, danger: true, label: '安全退出登录' },
    ],
    onClick: ({ key }) => {
      if (key === 'account') {
        navigate('/admin/account');
      }
      if (key === 'logout') {
        handleLogout();
      }
    },
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      <aside className="flex h-screen min-h-screen w-64 flex-shrink-0 flex-col bg-[linear-gradient(180deg,#14303a_0%,#1c444a_100%)] text-white">
        <div className="px-4 pb-4 pt-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-slate-100">
                <AppstoreOutlined />
              </div>
              <div className="min-w-0">
                <Typography.Text className="block truncate !text-base !font-bold !tracking-wide !text-white">
                  商城管理端
                </Typography.Text>
                <Typography.Text className="block truncate !text-xs !uppercase !tracking-[0.28em] !text-slate-300">
                  Business Console
                </Typography.Text>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <Menu
            items={menuItems}
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ background: 'transparent', borderInlineEnd: 0 }}
            theme="dark"
          />
        </div>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col bg-[linear-gradient(180deg,#f5f8fb_0%,#edf3f8_100%)]">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/88 px-6 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <CurrentNavIcon />
            </div>
            <Typography.Text className="block truncate !text-sm !font-semibold !tracking-wide !text-slate-900">
              商城系统管理端
            </Typography.Text>
          </div>
          <div className="flex items-center gap-2">
            {session ? (
              <Dropdown menu={dropdownMenu} placement="bottomRight" trigger={['click']}>
                <Button className="!flex !h-11 !items-center !gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                  <Avatar className="bg-slate-900" size={28}>
                    {session.username.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-900">{session.username}</span>
                    <span className="text-xs text-slate-500">{roleName}</span>
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <Typography.Text className="!text-sm !text-slate-400">未登录</Typography.Text>
            )}
          </div>
        </header>
        <main className="min-w-0 flex-1 w-full overflow-y-auto">
          <div className="flex min-h-full w-full min-w-0 flex-col gap-6 px-6 py-6">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
}
