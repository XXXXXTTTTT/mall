import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState.jsx';
import { IconButton } from './IconButton.jsx';
import { MetricTile } from './MetricTile.jsx';
import { ProductCard } from './ProductCard.jsx';
import { ProductTag } from './ProductTag.jsx';
import { QuantityStepper } from './QuantityStepper.jsx';
import { SectionHeader } from './SectionHeader.jsx';
import { SettingRow } from './SettingRow.jsx';
import { ShopIcon } from './ShopIcon.jsx';
import { ShopNavigationBar } from './ShopNavigationBar.jsx';
import { StatusTag } from './StatusTag.jsx';

const product = {
  id: 'p-001',
  name: '曜石无线降噪耳机',
  price: 699,
  stock: 98,
  image: 'https://dummyimage.com/640x480/e8eef3/203244&text=test',
  tags: ['热门', '精选'],
  status: 'online',
};

describe('shop shared components', () => {
  it('renders a HIG-style navigation bar with a back action', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <MemoryRouter>
        <ShopNavigationBar title="订单详情" onBack={onBack} />
      </MemoryRouter>,
    );

    const bar = screen.getByTestId('shop-navigation-bar');
    expect(bar).toHaveTextContent('订单详情');
    expect(screen.queryByRole('heading', { level: 1, name: '订单详情' })).not.toBeInTheDocument();
    expect(bar.className).toContain('backdrop-blur-md');
    expect(bar.className).toContain('bg-white/85');
    expect(bar.className).toContain('border-b');
    expect(bar.className).toContain('border-neutral-100/60');

    const backButton = screen.getByTestId('shop-back-button');
    expect(backButton).toHaveAccessibleName('返回');
    expect(backButton.className).toContain('h-11');
    expect(backButton.className).toContain('w-11');

    await user.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders the shop left chevron icon key', () => {
    const { container } = render(<ShopIcon name="chevronLeft" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('path')).toHaveAttribute('d', 'm15 5-7 7 7 7');
  });

  it('renders local svg icons without adding icon dependencies', () => {
    const { container } = render(<ShopIcon name="search" className="h-5 w-5" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps icon buttons at a 44px touch target', () => {
    render(<IconButton ariaLabel="删除" icon="trash" onClick={() => {}} />);

    const button = screen.getByRole('button', { name: '删除' });
    expect(button.className).toContain('h-11');
    expect(button.className).toContain('w-11');
  });

  it('renders settings rows with icon and chevron link', () => {
    render(
      <MemoryRouter>
        <SettingRow to="/shop/orders" icon="receipt" title="我的订单" description="查看订单进度" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /我的订单/ })).toHaveAttribute('href', '/shop/orders');
    expect(screen.getByText('查看订单进度')).toBeInTheDocument();
  });

  it('renders metric tiles and product tags with icons', () => {
    const { container } = render(
      <>
        <MetricTile icon="coupon" label="优惠券" value="3" />
        <ProductTag tag="热门" />
      </>,
    );

    expect(screen.getByText('优惠券')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('热门')).toBeInTheDocument();
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('renders product card with detail link and product facts', () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /曜石无线降噪耳机/ })).toHaveAttribute('href', '/shop/detail/p-001');
    expect(screen.getByText('¥699')).toBeInTheDocument();
    expect(screen.getByText('库存 98')).toBeInTheDocument();
    expect(screen.getByText('热门')).toBeInTheDocument();
  });

  it('renders product card safely without tags', () => {
    const productWithoutTags = {
      id: 'p-002',
      name: '云纹便携保温杯',
      price: 129,
      stock: 32,
      image: 'https://dummyimage.com/640x480/e8eef3/203244&text=cup',
      status: 'online',
    };

    render(
      <MemoryRouter>
        <ProductCard product={productWithoutTags} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /云纹便携保温杯/ })).toHaveAttribute('href', '/shop/detail/p-002');
    expect(screen.getByText('¥129')).toBeInTheDocument();
    expect(screen.getByText('库存 32')).toBeInTheDocument();
  });

  it('keeps quantity at minimum 1 and emits changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper value={1} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '减少数量' }));
    expect(onChange).not.toHaveBeenCalledWith(0);

    expect(screen.getByRole('button', { name: '减少数量' }).className).toContain('h-11');

    await user.click(screen.getByRole('button', { name: '增加数量' }));
    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: '增加数量' }).className).toContain('h-11');
  });

  it('clamps displayed quantity and emitted changes to minimum', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper value={0} onChange={onChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '减少数量' }));
    expect(onChange).not.toHaveBeenCalledWith(0);

    expect(screen.getByRole('button', { name: '减少数量' }).className).toContain('h-11');

    await user.click(screen.getByRole('button', { name: '增加数量' }));
    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: '增加数量' }).className).toContain('h-11');
  });

  it('renders section header action link', () => {
    render(
      <MemoryRouter>
        <SectionHeader eyebrow="精选专栏" title="本周上新" actionText="查看全部" actionTo="/shop/category" />
      </MemoryRouter>,
    );

    expect(screen.getByText('精选专栏')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '本周上新' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看全部' })).toHaveAttribute('href', '/shop/category');
  });

  it('renders status and empty action link', () => {
    render(
      <MemoryRouter>
        <StatusTag status="paid" />
        <EmptyState title="购物车还是空的" actionText="去首页看看" actionTo="/shop" />
      </MemoryRouter>,
    );

    expect(screen.getByText('已支付')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '去首页看看' })).toHaveAttribute('href', '/shop');
  });

  it('hides empty state decorative icon from assistive tech', () => {
    const { container } = render(<EmptyState title="暂无收藏商品" />);

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
