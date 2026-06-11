export function GlassBar({ as: Component = 'div', children, className = '', ...props }) {
  return (
    <Component
      className={`rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_18px_48px_rgba(24,36,51,0.12)] backdrop-blur-md ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
