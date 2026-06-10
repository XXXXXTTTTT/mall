import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/shop', label: '首页' },
  { to: '/shop/category', label: '分类' },
  { to: '/shop/cart', label: '购物车' },
  { to: '/shop/user', label: '我的' },
];

export function ShopLayout() {
  return (
    <div className="min-h-screen bg-slate-100 pb-20 text-slate-900">
      <Outlet />
      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/shop'} className="text-sm font-medium text-slate-600">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
