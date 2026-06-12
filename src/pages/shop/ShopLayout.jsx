import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';

const navItems = [
  { to: '/shop', label: '首页', icon: 'home' },
  { to: '/shop/category', label: '分类', icon: 'grid' },
  { to: '/shop/cart', label: '购物车', icon: 'bag' },
  { to: '/shop/user', label: '我的', icon: 'user' },
];

const primaryShopPaths = new Set(['/shop', '/shop/category', '/shop/cart', '/shop/user']);

function normalizePathname(pathname) {
  if (pathname === '/shop/') return '/shop';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function ShopLayout() {
  const location = useLocation();
  const showBottomDock = primaryShopPaths.has(normalizePathname(location.pathname));

  return (
    <div className={`min-h-screen overflow-x-hidden bg-[#F7F8F6] text-slate-900 ${showBottomDock ? 'pb-24' : ''}`}>
      <div className="mx-auto min-h-screen max-w-md overflow-x-hidden bg-[#FBFCFA] shadow-[0_0_80px_rgba(15,23,42,0.08)]">
        <Outlet />
      </div>
      {showBottomDock ? (
        <nav
          aria-label="前台主导航"
          data-testid="shop-bottom-dock"
          className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t border-white/80 bg-white/80 px-4 py-3 shadow-[0_-16px_40px_rgba(15,23,42,0.1)] backdrop-blur-md"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/shop'}
              className={({ isActive }) =>
                [
                  'flex min-h-11 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition',
                  isActive ? 'bg-[#E7F3F4] text-[#1F6F8B]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <ShopIcon name={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
