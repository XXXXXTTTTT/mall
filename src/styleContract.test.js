// 样式与目录约束测试。
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('global style contract', () => {
  it('does not override Tailwind link color utilities globally', () => {
    const css = readFileSync(resolve('src/index.css'), 'utf-8');

    expect(css).not.toMatch(/a\s*{[^}]*color\s*:\s*inherit/s);
  });

  it('keeps shop glass and touch target contracts in source', () => {
    const layout = readFileSync(resolve('src/pages/shop/ShopLayout.jsx'), 'utf-8');
    const home = readFileSync(resolve('src/pages/shop/Home.jsx'), 'utf-8');
    const category = readFileSync(resolve('src/pages/shop/Category.jsx'), 'utf-8');
    const navigationBar = readFileSync(resolve('src/components/shop/ShopNavigationBar.jsx'), 'utf-8');
    const orderDetail = readFileSync(resolve('src/pages/shop/OrderDetailPage.jsx'), 'utf-8');
    const mockData = readFileSync(resolve('src/mock/mockData.js'), 'utf-8');

    expect(layout).toContain('backdrop-blur-md');
    expect(layout).toContain('bg-white/80');
    expect(layout).toContain('min-h-11');
    expect(home).toContain('HeroCarousel');
    expect(category).toContain('aria-label="一级分类"');
    expect(category).toContain('data-testid="category-product-grid"');
    expect(navigationBar).toContain('backdrop-blur-md');
    expect(navigationBar).toContain('bg-white/85');
    expect(navigationBar).toContain('border-b border-neutral-100/60');
    expect(orderDetail).toContain('tracking-wide');
    expect(orderDetail).toContain('leading-relaxed');
    expect(mockData).not.toContain('dummyimage.com');
    expect(mockData).toContain('createProductImage');
  });

  it('keeps context files under src/contexts', () => {
    const context = readFileSync(resolve('src/contexts/AppContext.jsx'), 'utf-8');

    expect(context).toContain('createContext');
    expect(context).toContain('useAppContext');
  });

  it('locks mobile app shell fixed headers and hidden scrollbars', () => {
    const css = readFileSync(resolve('src/index.css'), 'utf-8');
    const layout = readFileSync(resolve('src/pages/shop/ShopLayout.jsx'), 'utf-8');
    const navigationBar = readFileSync(resolve('src/components/shop/ShopNavigationBar.jsx'), 'utf-8');
    const home = readFileSync(resolve('src/pages/shop/Home.jsx'), 'utf-8');
    const category = readFileSync(resolve('src/pages/shop/Category.jsx'), 'utf-8');
    const cart = readFileSync(resolve('src/pages/shop/Cart.jsx'), 'utf-8');
    const userPage = readFileSync(resolve('src/pages/shop/UserPage.jsx'), 'utf-8');
    const orderList = readFileSync(resolve('src/pages/shop/OrderListPage.jsx'), 'utf-8');

    expect(css).toContain('overflow-x: hidden');
    expect(css).toContain('.scrollbar-none');
    expect(css).toContain('scrollbar-width: none');
    expect(css).toContain('-ms-overflow-style: none');
    expect(css).toContain('.scrollbar-none::-webkit-scrollbar');
    expect(layout).toContain('overflow-x-hidden');
    expect(navigationBar).toContain('fixed inset-x-0 top-0 z-50');
    expect(home).toContain('fixed inset-x-0 top-0 z-50');
    expect(category).toContain('fixed inset-x-0 top-0 z-50');
    expect(cart).toContain('fixed inset-x-4 top-3 z-50');
    expect(cart).toContain('pt-36');
    expect(userPage).toContain('fixed inset-x-4 top-3 z-50');
    expect(userPage).toContain('pt-36');
    expect(orderList).toContain('scrollbar-none');
  });

  it('keeps app-like shop pages free from visible web overflow patterns', () => {
    const home = readFileSync(resolve('src/pages/shop/Home.jsx'), 'utf-8');
    const heroCarousel = readFileSync(resolve('src/components/shop/HeroCarousel.jsx'), 'utf-8');
    const category = readFileSync(resolve('src/pages/shop/Category.jsx'), 'utf-8');
    const orderList = readFileSync(resolve('src/pages/shop/OrderListPage.jsx'), 'utf-8');

    expect(heroCarousel).not.toContain('overflow-x-auto');
    expect(home).toContain('to="/shop/search"');
    expect(category).toContain('flex h-[calc(100vh-4rem-6rem)]');
    expect(category).toContain('w-[6.75rem]');
    expect(category).toContain('scrollbar-none');
    expect(orderList).toContain('scrollbar-none');
  });

  it('locks the old mock branch fixes for shop scroll and product card details', () => {
    const css = readFileSync(resolve('src/index.css'), 'utf-8');
    const home = readFileSync(resolve('src/pages/shop/Home.jsx'), 'utf-8');
    const category = readFileSync(resolve('src/pages/shop/Category.jsx'), 'utf-8');
    const productCard = readFileSync(resolve('src/components/shop/ProductCard.jsx'), 'utf-8');

    expect(css).toContain('scrollbar-width: none');
    expect(css).toContain('::-webkit-scrollbar');
    expect(home).toContain('useLocation');
    expect(home).toContain('location.key');
    expect(category).toContain('overflow-hidden');
    expect(category).toContain('scrollbar-none');
    expect(category).not.toContain('pb-8');
    expect(productCard).toContain('shop-card-interactive');
    expect(css).toContain('0.2s ease-in-out');
  });

  it('isolates shop card hover and touch feedback by input capability', () => {
    const css = readFileSync(resolve('src/index.css'), 'utf-8');
    const heroCarousel = readFileSync(resolve('src/components/shop/HeroCarousel.jsx'), 'utf-8');
    const productCard = readFileSync(resolve('src/components/shop/ProductCard.jsx'), 'utf-8');

    expect(css).toContain('@media (hover: hover)');
    expect(css).toContain('@media (hover: none)');
    expect(css).toContain('.shop-card-interactive:hover');
    expect(css).toContain('.shop-card-interactive:active');
    expect(css).toContain('::-webkit-scrollbar');
    expect(css).not.toContain('touch-action: none');
    expect(heroCarousel).toContain('shop-card-interactive');
    expect(heroCarousel).not.toContain('hover:');
    expect(heroCarousel).not.toContain('group-hover:');
    expect(productCard).toContain('shop-card-interactive');
    expect(productCard).not.toContain('hover:');
    expect(productCard).not.toContain('group-hover:');
  });

  it('locks final shop prompt viewport and narrow-card layout fixes', () => {
    const home = readFileSync(resolve('src/pages/shop/Home.jsx'), 'utf-8');
    const category = readFileSync(resolve('src/pages/shop/Category.jsx'), 'utf-8');
    const productCard = readFileSync(resolve('src/components/shop/ProductCard.jsx'), 'utf-8');

    expect(home).toContain('justify-center');
    expect(home).toContain('py-4');
    expect(category).toContain('h-[calc(100vh-4rem-6rem)]');
    expect(category).toContain('data-testid="category-rail"');
    expect(category).toContain('data-testid="category-product-scroll"');
    expect(category).toContain('h-full overflow-y-auto');
    expect(productCard).toContain('line-clamp-1');
    expect(productCard).toContain('flex flex-wrap gap-1 items-center');
    expect(productCard).toContain('text-[10px]');
  });

  it('keeps admin shell typography and spacing contracts in source', () => {
    const layout = readFileSync(resolve('src/pages/admin/AdminLayout.jsx'), 'utf-8');
    const login = readFileSync(resolve('src/pages/admin/AdminLoginPage.jsx'), 'utf-8');
    const headerCard = readFileSync(resolve('src/components/admin/PageHeaderCard.jsx'), 'utf-8');

    expect(layout).toContain('font-sans');
    expect(layout).toContain('items-center');
    expect(layout).toContain('Dropdown');
    expect(layout).toContain('w-screen');
    expect(layout).toContain('h-screen');
    expect(layout).toContain('flex-shrink-0');
    expect(layout).toContain('min-w-0');
    expect(layout).toContain('h-16');
    expect(login).toContain('商城系统管理端');
    expect(login).toContain('items-center');
    expect(login).toContain('justify-center');
    expect(login).toContain('登录后台');
    expect(login).not.toContain('lg:grid-cols');
    expect(headerCard).toContain('font-semibold');
    expect(headerCard).toContain('tracking-wide');
  });
});
