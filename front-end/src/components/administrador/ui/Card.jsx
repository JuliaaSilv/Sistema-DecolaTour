function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-lg shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;