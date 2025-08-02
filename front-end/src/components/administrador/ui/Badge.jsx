export default function Badge({ children, className = "", ...props }) {
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${className}`} {...props}>
      {children}
    </span>
  );
}