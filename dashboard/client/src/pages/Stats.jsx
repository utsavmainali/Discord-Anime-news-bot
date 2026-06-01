import { useEffect, useState } from "react";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats", { credentials: "include" })
      .then(r => r.json())
      .then(setStats);
  }, []);

  const cards = stats ? [
    { icon: "👥", label: "Total Users", value: stats.totalUsers, color: "#06b6d4" },
    { icon: "⭐", label: "Avg XP", value: stats.avgXP, color: "#f59e0b" },
    { icon: "🏆", label: "Top User Level", value: stats.topUser?.level || 0, color: "#10b981" },
  ] : [];

  return (
    <div style={{ padding: "40px 32px" }}>
      <h1 style={{ color: "#a78bfa", marginBottom: "24px" }}>📊 Server Stats</h1>
      {!stats ? <p style={{ color: "#94a3b8" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", maxWidth: "700px" }}>
          {cards.map(card => (
            <div key={card.label} style={{
              background: "linear-gradient(135deg, #1e1b4b, #302b63)",
              border: `1px solid ${card.color}`,
              borderRadius: "16px", padding: "28px", textAlign: "center"
            }}>
              <div style={{ fontSize: "40px" }}>{card.icon}</div>
              <div style={{ color: card.color, fontSize: "36px", fontWeight: "bold", margin: "8px 0" }}>{card.value}</div>
              <div style={{ color: "#94a3b8" }}>{card.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}