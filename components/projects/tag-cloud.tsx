"use client";

import { useState } from "react";

const DEFAULT_VISIBLE = 15;

export function TagCloud({
  legend,
  options,
  active,
  onToggle,
}: {
  legend: string;
  options: string[];
  active: string[];
  onToggle: (value: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  if (options.length === 0) return null;

  const visibleOptions = showAll ? options : options.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = options.length - visibleOptions.length;

  return (
    <fieldset className="flex flex-wrap items-center gap-1.5">
      <legend className="sr-only">{legend}</legend>
      {visibleOptions.map((option) => {
        const isActive = active.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(option)}
            className={`rounded-full border border-border px-2 py-0.5 text-xs transition-colors ${
              isActive
                ? "border-accent bg-accent font-semibold text-background"
                : "font-normal text-muted hover:text-foreground"
            }`}
          >
            {option}
          </button>
        );
      })}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted hover:text-foreground"
        >
          +{hiddenCount} more
        </button>
      )}
      {showAll && options.length > DEFAULT_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted hover:text-foreground"
        >
          Show fewer
        </button>
      )}
    </fieldset>
  );
}
