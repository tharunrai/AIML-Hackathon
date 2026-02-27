"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── 🔴 REPLACE THESE 2 VALUES ───────────────────────────────────────────────
const SUPABASE_URL = "https://rwqtwhzzshfubsibfwpl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cXR3aHp6c2hmdWJzaWJmd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzY0NjAsImV4cCI6MjA4Nzc1MjQ2MH0.2mTFFQdUtMTdkFSNJg_StMVSo9SsRNXBPrxQS4G48xY";
// Find these in: Supabase Dashboard → Settings → API
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function TestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // Step 1: Login with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("❌ " + authError.message);
      setLoading(false);
      return;
    }

    setUser(data.user);

    // Step 2: Fetch profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      setError("⚠️ Logged in but profile not found: " + profileError.message);
    } else {
      setProfile(profileData);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setEmail("");
    setPassword("");
  };

  // ── Logged In View ──────────────────────────────────────────────────────────
  if (user && profile) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successBadge}>✅ Supabase Connected Successfully!</div>

          <h2 style={styles.title}>Welcome, {profile.full_name || "User"}</h2>

          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span style={styles.infoKey}>Email</span>
              <span style={styles.infoVal}>{user.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoKey}>Role</span>
              <span style={{
                ...styles.badge,
                background: profile.role === "admin" ? "#fef3c7" : "#dbeafe",
                color: profile.role === "admin" ? "#92400e" : "#1e40af",
              }}>
                {profile.role === "admin" ? "🛡 Admin" : "🎓 Student"}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoKey}>Department</span>
              <span style={styles.infoVal}>{profile.department || "Not set"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoKey}>Year</span>
              <span style={styles.infoVal}>{profile.year || "Not set"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoKey}>User ID</span>
              <span style={{ ...styles.infoVal, fontSize: 11, color: "#9ca3af" }}>{user.id}</span>
            </div>
          </div>

          <div style={styles.nextStep}>
            🎉 Everything is working!<br />
            Auth ✅ → Profiles table ✅ → Role detection ✅
          </div>

          <button style={styles.btnLogout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ── Login Form ──────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🏆</div>
        <h2 style={styles.title}>NBA Achievement System</h2>
        <p style={styles.subtitle}>Supabase Connection Test</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="admin@college.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Login →"}
        </button>

        <p style={styles.hint}>
          Use the admin credentials you created in Supabase
        </p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
    padding: 20,
  },
  card: {
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 40,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  },
  logo: { fontSize: 40, textAlign: "center", marginBottom: 12 },
  title: { color: "#f1f5f9", fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 6px" },
  subtitle: { color: "#64748b", fontSize: 13, textAlign: "center", marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 },
  input: {
    width: "100%", padding: "11px 14px", background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: 13, background: "#f59e0b",
    border: "none", borderRadius: 8, color: "#0f172a",
    fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8,
  },
  hint: { fontSize: 12, color: "#475569", textAlign: "center", marginTop: 14 },
  errorBox: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5", borderRadius: 8, padding: "10px 14px",
    fontSize: 13, marginBottom: 16,
  },
  successBadge: {
    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
    color: "#86efac", borderRadius: 8, padding: "10px 14px",
    fontSize: 13, marginBottom: 20, textAlign: "center", fontWeight: 600,
  },
  infoGrid: { background: "#0f172a", borderRadius: 10, padding: 16, marginBottom: 20 },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  infoKey: { fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  infoVal: { fontSize: 14, color: "#e2e8f0", fontWeight: 500 },
  badge: { fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 },
  nextStep: {
    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
    color: "#fcd34d", borderRadius: 8, padding: "12px 14px",
    fontSize: 13, marginBottom: 20, lineHeight: 1.6,
  },
  btnLogout: {
    width: "100%", padding: 11, background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    color: "#94a3b8", fontSize: 14, cursor: "pointer",
  },
};