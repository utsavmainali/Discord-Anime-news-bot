import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard", { credentials: "include" })
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); });
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ padding: "40px 32px" }}>
      <h1 style={{ color: "#a78bfa", marginBottom: "24px" }}>🏆 XP Leaderboard</h1>
      {loading ? <p style={{ color: "#94a3b8" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "700px" }}>
          {users.map((u, i) => (
            <div key={u.userId} style={{
              background: "linear-gradient(135deg, #1e1b4b, #302b63)",
              border: i < 3 ? "1px solid #7c3aed" : "1px solid #334155",
              borderRadius: "12px", padding: "16px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "24px", minWidth: "36px" }}>{medals[i] || `#${i + 1}`}</span>
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: "bold" }}>{u.userId}</div>
                  <div style={{ color: "#94a3b8", fontSize: "13px" }}>Level {u.level}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#a78bfa", fontWeight: "bold" }}>{u.xp} XP</div>
                <div style={{
                  background: "#1e1b4b", borderRadius: "6px", height: "6px",
                  width: "100px", marginTop: "6px", overflow: "hidden"
                }}>
                  <div style={{
                    background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                    height: "100%", width: `${Math.min((u.xp / (u.level * 100)) * 100, 100)}%`
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}