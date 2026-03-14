import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#1f1f1f",
    color: "#eaeaea",
    padding: "24px 16px",
  },

  shell: {
    maxWidth: 1100,
    margin: "0 auto",
  },

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 48,
    margin: "0 0 12px 0",
    letterSpacing: 0.4,
    fontWeight: 800,
  },

  nav: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },

  navBtn: (active) => ({
    padding: "8px 14px",
    borderRadius: 12,
    border: "1px solid #3a3a3a",
    background: active ? "#eaeaea" : "transparent",
    color: active ? "#111" : "#eaeaea",
    textDecoration: "none",
    fontWeight: 600,
    transition: "background 0.15s ease, color 0.15s ease",
  }),

  spacer: {
    flex: 1,
  },

  userInfo: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: 500,
  },

  logoutBtn: {
    padding: "7px 14px",
    borderRadius: 12,
    border: "1px solid #ef4444",
    background: "transparent",
    color: "#ef4444",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
    transition: "background 0.15s ease, color 0.15s ease",
  },

  card: {
    marginTop: 14,
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 20,
    color: "#0f172a",
  },
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <h1 style={styles.title}>Steam Library</h1>

          <nav style={styles.nav}>
            <NavLink to="/" style={({ isActive }) => styles.navBtn(isActive)}>
              Home
            </NavLink>

            {user ? (
              // Eingeloggt: Games-Link + Benutzername + Logout
              <>
                <NavLink to="/games" style={({ isActive }) => styles.navBtn(isActive)}>
                  Games
                </NavLink>
                <div style={styles.spacer} />
                <span style={styles.userInfo}>👤 {user.username}</span>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  Abmelden
                </button>
              </>
            ) : (
              // Nicht eingeloggt: Login-Link
              <>
                <div style={styles.spacer} />
                <NavLink to="/login" style={({ isActive }) => styles.navBtn(isActive)}>
                  Anmelden
                </NavLink>
                <NavLink to="/register" style={({ isActive }) => styles.navBtn(isActive)}>
                  Registrieren
                </NavLink>
              </>
            )}
          </nav>
        </header>

        <main style={styles.card}>{children}</main>
      </div>
    </div>
  );
}
