"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DEBOUNCE_MS = 150;

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  // Keep the field in sync when the parent clears the query externally
  // (the "Clear all filters" action), without disrupting local typing.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    const id = setTimeout(() => onChange(draft), DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className="relative">
      <label htmlFor="project-search" className="sr-only">
        Search projects
      </label>
      <input
        id="project-search"
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search projects by name, tag, or description..."
        className="w-full rounded-md border border-border bg-surface px-4 py-2 pr-9 text-sm text-foreground placeholder:text-muted focus:border-accent"
      />
      {draft && (
        <button
          type="button"
          onClick={() => setDraft("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
