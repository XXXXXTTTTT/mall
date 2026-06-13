import {
  DashboardOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';

export const ADMIN_NAV_ITEMS = [
  { key: '/admin/dashboard', permission: 'dashboard', label: '数据看板', icon: DashboardOutlined },
  { key: '/admin/products', permission: 'products', label: '商品管理', icon: ShoppingOutlined },
  { key: '/admin/categories', permission: 'categories', label: '分类管理', icon: TagsOutlined },
  { key: '/admin/orders', permission: 'orders', label: '订单管理', icon: ShoppingCartOutlined },
  { key: '/admin/roles', permission: 'roles', label: '权限角色', icon: SafetyCertificateOutlined },
  { key: '/admin/users', permission: 'users', label: '账号管理', icon: TeamOutlined },
  { key: '/admin/account', permission: 'account', label: '账号设置', icon: SettingOutlined },
  { key: '/admin/logs', permission: 'logs', label: '操作日志', icon: FileTextOutlined },
];

export const ADMIN_PERMISSION_TREE = [
  {
    key: 'system',
    title: '后台模块权限',
    children: ADMIN_NAV_ITEMS.map((item) => ({
      key: item.permission,
      title: item.label,
    })),
  },
];

export function getAdminSelectedKey(pathname) {
  return ADMIN_NAV_ITEMS.find((item) => pathname.startsWith(item.key))?.key || '/admin/dashboard';
}

export function getAdminNavItem(pathname) {
  return ADMIN_NAV_ITEMS.find((item) => pathname.startsWith(item.key)) || ADMIN_NAV_ITEMS[0];
}
