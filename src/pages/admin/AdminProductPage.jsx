import { Button, Image, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { ProductFormDrawer } from '../../components/admin/ProductFormDrawer.jsx';
import { categoryService, productService } from '../../mock/mockService.js';

function buildCategoryMap(categories) {
  return categories.reduce((map, category) => {
    const parent = categories.find((item) => item.id === category.parentId);
    map[category.id] = parent ? `${parent.name} / ${category.name}` : category.name;
    return map;
  }, {});
}

export function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState(undefined);
  const [categoryId, setCategoryId] = useState(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create');
  const [currentProduct, setCurrentProduct] = useState(null);
  const categories = categoryService.listCategoriesSync();
  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories]);

  async function loadProducts(nextPage = page, nextPageSize = pageSize) {
    const result = await productService.listPagedProducts({
      page: nextPage,
      pageSize: nextPageSize,
      keyword,
      status,
      categoryId,
    });
    if (result.success) {
      setProducts(result.data.list);
      setTotal(result.data.total);
      setPage(result.data.page);
      setPageSize(result.data.pageSize);
    }
  }

  useEffect(() => {
    loadProducts(1, pageSize);
  }, [keyword, status, categoryId]);

  function openCreateDrawer() {
    setDrawerMode('create');
    setCurrentProduct(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(product) {
    setDrawerMode('edit');
    setCurrentProduct(product);
    setDrawerOpen(true);
  }

  async function handleSubmit(payload) {
    const result =
      drawerMode === 'edit'
        ? await productService.updateProduct(payload)
        : await productService.createProduct(payload);
    if (result.success) {
      setDrawerOpen(false);
      setCurrentProduct(null);
      await loadProducts(1, pageSize);
    }
  }

  async function handleDelete(productId) {
    const result = await productService.deleteProduct(productId);
    if (result.success) {
      await loadProducts(1, pageSize);
    }
  }

  async function handleToggle(product, nextStatus) {
    const result = await productService.toggleProductStatus(product.id, nextStatus);
    if (result.success) {
      await loadProducts(page, pageSize);
    }
  }

  const columns = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      render: (image, record) => <Image alt={record.name} height={56} src={image} width={56} />,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Typography.Text strong>{name}</Typography.Text>,
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (value) => categoryMap[value] || value,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (value) => `¥ ${value}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <Tag color={value === 'online' ? 'green' : 'default'}>{value === 'online' ? '上架' : '下架'}</Tag>,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, product) => (
        <Space wrap>
          <Button aria-label={`编辑 ${product.name}`} onClick={() => openEditDrawer(product)} type="link">
            编辑
          </Button>
          <Button
            aria-label={product.status === 'online' ? `下架 ${product.name}` : `上架 ${product.name}`}
            onClick={() => handleToggle(product, product.status === 'online' ? 'offline' : 'online')}
            type="link"
          >
            {product.status === 'online' ? '下架' : '上架'}
          </Button>
          <Button aria-label={`删除 ${product.name}`} danger onClick={() => handleDelete(product.id)} type="link">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard
        title="商品管理"
        description="统一维护商品信息、上架状态与库存展示。"
        extra={
          <Button onClick={openCreateDrawer} type="primary">
            新增商品
          </Button>
        }
      />
      <Space wrap>
        <Input
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索商品名称"
          style={{ width: 240 }}
          value={keyword}
        />
        <Select
          allowClear
          onChange={setStatus}
          options={[
            { label: '上架', value: 'online' },
            { label: '下架', value: 'offline' },
          ]}
          placeholder="筛选状态"
          style={{ width: 160 }}
          value={status}
        />
        <Select
          allowClear
          onChange={setCategoryId}
          options={categories.map((category) => ({ label: category.name, value: category.id }))}
          placeholder="筛选分类"
          style={{ width: 180 }}
          value={categoryId}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={products}
        pagination={{
          current: page,
          onChange: (nextPage, nextPageSize) => loadProducts(nextPage, nextPageSize),
          pageSize,
          total,
        }}
        rowKey="id"
      />
      <ProductFormDrawer
        categories={categories}
        mode={drawerMode}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        open={drawerOpen}
        product={currentProduct}
      />
    </Space>
  );
}
