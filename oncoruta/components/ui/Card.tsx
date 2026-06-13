import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className, title, description }: CardProps) {
  return (
    <div className={cn("bg-white rounded-lg border border-border shadow-sm", className)}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-border">
          {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
