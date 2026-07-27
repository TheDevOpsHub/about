export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold text-foreground">{value}</span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
