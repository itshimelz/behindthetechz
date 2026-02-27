type Props = {
  message?: string;
};

export function EmptyState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-muted-foreground text-sm">
        {message || "No posts published yet."}
      </p>
    </div>
  );
}
