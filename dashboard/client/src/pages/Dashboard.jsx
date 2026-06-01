export default function Dashboard({ user }) {
  const cards = [
    { icon: "🏆", label: "Leaderboard", desc: "View top XP users", link: "/leaderboard", color: "#f59e0b" },
    { icon: "📊", label: "Stats", desc: "Server statistics", link: "/stats", color: "#06b6d4" },
    { icon: "👥", label: "Users", desc: "Manage user XP", link: "/users", color: "#10b981" },
  ];

  return (
    <div style={{ padding: "40px 32px" }}>
      <h1 style={{ color: "#a78bfa", marginBottom: "8px" }}>Welcome back, {user.username}! 👋</h1>
      <p style={{ color: "#94a3b8", marginBottom: "40px" }}>Manage your AnimeNewsBot from here.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        {cards.map(card => (
          <a key={card.label} href={card.link} style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, #1e1b4b, #302b63)",
              border: `1px solid ${card.color}`,
              borderRadius: "16px", padding: "28px", cursor: "pointer",
              transition: "transform 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>{card.icon}</div>
              <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "18px" }}>{card.label}</div>
              <div style={{ color: "#94a3b8", marginTop: "4px" }}>{card.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}