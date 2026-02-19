import { useEffect, useState } from "react";
import { api } from "../services/api.jsx";

function Stat({ label, value, sub }) {
  return (
    <div style={styles.card}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      {sub ? <div style={styles.statSub}>{sub}</div> : null}
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [gamesTotal, setGamesTotal] = useState("—");
  const [hoursTotal, setHoursTotal] = useState("—");
  const [lastPlayedMax, setLastPlayedMax] = useState("—");

  async function loadStats() {
    setLoading(true);
    setErr("");
    try {
      const games = await api.listGames();
      const list = Array.isArray(games) ? games : [];

      setGamesTotal(list.length);

      const sumHours = list.reduce((acc, g) => acc + (Number(g.playtimeHours) || 0), 0);
      setHoursTotal(sumHours);

      // letztes lastPlayed (YYYY-MM-DD) -> max
      const dates = list
        .map((g) => g.lastPlayed)
        .filter(Boolean)
        .sort(); // ISO-Date sortiert lexikografisch korrekt
      setLastPlayedMax(dates.length ? dates[dates.length - 1] : "—");
    } catch (e) {
      setErr(e?.message || e?.error || "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <div style={{ opacity: 0.75, marginBottom: 14 }}>
        Willkommen in deiner Steam Library App (M295).
      </div>

      {err ? (
        <div style={{ border: "1px solid #fca5a5", background: "#fee2e2", padding: 10, borderRadius: 12 }}>
          <b>Fehler:</b> {err}
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(220px, 1fr))", gap: 12 }}>
        <Stat label="Games total" value={loading ? "…" : gamesTotal} />
        <Stat label="Stunden total" value={loading ? "…" : hoursTotal} />
        <Stat label="Zuletzt gespielt" value={loading ? "…" : lastPlayedMax} sub="aus lastPlayed berechnet" />
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    background: "#fff",
  },
  statLabel: { opacity: 0.75, fontWeight: 700 },
  statValue: { fontSize: 34, fontWeight: 900, marginTop: 10 },
  statSub: { opacity: 0.6, marginTop: 6, fontSize: 12 },
};
