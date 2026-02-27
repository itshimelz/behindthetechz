import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-4 py-8 md:px-8">
      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl space-y-3">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Techzblog
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          প্রযুক্তি, প্রোগ্রামিং এবং দৈনন্দিন ভাবনা নিয়ে আমার ব্যক্তিগত ব্লগ।
        </p>
      </section>

      {/* Featured Posts Placeholder */}
      <section className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">বিশেষ পোস্ট</h2>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            সব দেখুন →
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>শীঘ্রই আসছে</span>
              <Badge variant="secondary">নতুন</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              এখনো কোনো পোস্ট প্রকাশ করা হয়নি। প্রথম পোস্ট শীঘ্রই আসছে!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Latest Posts Placeholder */}
      <section className="mx-auto w-full max-w-4xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          সাম্প্রতিক লেখা
        </h2>
        <div className="bg-muted/40 flex items-center justify-center rounded-xl border border-dashed p-12">
          <p className="text-muted-foreground text-sm">
            কন্টেন্ট যোগ করার পর এখানে সাম্প্রতিক পোস্টগুলো দেখা যাবে।
          </p>
        </div>
      </section>
    </div>
  );
}
