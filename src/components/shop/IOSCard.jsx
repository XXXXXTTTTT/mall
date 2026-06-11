export function IOSCard({ as: Component = 'div', children, className = '', ...props }) {
  return (
    <Component
      className={`rounded-[2rem] border border-white/75 bg-[#fbfcfa] shadow-[0_20px_54px_rgba(24,36,51,0.1)] ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
