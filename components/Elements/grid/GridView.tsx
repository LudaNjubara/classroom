import { cn } from "@/utils/cn";

type TGridViewProps = {
  children: React.ReactNode;
  className?: string;
};

export function GridView({ children, className }: TGridViewProps) {
  return (
    <section className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {children}
    </section>
  );
}
