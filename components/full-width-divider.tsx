import { cn } from "@/lib/utils";

interface FullWidthDividerProps {
  position?: "top" | "bottom" | "center";
  className?: string;
}

export function FullWidthDivider({ position = "center", className }: FullWidthDividerProps) {
  return (
    <div
      className={cn(
        "w-full h-px bg-border/40",
        {
          "absolute top-0 inset-x-0": position === "top",
          "absolute bottom-0 inset-x-0": position === "bottom",
        },
        className
      )}
    />
  );
}
