import {
  HelpCircleIcon,
  Search01Icon,
  Bookmark02Icon,
  ChartBubble02Icon,
  LinkSquare02Icon,
  BookOpen01Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  SparklesIcon,
  Notification03Icon,
  Tag01Icon,
  RssIcon,
} from "@hugeicons/core-free-icons";

// ─── Icon registry ────────────────────────────────────────────────────────────
// Add any new icon name here when you reference it in help.json.

export const HELP_ICONS: Record<
  string,
  React.ComponentProps<
    typeof import("@hugeicons/react").HugeiconsIcon
  >["icon"]
> = {
  HelpCircleIcon,
  Search01Icon,
  Bookmark02Icon,
  ChartBubble02Icon,
  LinkSquare02Icon,
  BookOpen01Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  SparklesIcon,
  Notification03Icon,
  Tag01Icon,
  RssIcon,
};

export function resolveIcon(name: string) {
  return HELP_ICONS[name] ?? HelpCircleIcon;
}

// ─── JSON shape types ─────────────────────────────────────────────────────────

export type HelpHeader = {
  title: string;
  description: string;
};

export type HelpQuickLink = {
  label: string;
  href: string;
  icon: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  href: string;
  cta: string;
};

export type WorkflowItem = {
  title: string;
  description: string;
  icon: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

type BaseSection = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
};

export type FeaturesSection = BaseSection & {
  type: "features";
  items: FeatureItem[];
};

export type WorkflowSection = BaseSection & {
  type: "workflow";
  items: WorkflowItem[];
};

export type TipsSection = BaseSection & {
  type: "tips";
  items: string[];
};

export type FaqSection = BaseSection & {
  type: "faq";
  items: FaqItem[];
};

export type HelpSection =
  | FeaturesSection
  | WorkflowSection
  | TipsSection
  | FaqSection;

export type HelpData = {
  header: HelpHeader;
  quickLinks: HelpQuickLink[];
  sections: HelpSection[];
};
