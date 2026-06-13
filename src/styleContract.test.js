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

    expect(layout).toContain('backdrop-blur-md');
    expect(layout).toContain('bg-white/80');
    expect(layout).toContain('min-h-11');
    expect(home).toContain('HeroCarousel');
    expect(category).toContain('分类索引');
    expect(navigationBar).toContain('backdrop-blur-md');
    expect(navigationBar).toContain('bg-white/85');
    expect(navigationBar).toContain('border-b border-neutral-100/60');
    expect(orderDetail).toContain('tracking-wide');
    expect(orderDetail).toContain('leading-relaxed');
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
