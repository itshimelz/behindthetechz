import type { Metadata } from "next";
import { UnsubscribeForm } from "./unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe | behind the TechZ",
  description: "Unsubscribe from the behind the TechZ newsletter.",
};

export default function UnsubscribePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Unsubscribe
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter the email you subscribed with and we&apos;ll remove you from
            our mailing list. No questions asked.
          </p>
        </div>
        <UnsubscribeForm />
      </div>
    </div>
  );
}
