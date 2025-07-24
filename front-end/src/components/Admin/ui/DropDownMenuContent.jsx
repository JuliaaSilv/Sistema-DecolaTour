export default function DropdownMenuContent({ children, className = "", ...props }) {
  return (
    <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${className}`} {...props}>
      {children}
    </div>
  );
}