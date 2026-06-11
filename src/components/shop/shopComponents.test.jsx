import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState.jsx';
import { ProductCard } from './ProductCard.jsx';
import { QuantityStepper } from './QuantityStepper.jsx';
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

  it('keeps quantity at minimum 1 and emits changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper value={1} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '减少数量' }));
    expect(onChange).not.toHaveBeenCalledWith(0);

    await user.click(screen.getByRole('button', { name: '增加数量' }));
    expect(onChange).toHaveBeenCalledWith(2);
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
});
