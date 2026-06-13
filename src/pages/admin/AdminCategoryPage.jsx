import { Alert, Button, Space, Switch, Table, Tag } from 'antd';
import { useState } from 'react';
import { AdminSurfaceCard } from '../../components/admin/AdminSurfaceCard.jsx';
import { CategoryFormModal } from '../../components/admin/CategoryFormModal.jsx';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { categoryService } from '../../mock/mockService.js';

export function AdminCategoryPage() {
  const [categories, setCategories] = useState(categoryService.listCategoryTreeSync());
  const [errorMessage, setErrorMessage] = useState('');
  const [modalMode, setModalMode] = useState('create');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);

  function refreshCategories() {
    setCategories(categoryService.listCategoryTreeSync());
  }

  async function handleToggle(category, checked) {
    const result = await categoryService.toggleCategoryStatus(category.id, checked);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage('');
    refreshCategories();
  }

  async function handleDelete(category) {
    const result = await categoryService.deleteCategory(category.id);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage('');
    refreshCategories();
  }

  async function handleSubmit(values) {
    const result = modalMode === 'edit'
      ? await categoryService.updateCategory(currentCategory.id, values)
      : await categoryService.createCategory({ ...values, parentId: parentCategory?.id || null });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }
    setCurrentCategory(null);
    setParentCategory(null);
    setErrorMessage('');
    refreshCategories();
  }

  const columns = [
    { title: '分类名称', dataIndex: 'name', key: 'name' },
    { title: '分类标识', dataIndex: 'id', key: 'id' },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_, category) => (
        <Switch
          aria-label={`切换分类状态 ${category.name}`}
          checked={category.isActive}
          checkedChildren="上架"
          unCheckedChildren="停用"
          onChange={(checked) => handleToggle(category, checked)}
        />
      ),
    },
    {
      title: '标签',
      key: 'tag',
      render: (_, category) => (
        <Tag color={category.parentId ? 'blue' : 'purple'}>{category.parentId ? '二级分类' : '一级分类'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, category) => (
        <Space wrap>
          <Button
            type="link"
            aria-label={`编辑分类 ${category.name}`}
            onClick={() => {
              setModalMode('edit');
              setCurrentCategory(category);
              setParentCategory(null);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            aria-label={`新增子分类 ${category.name}`}
            onClick={() => {
              setModalMode('create');
              setCurrentCategory(null);
              setParentCategory(category);
            }}
          >
            新增子分类
          </Button>
          <Button type="link" danger aria-label={`删除分类 ${category.name}`} onClick={() => handleDelete(category)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} className="!flex">
      <PageHeaderCard title="分类管理" description="以树形方式维护一级与二级分类，刷新后状态与结构保持不丢失。" />
      {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}
      <AdminSurfaceCard>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={categories}
          pagination={false}
          expandable={{ defaultExpandAllRows: true }}
        />
      </AdminSurfaceCard>
      <CategoryFormModal
        open={Boolean(currentCategory) || Boolean(parentCategory)}
        mode={modalMode}
        category={currentCategory}
        parentCategory={parentCategory}
        onClose={() => {
          setCurrentCategory(null);
          setParentCategory(null);
        }}
        onSubmit={handleSubmit}
      />
    </Space>
  );
}
