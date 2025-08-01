export default function TabsList({ children, className = "", ...props }) {
  return (
    <div className={`flex ${className}`} {...props}>
      {children}
    </div>
  );
}