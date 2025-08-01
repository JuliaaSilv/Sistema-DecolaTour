export default function Button({ children, className = "", ...props }) {
  return (
    <button className={`px-4 py-2 rounded transition cursor-pointer ${className}`} {...props}>
      {children}
    </button>
  );
}