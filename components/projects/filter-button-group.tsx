"use client";

import { useRef, type KeyboardEvent } from "react";

export function FilterButtonGroup({
  legend,
  options,
  active,
  onChange,
}: {
  legend: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  const allOptions = ["All", ...options];
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % allOptions.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (index - 1 + allOptions.length) % allOptions.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = allOptions.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(allOptions[nextIndex]);
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={legend} className="flex flex-wrap items-center gap-2">
      {allOptions.map((option, index) => {
        const isActive = active === option;
        return (
          <button
            key={option}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`rounded-full border border-border px-3 py-1 text-xs transition-colors ${
              isActive
                ? "border-accent bg-accent font-semibold text-background"
                : "font-normal text-muted hover:text-foreground"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
