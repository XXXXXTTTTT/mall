import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/shop', label: '首页' },
  { to: '/shop/category', label: '分类' },
  { to: '/shop/cart', label: '购物车' },
  { to: '/shop/user', label: '我的' },
];

export function ShopLayout() {
  return (
    <div className="min-h-screen bg-[#F7F8F6] pb-24 text-slate-900">
      <div className="mx-auto min-h-screen max-w-md bg-[#FBFCFA] shadow-[0_0_80px_rgba(15,23,42,0.08)]">
        <Outlet />
      </div>
      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t border-slate-200/80 bg-[#FBFCFA]/95 px-4 py-3 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/shop'}
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-2 text-sm font-semibold transition',
                isActive ? 'bg-[#E7F3F4] text-[#1F6F8B]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
