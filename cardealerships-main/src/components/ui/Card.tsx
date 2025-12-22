// Card component placeholder
// TODO: Implement styled card with variants

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={className}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
