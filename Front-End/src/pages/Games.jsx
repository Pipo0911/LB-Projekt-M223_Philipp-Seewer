import { api } from "../services/api.jsx";
import { useEffect, useMemo, useState } from "react";

/**
 * Einfaches Modal:
 * - Klick ausserhalb schliesst
 * - Inhalt bleibt klickbar (stopPropagation)
 */
function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div onMouseDown={onClose} style={g.overlay}>
      <div onMouseDown={(e) => e.stopPropagation()} style={g.modal}>
        <div style={g.modalHeader}>
          <div>
            <div style={g.modalTitle}>{title}</div>
            <div style={g.modalHint}>
              Installiert/LastPlayed/Playtime anpassen und speichern.
            </div>
          </div>

          <button onClick={onClose} style={{ ...g.btn, ...g.btnGhost }}>
            Schliessen
          </button>
        </div>

        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}

export default function Games() {
  // Daten + Status
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Suche
  const [q, setQ] = useState("");

  // Edit-Modal (Spring-Felder)
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [steamAppId, setSteamAppId] = useState("");
  const [playtimeHours, setPlaytimeHours] = useState("");
  const [installed, setInstalled] = useState(false);
  const [lastPlayed, setLastPlayed] = useState(""); // YYYY-MM-DD oder leer

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await api.listGames();
      setGames(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || e?.error || "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  }

  // initial laden
  useEffect(() => {
    load();
  }, []);

  // Client-seitige Filterung
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return games;
    return games.filter((g) => (g.title || "").toLowerCase().includes(s));
  }, [games, q]);

  function startEdit(game) {
    setEditing(game);
    setTitle(game.title ?? "");
    setSteamAppId(game.steamAppId ?? "");
    setPlaytimeHours(game.playtimeHours ?? "");
    setInstalled(Boolean(game.installed));
    setLastPlayed(game.lastPlayed ?? "");
    setErr("");
  }

  function stopEdit() {
    setEditing(null);
    setTitle("");
    setSteamAppId("");
    setPlaytimeHours("");
    setInstalled(false);
    setLastPlayed("");
  }

  async function saveEdit() {
    setErr("");

    // minimale Validierung
    if (!String(title).trim()) {
      setErr("Bitte Titel ausfüllen.");
      return;
    }
    if (String(steamAppId).trim() === "") {
      setErr("Bitte SteamAppId ausfüllen.");
      return;
    }
    if (String(playtimeHours).trim() === "") {
      setErr("Bitte playtimeHours ausfüllen.");
      return;
    }

    const payload = {
      steamAppId: Number(steamAppId),
      title: String(title).trim(),
      playtimeHours: Number(playtimeHours),
      installed: Boolean(installed),
      lastPlayed: lastPlayed ? String(lastPlayed) : null,
    };

    try {
      // ✅ Spring: PUT /games/{id}
      await api.updateGame(editing.id, payload);
      stopEdit();
      await load();
    } catch (e) {
      setErr(e?.message || e?.error || "Speichern fehlgeschlagen");
    }
  }

  async function removeGame(id) {
    setErr("");
    if (!confirm("Willst du dieses Game wirklich löschen?")) return;

    try {
      // ✅ Spring: DELETE /games/{id}
      await api.deleteGame(id);

      // UI direkt aktualisieren
      setGames((prev) => prev.filter((g) => g.id !== id));

      // falls im Modal gerade offen
      if (editing?.id === id) stopEdit();
    } catch (e) {
      setErr(e?.message || e?.error || "Löschen fehlgeschlagen");
    }
  }

  function startCreate() {
    setEditing({ id: null }); // Marker: neues Spiel
    setTitle("");
    setSteamAppId("");
    setPlaytimeHours("");
    setInstalled(false);
    setLastPlayed("");
    setErr("");
  }

  async function saveCreate() {
    setErr("");

    // minimale Validierung
    if (!String(title).trim()) {
      setErr("Bitte Titel ausfüllen.");
      return;
    }
    if (String(steamAppId).trim() === "") {
      setErr("Bitte SteamAppId ausfüllen.");
      return;
    }
    if (String(playtimeHours).trim() === "") {
      setErr("Bitte playtimeHours ausfüllen.");
      return;
    }

    const payload = {
      steamAppId: Number(steamAppId),
      title: String(title).trim(),
      playtimeHours: Number(playtimeHours),
      installed: Boolean(installed),
      lastPlayed: lastPlayed ? String(lastPlayed) : null,
    };

    try {
      // ✅ Spring: POST /games
      await api.createGame(payload);
      stopEdit();
      await load();
    } catch (e) {
      setErr(e?.message || e?.error || "Erstellen fehlgeschlagen");
    }
  }

  return (
    <div style={g.page}>
      <div style={g.headerRow}>
        <div>
          <h2 style={g.h2}>Games</h2>
          <div style={g.sub}>
            {loading ? "Lade Liste..." : `${filtered.length} angezeigt`}
          </div>
        </div>

        <div style={g.controls}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suchen..."
            style={g.input}
          />

          <button
            onClick={startCreate}
            style={{ ...g.btn, ...g.btnPrimary }}
            title="Neues Game hinzufügen"
          >
            Neu laden
          </button>

          <button
            onClick={load}
            disabled={loading}
            style={{
              ...g.btn,
              ...(loading ? g.btnDisabled : g.btnGhost),
            }}
            title="Liste neu vom Backend laden"
          >
            {loading ? "Lade..." : "Aktualisieren"}
          </button>
        </div>
      </div>

      {err && (
        <div style={{ ...g.alert, ...g.alertError }}>
          <b>Fehler:</b> {err}
        </div>
      )}

      <div style={g.tableWrap}>
        <table style={g.table}>
          <thead>
            <tr>
              <th style={{ ...g.th, width: "44%" }}>Game</th>
              <th style={{ ...g.th, width: 110 }}>Stunden</th>
              <th style={{ ...g.th, width: 120 }}>Installiert</th>
              <th style={{ ...g.th }}>Last Played</th>
              <th style={{ ...g.th, width: 190 }}>Aktionen</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((gme, idx) => (
              <tr key={gme.id} style={idx % 2 ? g.trAlt : undefined}>
                <td style={g.td}>
                  <div style={g.gameCell}>
                    {/* Icon existiert im Spring-Backend nicht -> Fallback */}
                    <div style={g.iconFallback} />

                    <div>
                      <div style={g.gameName}>{gme.title ?? "—"}</div>
                      <div style={g.gameMeta}>
                        SteamAppId: {gme.steamAppId ?? "—"} · ID: {gme.id}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ ...g.td, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                  {gme.playtimeHours ?? "—"}
                </td>

                <td style={g.td}>
                  <span style={g.badge}>{gme.installed ? "Ja" : "Nein"}</span>
                </td>

                <td style={{ ...g.td, maxWidth: 420 }}>
                  <div style={g.noteEllipsis} title={gme.lastPlayed ?? ""}>
                    {gme.lastPlayed ?? "—"}
                  </div>
                </td>

                <td style={{ ...g.td, whiteSpace: "nowrap" }}>
                  <div style={g.actions}>
                    <button onClick={() => startEdit(gme)} style={{ ...g.btn, ...g.btnPrimary }}>
                      Bearbeiten
                    </button>
                    <button onClick={() => removeGame(gme.id)} style={{ ...g.btn, ...g.btnDanger }}>
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, opacity: 0.75 }}>
                  Keine Games gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editing}
        title={editing?.id ? `Bearbeiten: ${editing.title}` : "Neues Game"}
        onClose={stopEdit}
      >
        <div style={g.formRow}>
          <div style={{ flex: "2 1 320px" }}>
            <label style={g.label}>Titel *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={g.select}
            />
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label style={g.label}>SteamAppId *</label>
            <input
              type="number"
              value={steamAppId}
              onChange={(e) => setSteamAppId(e.target.value)}
              style={g.select}
            />
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label style={g.label}>Playtime (Hours) *</label>
            <input
              type="number"
              value={playtimeHours}
              onChange={(e) => setPlaytimeHours(e.target.value)}
              style={g.select}
            />
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label style={g.label}>Installiert</label>
            <select
              value={installed ? "true" : "false"}
              onChange={(e) => setInstalled(e.target.value === "true")}
              style={g.select}
            >
              <option value="true">Ja</option>
              <option value="false">Nein</option>
            </select>
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label style={g.label}>Last Played</label>
            <input
              type="date"
              value={lastPlayed || ""}
              onChange={(e) => setLastPlayed(e.target.value)}
              style={g.select}
            />
          </div>
        </div>

        <div style={g.footerBtns}>
          <button onClick={stopEdit} style={{ ...g.btn, ...g.btnGhost }}>
            Abbrechen
          </button>
          <button
            onClick={editing?.id ? saveEdit : saveCreate}
            style={{ ...g.btn, ...g.btnPrimary }}
          >
            {editing?.id ? "Speichern" : "Erstellen"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

const g = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "18px 16px",
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  h2: { margin: 0, fontSize: 28, letterSpacing: 0.2 },
  sub: { opacity: 0.75, marginTop: 6 },

  controls: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  input: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    width: 260,
    outline: "none",
    background: "#fff",
  },

  alert: { margin: "12px 0", padding: 10, borderRadius: 12, border: "1px solid transparent" },
  alertError: { background: "#fee2e2", borderColor: "#fca5a5" },

  tableWrap: {
    marginTop: 12,
    overflowX: "auto",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 1px 0 rgba(15, 23, 42, 0.04)",
  },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },

  th: {
    textAlign: "left",
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
    background: "#f8fafc",
    position: "sticky",
    top: 0,
    zIndex: 1,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#334155",
  },
  td: { padding: 12, borderBottom: "1px solid #eef2f7", verticalAlign: "middle" },
  trAlt: { background: "#fbfdff" },

  gameCell: { display: "flex", gap: 10, alignItems: "center" },
  iconFallback: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#f1f5f9",
  },
  gameName: { fontWeight: 800, color: "#0f172a" },
  gameMeta: { fontSize: 12, opacity: 0.7, marginTop: 2 },

  badge: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
  },

  noteEllipsis: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 420,
  },

  actions: { display: "flex", gap: 8, flexWrap: "wrap" },

  btn: {
    padding: "9px 12px",
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    fontWeight: 800,
    cursor: "pointer",
    background: "#fff",
  },
  btnPrimary: { background: "#0f172a", borderColor: "#0f172a", color: "#fff" },
  btnDanger: { background: "#fff", borderColor: "#fecaca", color: "#b91c1c" },
  btnGhost: { background: "#fff", borderColor: "#cbd5e1", color: "#0f172a" },
  btnDisabled: { background: "#f1f5f9", color: "#64748b", cursor: "not-allowed" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    zIndex: 9999,
  },
  modal: {
    width: "min(760px, 100%)",
    background: "#ffffff",
    borderRadius: 18,
    border: "1px solid #e5e7eb",
    padding: 16,
    color: "#0f172a",
    boxShadow: "0 20px 50px rgba(2,6,23,0.25)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  modalTitle: { fontWeight: 900, fontSize: 18 },
  modalHint: { marginTop: 4, fontSize: 13, opacity: 0.7 },

  formRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  label: { display: "block", fontWeight: 900, marginBottom: 6 },
  select: { width: "100%", padding: 10, borderRadius: 14, border: "1px solid #cbd5e1" },

  footerBtns: { marginTop: 14, display: "flex", gap: 10, justifyContent: "flex-end" },
};
