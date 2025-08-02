export default function TableHead({ children, className = "", ...props }) {
  return (
    <th className={`px-4 py-2 text-left font-semibold ${className}`} {...props}>
      {children}
    </th>
  );
}