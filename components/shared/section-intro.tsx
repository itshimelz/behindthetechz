type Props = {
  eyebrow?: string;
  title: string;
};

export function SectionIntro({ eyebrow, title }: Props) {
  return (
    <div className="relative my-4 sm:my-6 w-full overflow-hidden rounded-xl bg-zinc-950 text-zinc-100 dark:bg-zinc-800/90 dark:text-zinc-100 border border-zinc-900 dark:border-zinc-700/60 py-4 sm:py-5 px-4 sm:px-6 md:px-8 [clip-path:polygon(0_0.6rem,100%_0,100%_calc(100%-0.6rem),0_100%)] shadow-sm">
      <div className="space-y-1.5">
        {eyebrow && (
          <div className="w-fit">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 border-b-2 border-emerald-500 pb-0.5 inline-block">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-zinc-100">
          {title}
        </h2>
      </div>
    </div>
  );
}
