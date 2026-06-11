import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState.jsx';
import { ProductCard } from './ProductCard.jsx';
import { QuantityStepper } from './QuantityStepper.jsx';
import { SectionHeader } from './SectionHeader.jsx';
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

    await user.click(screen.getByRole('button', { name: '增加数量' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('clamps displayed quantity and emitted changes to minimum', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper value={0} onChange={onChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '减少数量' }));
    expect(onChange).not.toHaveBeenCalledWith(0);

    await user.click(screen.getByRole('button', { name: '增加数量' }));
    expect(onChange).toHaveBeenCalledWith(2);
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
