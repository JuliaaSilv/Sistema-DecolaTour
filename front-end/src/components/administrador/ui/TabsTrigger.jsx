export default function TabsTrigger({ children, className = "", ...props }) {
  return (
    <button className={`px-4 py-2 focus:outline-none ${className}`} {...props}>
      {children}
    </button>
  );
}