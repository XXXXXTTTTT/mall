import { Space, Table } from 'antd';
import { PageHeaderCard } from '../../components/admin/PageHeaderCard.jsx';
import { categoryService } from '../../mock/mockService.js';

export function AdminCategoryPage() {
  const categories = categoryService.listCategoriesSync();

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <PageHeaderCard title="分类管理" description="当前阶段为只读展示，方便核对类目结构。" />
      <Table
        columns={[
          { title: '分类名称', dataIndex: 'name', key: 'name' },
          { title: '分类标识', dataIndex: 'id', key: 'id' },
          { title: '父级分类', dataIndex: 'parentId', key: 'parentId', render: (value) => value || '顶级分类' },
          { title: '排序', dataIndex: 'sort', key: 'sort' },
        ]}
        dataSource={categories}
        pagination={false}
        rowKey="id"
      />
    </Space>
  );
}
