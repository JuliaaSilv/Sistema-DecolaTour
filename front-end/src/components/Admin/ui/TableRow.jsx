export default function TableRow({ children, className = "", ...props }) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}