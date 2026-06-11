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
});
