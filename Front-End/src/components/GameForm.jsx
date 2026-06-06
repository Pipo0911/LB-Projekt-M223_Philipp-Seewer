import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../pages/Games.module.css";
import controls from "../styles/controls.module.css";

/** Initialisiert die Formularwerte aus einem (evtl. leeren) Spiel-Objekt. */
function toFormState(game) {
  return {
    title: game?.title ?? "",
    steamAppId: game?.steamAppId ?? "",
    playtimeHours: game?.playtimeHours ?? "",
    installed: Boolean(game?.installed),
    lastPlayed: game?.lastPlayed ?? "",
  };
}

/**
 * Formular zum Erstellen/Bearbeiten eines Spiels. Validiert die Pflichtfelder
 * und liefert ein fertiges Payload-Objekt an `onSave`.
 */
export default function GameForm({ game, onSave, onCancel }) {
  const [form, setForm] = useState(() => toFormState(game));
  const [error, setError] = useState("");

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!String(form.title).trim()) return setError("Bitte Titel ausfüllen.");
    if (String(form.steamAppId).trim() === "") return setError("Bitte SteamAppId ausfüllen.");
    if (String(form.playtimeHours).trim() === "") return setError("Bitte Playtime ausfüllen.");

    const payload = {
      title: String(form.title).trim(),
      steamAppId: Number(form.steamAppId),
      playtimeHours: Number(form.playtimeHours),
      installed: Boolean(form.installed),
      lastPlayed: form.lastPlayed ? String(form.lastPlayed) : null,
    };
    return onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error ? <div className={`${controls.alert} ${controls.alertError}`}>{error}</div> : null}

      <div className={styles.formRow}>
        <div className={styles.formFieldWide}>
          <label className={controls.label}>Titel *</label>
          <input
            className={controls.input}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={controls.label}>SteamAppId *</label>
          <input
            className={controls.input}
            type="number"
            value={form.steamAppId}
            onChange={(e) => set("steamAppId", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={controls.label}>Playtime (Stunden) *</label>
          <input
            className={controls.input}
            type="number"
            value={form.playtimeHours}
            onChange={(e) => set("playtimeHours", e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={controls.label}>Installiert</label>
          <select
            className={controls.select}
            value={form.installed ? "true" : "false"}
            onChange={(e) => set("installed", e.target.value === "true")}
          >
            <option value="true">Ja</option>
            <option value="false">Nein</option>
          </select>
        </div>

        <div className={styles.formField}>
          <label className={controls.label}>Last Played</label>
          <input
            className={controls.input}
            type="date"
            value={form.lastPlayed || ""}
            onChange={(e) => set("lastPlayed", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.footerBtns}>
        <button type="button" onClick={onCancel} className={`${controls.btn} ${controls.btnGhost}`}>
          Abbrechen
        </button>
        <button type="submit" className={`${controls.btn} ${controls.btnPrimary}`}>
          {game?.id ? "Speichern" : "Erstellen"}
        </button>
      </div>
    </form>
  );
}

GameForm.propTypes = {
  game: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
