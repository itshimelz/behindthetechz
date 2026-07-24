"use client";

import { useEffect, useState } from "react";
import { useReadingProgressPreference } from "@/hooks/use-local-storage-pref";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const { enabled } = useReadingProgressPreference();

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      if (docHeight <= winHeight) {
        setProgress(0);
        return;
      }

      const scrollPercent = scrollY / (docHeight - winHeight);
      setProgress(Math.max(0, Math.min(100, scrollPercent * 100)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary dark:bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
