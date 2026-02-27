type Params = { slug: string };

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight capitalize">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="text-muted-foreground">
          এই ক্যাটাগরিতে কোনো পোস্ট পাওয়া যায়নি।
        </p>
      </div>
    </main>
  );
}
