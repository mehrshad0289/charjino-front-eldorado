export function Skeleton({ className = "" }) {
  return <span className={`block animate-pulse rounded-md bg-[rgb(231,231,231)] ${className}`.trim()} />;
}

export function DashboardContentSkeleton() {
  return (
    <div className="px-6 pb-[50px]" role="status" aria-live="polite">
      <span className="sr-only">بارگذاری</span>
      <div className="mt-6 flex items-center gap-3">
        <Skeleton className="size-[30px] rounded-lg" />
        <Skeleton className="h-8 w-52" />
      </div>
      <div className="mt-8 flex flex-wrap gap-2.5">
        <Skeleton className="h-[42px] w-[12.5rem] rounded-lg" />
        <Skeleton className="h-[42px] w-[12.5rem] rounded-lg" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 min-[961px]:grid-cols-2">
        <Skeleton className="h-[96px] w-full rounded-lg" />
        <Skeleton className="h-[96px] w-full rounded-lg" />
        <Skeleton className="h-[96px] w-full rounded-lg" />
        <Skeleton className="h-[96px] w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ChatListSkeleton({ rows = 6 }) {
  return (
    <div className="px-3 py-1" role="status" aria-live="polite">
      <span className="sr-only">بارگذاری</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3 border-b border-cardborder px-1 py-3 last:border-b-0">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatThreadSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 py-2" role="status" aria-live="polite">
      <span className="sr-only">بارگذاری</span>
      <Skeleton className="h-12 w-3/5 self-start rounded-2xl" />
      <Skeleton className="h-11 w-1/2 self-end rounded-2xl" />
      <Skeleton className="h-16 w-2/3 self-start rounded-2xl" />
      <Skeleton className="h-10 w-2/5 self-end rounded-2xl" />
    </div>
  );
}

export function CardGridSkeleton({ cards = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite">
      <span className="sr-only">بارگذاری</span>
      {Array.from({ length: cards }, (_, index) => (
        <Skeleton key={index} className="min-h-40 rounded-lg" />
      ))}
    </div>
  );
}

export default Skeleton;
