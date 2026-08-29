import { cn } from "@/lib/utils";

type BrutalCardProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: string;
};

export function BrutalCard({ className, color = "bg-white", children, ...props }: BrutalCardProps) {
  return (
    <div className={cn("brutal-card rounded-2xl p-4", color, className)} {...props}>
      {children}
    </div>
  );
}
