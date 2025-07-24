export default function DropdownMenuSeparator({ className = "", ...props }) {
  return (
    <div className={`border-t my-1 ${className}`} {...props} />
  );
}