import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HelpCircleIcon,
  ArrowRight01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { SectionIntro } from "@/components/shared/section-intro";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  resolveIcon,
  type HelpData,
  type FeaturesSection,
  type WorkflowSection,
  type TipsSection,
  type FaqSection,
} from "@/lib/help";
import helpData from "@/content/help.json";

export const metadata: Metadata = {
  title: "Help",
  description: "How to use behind the TechZ effectively.",
};

const data = helpData as HelpData;

// ─── Section renderers ────────────────────────────────────────────────────────

function FeaturesAccordion({ section }: { section: FeaturesSection }) {
  return (
    <Accordion multiple>
      {section.items.map((item) => (
        <AccordionItem key={item.title} value={item.title}>
          <AccordionTrigger>
            <span className="flex items-center gap-2.5">
              <HugeiconsIcon
                icon={resolveIcon(item.icon)}
                className="size-4 shrink-0 text-muted-foreground"
                strokeWidth={2}
              />
              {item.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="pl-6.5 text-muted-foreground">{item.description}</p>
            <Link
              href={item.href}
              className="mt-3 ml-6.5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {item.cta}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-3.5"
                strokeWidth={2}
              />
            </Link>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function WorkflowAccordion({ section }: { section: WorkflowSection }) {
  return (
    <Accordion multiple>
      {section.items.map((step, index) => (
        <AccordionItem key={step.title} value={step.title}>
          <AccordionTrigger>
            <span className="flex items-center gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <span className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={2}
                />
                {step.title}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="pl-7.5 text-muted-foreground">{step.description}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function TipsList({ section }: { section: TipsSection }) {
  return (
    <ol className="space-y-3">
      {section.items.map((tip, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/60 text-[11px] font-semibold tabular-nums text-muted-foreground">
            {index + 1}
          </span>
          <p className="pt-0.5 text-sm leading-6 text-muted-foreground">{tip}</p>
        </li>
      ))}
    </ol>
  );
}

function FaqAccordion({ section }: { section: FaqSection }) {
  return (
    <Accordion multiple>
      {section.items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger>
            <span className="flex items-center gap-2.5">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                className="size-4 shrink-0 text-muted-foreground"
                strokeWidth={2}
              />
              {item.question}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="pl-6.5 text-muted-foreground">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function renderSection(section: HelpData["sections"][number]) {
  switch (section.type) {
    case "features":
      return <FeaturesAccordion section={section} />;
    case "workflow":
      return <WorkflowAccordion section={section} />;
    case "tips":
      return <TipsList section={section} />;
    case "faq":
      return <FaqAccordion section={section} />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 md:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={HelpCircleIcon} className="size-6" strokeWidth={2} />
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {data.header.title}
          </h1>
        </div>
        <p className="max-w-2xl text-muted-foreground">{data.header.description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {data.quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <HugeiconsIcon
                icon={resolveIcon(link.icon)}
                className="size-4"
                strokeWidth={2}
              />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Sections */}
      {data.sections.map((section) => (
        <section key={section.id} className="space-y-4">
          <SectionIntro
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
          />
          {renderSection(section)}
        </section>
      ))}
    </div>
  );
}
