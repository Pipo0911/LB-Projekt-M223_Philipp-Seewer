import { NavLink } from "react-router-dom";

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
    fontSize: 48,          // weniger dominant
    margin: "0 0 12px 0",
    letterSpacing: 0.4,
    fontWeight: 800,
  },

  nav: {
    display: "flex",
    gap: 10,
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
  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <h1 style={styles.title}>Steam Library</h1>

          <nav style={styles.nav}>
            <NavLink to="/" style={({ isActive }) => styles.navBtn(isActive)}>
              Home
            </NavLink>
            <NavLink to="/games" style={({ isActive }) => styles.navBtn(isActive)}>
              Games
            </NavLink>
          </nav>
        </header>

        <main style={styles.card}>{children}</main>
      </div>
    </div>
  );
}
