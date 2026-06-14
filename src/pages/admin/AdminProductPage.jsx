// 后台商品管理页。
import { Alert, Button, Image, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { ProductFormDrawer } from '../../components/admin/ProductFormDrawer.jsx';
import { categoryService, productService } from '../../mock/mockService.js';

// 构建分类编号到展示名称的映射表。
function buildCategoryMap(categories) {
  return categories.reduce((map, category) => {
    const parent = categories.find((item) => item.id === category.parentId);
    map[category.id] = parent ? `${parent.name} / ${category.name}` : category.name;
    return map;
  }, {});
}

// 渲染后台商品管理页并处理分页、筛选和编辑。
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
  const [errorMessage, setErrorMessage] = useState('');
  const categories = categoryService.listCategoriesSync();
  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories]);

  // 按当前筛选条件加载商品分页数据。
  async function loadProducts(nextPage = page, nextPageSize = pageSize) {
    const result = await productService.listPagedProducts({
      page: nextPage,
      pageSize: nextPageSize,
      keyword,
      status,
      categoryId,
    });
    if (result.success) {
      setErrorMessage('');
      setProducts(result.data.list);
      setTotal(result.data.total);
      setPage(result.data.page);
      setPageSize(result.data.pageSize);
      return;
    }
    setErrorMessage(result.message);
  }

  useEffect(() => {
    let isCurrent = true;

    // 在筛选变化后刷新第一页商品列表。
    async function refreshProducts() {
      const result = await productService.listPagedProducts({
        page: 1,
        pageSize,
        keyword,
        status,
        categoryId,
      });
      if (!isCurrent) return;
      if (result.success) {
        setErrorMessage('');
        setProducts(result.data.list);
        setTotal(result.data.total);
        setPage(result.data.page);
        setPageSize(result.data.pageSize);
        return;
      }
      setErrorMessage(result.message);
    }

    void refreshProducts();

    return () => {
      isCurrent = false;
    };
  }, [categoryId, keyword, pageSize, status]);

  // 以新增模式打开商品抽屉。
  function openCreateDrawer() {
    setDrawerMode('create');
    setCurrentProduct(null);
    setDrawerOpen(true);
  }

  // 载入商品数据并打开编辑抽屉。
  function openEditDrawer(product) {
    setDrawerMode('edit');
    setCurrentProduct(product);
    setDrawerOpen(true);
  }

  // 提交商品新增或编辑结果。
  async function handleSubmit(payload) {
    const result =
      drawerMode === 'edit'
        ? await productService.updateProduct(payload)
        : await productService.createProduct(payload);
    if (result.success) {
      setErrorMessage('');
      setDrawerOpen(false);
      setCurrentProduct(null);
      await loadProducts(1, pageSize);
      return;
    }
    setErrorMessage(result.message);
  }

  // 删除指定商品并刷新列表。
  async function handleDelete(productId) {
    const result = await productService.deleteProduct(productId);
    if (result.success) {
      setErrorMessage('');
      await loadProducts(1, pageSize);
      return;
    }
    setErrorMessage(result.message);
  }

  // 切换商品上下架状态。
  async function handleToggle(product, nextStatus) {
    const result = await productService.toggleProductStatus(product.id, nextStatus);
    if (result.success) {
      setErrorMessage('');
      await loadProducts(page, pageSize);
      return;
    }
    setErrorMessage(result.message);
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
      {errorMessage ? <Alert message={errorMessage} showIcon type="error" /> : null}
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
