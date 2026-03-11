export default function TagsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2 mb-8">
        <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-72 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="mx-auto w-full max-w-4xl flex flex-wrap gap-3">
        {[80, 96, 64, 112, 72, 88, 104, 68, 92, 76, 84, 100].map((w, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-lg bg-muted"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
    </div>
  );
}
