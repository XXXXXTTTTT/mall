import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export function NoPermissionPage() {
  return (
    <Result
      extra={
        <Button type="primary">
          <Link to="/admin/dashboard">返回数据看板</Link>
        </Button>
      }
      status="403"
      subTitle="当前后台账号无权访问该模块"
      title="无权限"
    />
  );
}
