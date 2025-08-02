export default function DropdownMenuTrigger({ children, asChild }) {
  return asChild ? children : <button>{children}</button>;
}
