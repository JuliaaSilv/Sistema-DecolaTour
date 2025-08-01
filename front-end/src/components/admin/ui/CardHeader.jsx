export default function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`border-b px-4 py-2 ${className}`} {...props}>
      {children}
    </div>
  );
}