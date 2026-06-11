import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OrderShipModal } from './OrderShipModal.jsx';
import { PageHeaderCard } from './PageHeaderCard.jsx';
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

const categories = [{ id: 'cat-digital-office', name: '效率办公' }];

const firstProduct = {
  id: 'p-001',
  name: '曜石无线降噪耳机',
  categoryId: 'cat-digital-office',
  price: 699,
  stock: 98,
  image: 'https://dummyimage.com/640x480/e8eef3/203244&text=first',
  status: 'online',
  tags: ['热门'],
  skuOptions: [
    { id: 'p-001-standard', name: '标准版', stock: 93, price: 699 },
    { id: 'p-001-pro', name: '进阶版', stock: 49, price: 759 },
  ],
  description: '第一件商品描述',
};

const secondProduct = {
  id: 'p-002',
  name: '雾银桌面拓展坞',
  categoryId: 'cat-digital-office',
  price: 329,
  stock: 56,
  image: 'https://dummyimage.com/640x480/e8eef3/203244&text=second',
  status: 'offline',
  tags: ['新品'],
  skuOptions: [{ id: 'p-002-standard', name: '标准版', stock: 51, price: 329 }],
  description: '第二件商品描述',
};

describe('admin shared components', () => {
  it('validates product form fields before submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductFormDrawer
        open
        mode="create"
        product={null}
        categories={categories}
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: '保存商品' }));

    expect(await screen.findByText('请输入商品名称')).toBeInTheDocument();
    expect(await screen.findAllByText('请选择商品分类')).toHaveLength(2);
    expect(screen.getByText('请输入商品图片地址')).toBeInTheDocument();
    expect(screen.getByText('价格不能小于 0')).toBeInTheDocument();
    expect(screen.getByText('库存不能小于 0')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits create product payload with standard sku option', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductFormDrawer
        open
        mode="create"
        product={null}
        categories={categories}
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText('商品名称'), 'C3 演示商品');
    await user.click(screen.getByLabelText('商品分类'));
    await user.click(await screen.findByText('效率办公'));
    await user.type(screen.getByLabelText('商品图片'), 'https://dummyimage.com/640x480/e8eef3/203244&text=C3');
    await user.type(screen.getByLabelText('商品价格'), '288');
    await user.type(screen.getByLabelText('商品库存'), '12');
    await user.click(screen.getByRole('button', { name: '保存商品' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      id: undefined,
      name: 'C3 演示商品',
      categoryId: 'cat-digital-office',
      price: 288,
      stock: 12,
      image: 'https://dummyimage.com/640x480/e8eef3/203244&text=C3',
      status: 'online',
      tags: [],
      skuOptions: [
        {
          id: 'new-standard',
          name: '标准版',
          stock: 12,
          price: 288,
        },
      ],
      description: '',
    });
  });

  it('syncs edited price and stock into existing sku options', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductFormDrawer
        open
        mode="edit"
        product={firstProduct}
        categories={categories}
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    await user.clear(screen.getByLabelText('商品价格'));
    await user.type(screen.getByLabelText('商品价格'), '688');
    await user.clear(screen.getByLabelText('商品库存'));
    await user.type(screen.getByLabelText('商品库存'), '66');
    await user.click(screen.getByRole('button', { name: '保存商品' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0].skuOptions).toEqual([
      { id: 'p-001-standard', name: '标准版', stock: 66, price: 688 },
      { id: 'p-001-pro', name: '进阶版', stock: 66, price: 688 },
    ]);
  });

  it('refreshes form values when product changes while drawer remains open', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { rerender } = render(
      <ProductFormDrawer
        open
        mode="edit"
        product={firstProduct}
        categories={categories}
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByLabelText('商品名称')).toHaveValue('曜石无线降噪耳机');

    rerender(
      <ProductFormDrawer
        open
        mode="edit"
        product={secondProduct}
        categories={categories}
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => expect(screen.getByLabelText('商品名称')).toHaveValue('雾银桌面拓展坞'));
    expect(screen.getByLabelText('商品价格')).toHaveValue('329.00');
    expect(screen.getByLabelText('商品库存')).toHaveValue('56');

    await user.click(screen.getByRole('button', { name: '保存商品' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      id: 'p-002',
      name: '雾银桌面拓展坞',
      price: 329,
      stock: 56,
    });
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

  it('clears shipment form values after close and reopen', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const { rerender } = render(
      <OrderShipModal open orderId="ORD_TEST" onClose={onClose} onSubmit={onSubmit} />,
    );

    await user.type(screen.getByLabelText('物流公司'), '顺丰速运');
    await user.type(screen.getByLabelText('物流单号'), 'SF1000000001');

    rerender(<OrderShipModal open={false} orderId="ORD_TEST" onClose={onClose} onSubmit={onSubmit} />);
    rerender(<OrderShipModal open orderId="ORD_TEST" onClose={onClose} onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getByLabelText('物流公司')).toBeInTheDocument());
    expect(screen.getByLabelText('物流公司')).toHaveValue('');
    expect(screen.getByLabelText('物流单号')).toHaveValue('');
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

  it('renders page header card content and extra action', () => {
    render(
      <PageHeaderCard
        title="商品管理"
        description="维护商品信息"
        extra={<button type="button">新增商品</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: '商品管理' })).toBeInTheDocument();
    expect(screen.getByText('维护商品信息')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新增商品' })).toBeInTheDocument();
  });
});
