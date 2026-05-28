import { cn } from "@/libs/utils/cn";

type Props = {
  size?: "sm" | "md";
  variant?: "light" | "dark";
  className?: string;
};

export function BrandMark({ size = "md", variant = "light", className }: Props) {
  const dims = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-xl font-bold tracking-tight",
        "bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white",
        "shadow-[inset_0_-2px_4px_rgba(0,0,0,0.18),0_8px_18px_-6px_rgba(99,102,241,0.55)]",
        dims,
        className
      )}
      aria-hidden
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">T</span>
      {variant === "light" && (
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      )}
    </div>
  );
}
