export default function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-lg font-bold ${className}`} {...props}>
      {children}
    </h3>
  );
}