type Params = { slug: string };

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <article className="prose mx-auto w-full max-w-3xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {slug}
        </h1>
        <p className="text-muted-foreground">এই পোস্টটি শীঘ্রই প্রকাশিত হবে।</p>
      </article>
    </main>
  );
}
