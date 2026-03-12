type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionIntro({ eyebrow, title, description }: Props) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-end md:justify-between md:gap-4">
      <div className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-1 max-w-[14ch] text-2xl font-semibold tracking-tight text-foreground text-balance sm:max-w-none md:text-xl">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-md text-sm leading-6 text-muted-foreground md:text-right">
          {description}
        </p>
      ) : null}
    </div>
  );
}
