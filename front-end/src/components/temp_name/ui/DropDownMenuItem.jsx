export default function DropdownMenuItem({ children, className = "", ...props }) {
  return (
    <div className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}