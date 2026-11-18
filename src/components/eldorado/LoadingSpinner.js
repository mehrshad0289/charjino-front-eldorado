const SIZES = {
  inline: 18,
  block: 40,
  page: 56,
};

export function Spinner({ size = SIZES.block, className = "" }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-current/25 border-t-current" />
      <span className="absolute inset-[22%] animate-pulse rounded-md bg-current" />
    </span>
  );
}

export default function LoadingSpinner({ variant = "block", size, className = "" }) {
  const spinnerSize = size ?? SIZES[variant] ?? SIZES.block;
  const tone = variant === "inline" ? "" : "text-brand";

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center justify-center  ${className}`.trim()} role="status" aria-live="polite">
        <Spinner size={spinnerSize} />
        <span className="sr-only">بارگذاری</span>
      </span>
    );
  }

  return (
    <div
      className={`grid w-full place-items-center ${tone} ${variant === "page" ? "min-h-[50vh] py-16" : "px-4 py-8"} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <Spinner size={spinnerSize} />
      <span className="sr-only">بارگذاری</span>
    </div>
  );
}
