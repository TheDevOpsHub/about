import { SORT_OPTIONS, type SortBy } from "@/lib/filter-projects";

const SORT_LABEL: Record<SortBy, string> = {
  default: "Curated order",
  updated: "Recently updated",
  stars: "Most stars",
  name: "Name (A-Z)",
};

export function SortSelect({
  value,
  onChange,
}: {
  value: SortBy;
  onChange: (value: SortBy) => void;
}) {
  return (
    <div>
      <label htmlFor="project-sort" className="sr-only">
        Sort projects
      </label>
      <select
        id="project-sort"
        value={value}
        onChange={(event) => onChange(event.target.value as SortBy)}
        className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            Sort: {SORT_LABEL[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
