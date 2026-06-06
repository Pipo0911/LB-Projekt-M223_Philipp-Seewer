import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { api } from "../services/api.js";
import controls from "../styles/controls.module.css";
import styles from "./Home.module.css";

function Stat({ label, value, sub }) {
  return (
    <div className={styles.card}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {sub ? <div className={styles.statSub}>{sub}</div> : null}
    </div>
  );
}

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sub: PropTypes.string,
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: "—", hours: "—", lastPlayed: "—" });

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError("");
      try {
        const games = await api.listGames();
        const list = Array.isArray(games) ? games : [];
        const hours = list.reduce((acc, g) => acc + (Number(g.playtimeHours) || 0), 0);
        const dates = list
          .map((g) => g.lastPlayed)
          .filter(Boolean)
          .sort();
        setStats({
          total: list.length,
          hours,
          lastPlayed: dates.length ? dates[dates.length - 1] : "—",
        });
      } catch (e) {
        setError(e?.message || e?.error || "Fehler beim Laden");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Dashboard</h2>
      <div className={styles.intro}>Willkommen in deiner Steam Library App (M223).</div>

      {error ? (
        <div className={`${controls.alert} ${controls.alertError}`}>
          <b>Fehler:</b> {error}
        </div>
      ) : null}

      <div className={styles.grid}>
        <Stat label="Games total" value={loading ? "…" : stats.total} />
        <Stat label="Stunden total" value={loading ? "…" : stats.hours} />
        <Stat
          label="Zuletzt gespielt"
          value={loading ? "…" : stats.lastPlayed}
          sub="aus lastPlayed berechnet"
        />
      </div>
    </div>
  );
}
