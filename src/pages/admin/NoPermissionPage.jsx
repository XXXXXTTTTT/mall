import { Result } from 'antd';

export function NoPermissionPage() {
  return <Result status="403" title="无权限" subTitle="当前后台账号无权访问该模块" />;
}
