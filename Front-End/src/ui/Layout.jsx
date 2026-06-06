import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Layout.module.css";

/** Liefert die NavLink-Klasse abhängig vom Aktiv-Status. */
function navClass({ isActive }) {
  return isActive ? `${styles.navBtn} ${styles.navBtnActive}` : styles.navBtn;
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1 className={styles.title}>Steam Library</h1>

          <nav className={styles.nav}>
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink to="/games" className={navClass}>
                  Games
                </NavLink>
                <div className={styles.spacer} />
                <span className={styles.userInfo}>👤 {user.username}</span>
                <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <div className={styles.spacer} />
                <NavLink to="/login" className={navClass}>
                  Anmelden
                </NavLink>
                <NavLink to="/register" className={navClass}>
                  Registrieren
                </NavLink>
              </>
            )}
          </nav>
        </header>

        <main className={styles.card}>{children}</main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
