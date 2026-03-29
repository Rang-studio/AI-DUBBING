import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("safe-wrap soft-panel shadow-card", className)} {...props} />
  );
}
