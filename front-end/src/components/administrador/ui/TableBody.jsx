export default function TableBody({ children, className = "", ...props }) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}
