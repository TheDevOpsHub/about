export function OgTemplate({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0b1120, #131c31)",
        color: "#f1f5f9",
      }}
    >
      <div style={{ fontSize: 30, color: "#22d3ee", display: "flex" }}>TheDevOpsHub</div>
      <div style={{ fontSize: 64, fontWeight: 700, marginTop: 12, display: "flex" }}>
        {title}
      </div>
      <div style={{ fontSize: 28, marginTop: 16, color: "#94a3b8", display: "flex" }}>
        {subtitle}
      </div>
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
