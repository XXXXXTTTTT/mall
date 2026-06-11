import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OrderShipModal } from './OrderShipModal.jsx';
import { ProductFormDrawer } from './ProductFormDrawer.jsx';
import { StatisticCardGrid } from './StatisticCardGrid.jsx';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('admin shared components', () => {
  it('validates product form fields before submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductFormDrawer
        open
        mode="create"
        product={null}
        categories={[{ id: 'cat-digital-office', name: '效率办公' }]}
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: '保存商品' }));

    expect(await screen.findByText('请输入商品名称')).toBeInTheDocument();
    expect(screen.getAllByText('请选择商品分类').length).toBeGreaterThan(0);
    expect(screen.getByText('请输入商品图片地址')).toBeInTheDocument();
    expect(screen.getByText('价格不能小于 0')).toBeInTheDocument();
    expect(screen.getByText('库存不能小于 0')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits shipment company and tracking number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OrderShipModal open orderId="ORD_TEST" onClose={() => {}} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('物流公司'), '顺丰速运');
    await user.type(screen.getByLabelText('物流单号'), 'SF1000000001');
    await user.click(screen.getByRole('button', { name: '确认发货' }));

    expect(onSubmit).toHaveBeenCalledWith({
      company: '顺丰速运',
      trackingNo: 'SF1000000001',
    });
  });

  it('renders statistic cards', () => {
    render(
      <StatisticCardGrid
        items={[
          { label: '商品总数', value: 30 },
          { label: '待发货订单', value: 1 },
        ]}
      />,
    );

    expect(screen.getByText('商品总数')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('待发货订单')).toBeInTheDocument();
  });
});
