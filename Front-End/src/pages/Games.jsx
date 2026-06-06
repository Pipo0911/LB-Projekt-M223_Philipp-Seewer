import { useMemo, useState } from "react";
import { useGames } from "../hooks/useGames";
import Modal from "../components/Modal";
import GameForm from "../components/GameForm";
import GameTable from "../components/GameTable";
import styles from "./Games.module.css";
import controls from "../styles/controls.module.css";

export default function Games() {
  const { games, loading, error, setError, load, save, remove } = useGames();
  const [q, setQ] = useState("");
  // null = geschlossen, { id: null } = neues Spiel, sonst das zu bearbeitende Spiel
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return games;
    return games.filter((g) => (g.title || "").toLowerCase().includes(s));
  }, [games, q]);

  const handleSave = async (payload) => {
    setError("");
    try {
      await save(editing?.id ?? null, payload);
      setEditing(null);
    } catch (e) {
      setError(e?.message || e?.error || "Speichern fehlgeschlagen");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    if (!confirm("Willst du dieses Game wirklich löschen?")) return;
    try {
      await remove(id);
      if (editing?.id === id) setEditing(null);
    } catch (e) {
      setError(e?.message || e?.error || "Löschen fehlgeschlagen");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.h2}>Games</h2>
          <div className={styles.sub}>
            {loading ? "Lade Liste..." : `${filtered.length} angezeigt`}
          </div>
        </div>

        <div className={styles.controls}>
          <input
            className={`${controls.input} ${styles.search}`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suchen..."
          />
          <button
            type="button"
            onClick={() => setEditing({ id: null })}
            className={`${controls.btn} ${controls.btnPrimary}`}
            title="Neues Game hinzufügen"
          >
            Neu
          </button>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className={`${controls.btn} ${controls.btnGhost}`}
            title="Liste neu vom Backend laden"
          >
            {loading ? "Lade..." : "Aktualisieren"}
          </button>
        </div>
      </div>

      {error && (
        <div className={`${controls.alert} ${controls.alertError}`}>
          <b>Fehler:</b> {error}
        </div>
      )}

      <GameTable
        games={filtered}
        loading={loading}
        onEdit={(game) => setEditing(game)}
        onDelete={handleDelete}
      />

      <Modal
        open={!!editing}
        title={editing?.id ? `Bearbeiten: ${editing.title}` : "Neues Game"}
        hint="Titel, SteamAppId, Playtime, Installiert und Last Played anpassen und speichern."
        onClose={() => setEditing(null)}
      >
        {editing ? (
          <GameForm game={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        ) : null}
      </Modal>
    </div>
  );
}
