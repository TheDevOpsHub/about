export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow && (
        <span className="text-sm font-medium uppercase tracking-wide text-accent-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="max-w-2xl text-muted">{description}</p>}
    </div>
  );
}
