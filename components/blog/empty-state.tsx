import { HugeiconsIcon } from "@hugeicons/react";
import { Notebook01Icon } from "@hugeicons/core-free-icons";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Props = {
  message?: string;
};

export function EmptyState({ message }: Props) {
  return (
    <Empty className="py-14">
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon icon={Notebook01Icon} strokeWidth={1.8} />
        </EmptyMedia>
        <EmptyTitle>No posts found</EmptyTitle>
        <EmptyDescription>
          {message || "No posts published yet."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
