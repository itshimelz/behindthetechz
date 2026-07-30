import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  duration?: number;
  offsetY?: number;
};

export function SectionReveal({ children, className }: Props) {
  if (className) {
    return <div className={className}>{children}</div>;
  }
  return <>{children}</>;
}
