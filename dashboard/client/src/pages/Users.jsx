import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ xp: 0, level: 1 });

  useEffect(() => {
    fetch("/api/users", { credentials: "include" })
      .then(r => r.json()).then(setUsers);
  }, []);

  const saveUser = async (userId) => {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setUsers(users.map(u => u.userId === userId ? { ...u, ...form } : u));
    setEditing(null);
  };

  const deleteUser = async (userId) => {
    if (!confirm("Reset this user's XP?")) return;
    await fetch(`/api/users/${userId}`, { method: "DELETE", credentials: "include" });
    setUsers(users.filter(u => u.userId !== userId));
  };

  return (
    <div style={{ padding: "40px 32px" }}>
      <h1 style={{ color: "#a78bfa", marginBottom: "24px" }}>👥 Manage Users</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "800px" }}>
        {users.map((u, i) => (
          <div key={u.userId} style={{
            background: "linear-gradient(135deg, #1e1b4b, #302b63)",
            border: "1px solid #334155", borderRadius: "12px", padding: "16px 24px",
          }}>
            {editing === u.userId ? (
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>#{i + 1}</span>
                <input type="number" placeholder="XP" value={form.xp}
                  onChange={e => setForm({ ...form, xp: Number(e.target.value) })}
                  style={{ padding: "6px 10px", borderRadius: "8px", background: "#0f0c29", color: "#fff", border: "1px solid #7c3aed", width: "100px" }} />
                <input type="number" placeholder="Level" value={form.level}
                  onChange={e => setForm({ ...form, level: Number(e.target.value) })}
                  style={{ padding: "6px 10px", borderRadius: "8px", background: "#0f0c29", color: "#fff", border: "1px solid #7c3aed", width: "100px" }} />
                <button onClick={() => saveUser(u.userId)}
                  style={{ padding: "6px 16px", borderRadius: "8px", background: "#10b981", color: "#fff", border: "none", cursor: "pointer" }}>Save</button>
                <button onClick={() => setEditing(null)}
                  style={{ padding: "6px 16px", borderRadius: "8px", background: "#475569", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ color: "#94a3b8", marginRight: "12px" }}>#{i + 1}</span>
                  <span style={{ color: "#e2e8f0", fontWeight: "bold" }}>{u.userId}</span>
                  <span style={{ color: "#a78bfa", marginLeft: "16px" }}>Lv.{u.level}</span>
                  <span style={{ color: "#94a3b8", marginLeft: "12px" }}>{u.xp} XP</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setEditing(u.userId); setForm({ xp: u.xp, level: u.level }); }}
                    style={{ padding: "6px 14px", borderRadius: "8px", background: "#7c3aed", color: "#fff", border: "none", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteUser(u.userId)}
                    style={{ padding: "6px 14px", borderRadius: "8px", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}>Reset</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}