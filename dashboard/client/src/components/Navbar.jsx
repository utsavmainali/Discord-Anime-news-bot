import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user }) {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "🏠 Home" },
    { to: "/leaderboard", label: "🏆 Leaderboard" },
    { to: "/stats", label: "📊 Stats" },
    { to: "/users", label: "👥 Users" },
  ];

  const style = {
    nav: {
      background: "linear-gradient(90deg, #0f0c29, #302b63)",
      borderBottom: "1px solid #7c3aed",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logo: { color: "#a78bfa", fontWeight: "bold", fontSize: "20px", textDecoration: "none" },
    links: { display: "flex", gap: "8px" },
    link: (active) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      textDecoration: "none",
      color: active ? "#ffffff" : "#94a3b8",
      background: active ? "#7c3aed" : "transparent",
      fontWeight: active ? "bold" : "normal",
      transition: "all 0.2s",
    }),
    user: { display: "flex", alignItems: "center", gap: "10px" },
    avatar: { width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #7c3aed" },
    logout: {
      padding: "6px 14px", borderRadius: "8px", background: "#ef4444",
      color: "#fff", textDecoration: "none", fontSize: "14px"
    }
  };

  return (
    <nav style={style.nav}>
      <Link to="/dashboard" style={style.logo}>🎌 AnimeBot Dashboard</Link>
      <div style={style.links}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={style.link(location.pathname === l.to)}>{l.label}</Link>
        ))}
      </div>
      <div style={style.user}>
        <img src={user.avatar} alt="avatar" style={style.avatar} />
        <span style={{ color: "#e2e8f0" }}>{user.username}</span>
        <a href="/auth/logout" style={style.logout}>Logout</a>
      </div>
    </nav>
  );
}