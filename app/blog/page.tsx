export default function BlogPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          সব পোস্ট
        </h1>
        <p className="text-muted-foreground">
          সাম্প্রতিক লেখাগুলো এখানে পাবেন।
        </p>
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-muted-foreground text-sm">
          কোনো পোস্ট এখনো প্রকাশ করা হয়নি।
        </p>
      </div>
    </main>
  );
}
