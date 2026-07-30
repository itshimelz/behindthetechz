type Props = {
  children: React.ReactNode;
  activePath?: string;
};

export async function BehindTheTechzLayout({ children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <main className="w-full">{children}</main>
    </div>
  );
}
