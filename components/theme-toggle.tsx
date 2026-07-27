"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const CYCLE = ["light", "dark", "system"] as const;

const ICON: Record<(typeof CYCLE)[number], typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Client-only mount flag, the documented next-themes hydration guard --
  // there is no external system to synchronize with here, only a one-time
  // "hydration happened" signal, so a post-mount setState is intentional.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Pre-mount: render a same-sized, disabled placeholder instead of null,
  // so the button never pops into existence and shifts layout (CLS).
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted"
      />
    );
  }

  const current = (theme as (typeof CYCLE)[number]) ?? "system";
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
  const Icon = ICON[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${current}. Switch to ${next}`}
      aria-pressed={current === "dark"}
      title={`Theme: ${current} (click for ${next})`}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-all duration-200 hover:scale-105 hover:border-accent hover:text-accent"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
