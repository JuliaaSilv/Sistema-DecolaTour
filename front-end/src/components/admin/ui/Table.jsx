export default function Table({ children, className = "", ...props }) {
  return (
    <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props}>
      {children}
    </table>
  );
}