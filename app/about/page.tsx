export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          আমার সম্পর্কে
        </h1>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            আমি রাহাত হোসেন হিমেল। সফটওয়্যার ইঞ্জিনিয়ারিং নিয়ে পড়াশোনা করছি
            এবং প্রযুক্তি নিয়ে লিখতে ভালোবাসি।
          </p>
          <p className="text-muted-foreground">
            এই ব্লগে আমি প্রযুক্তি, প্রোগ্রামিং এবং দৈনন্দিন জীবনের বিভিন্ন
            বিষয় নিয়ে লিখি।
          </p>
        </div>
      </div>
    </main>
  );
}
