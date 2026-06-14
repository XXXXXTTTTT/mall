// 后台通用卡片容器。
import { Card } from 'antd';

// 统一后台卡片的圆角、阴影和内边距。
export function AdminSurfaceCard({ children, className = '', styles, ...props }) {
  return (
    <Card
      className={`w-full rounded-[28px] border-0 font-sans shadow-[0_20px_60px_rgba(15,23,42,0.08)] ${className}`.trim()}
      styles={{
        body: {
          padding: 24,
          ...(styles?.body || {}),
        },
      }}
      {...props}
    >
      {children}
    </Card>
  );
}
