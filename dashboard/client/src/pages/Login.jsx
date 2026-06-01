export default function Login() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", gap: "24px"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "64px" }}>🎌</div>
        <h1 style={{ color: "#a78bfa", fontSize: "32px", marginBottom: "8px" }}>AnimeBot Dashboard</h1>
        <p style={{ color: "#94a3b8" }}>Manage your Discord bot from one place</p>
      </div>
      <a href="/auth/discord" style={{
        background: "#5865F2", color: "#fff", padding: "14px 32px",
        borderRadius: "12px", textDecoration: "none", fontWeight: "bold",
        fontSize: "18px", display: "flex", alignItems: "center", gap: "10px"
      }}>
        <span>🔑</span> Login with Discord
      </a>
    </div>
  );
}