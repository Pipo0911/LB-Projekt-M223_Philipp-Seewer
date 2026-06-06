import PropTypes from "prop-types";
import styles from "../pages/Games.module.css";
import controls from "../styles/controls.module.css";

/** Tabellarische Darstellung der Spiele mit Bearbeiten-/Löschen-Aktionen. */
export default function GameTable({ games, loading, onEdit, onDelete }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} style={{ width: "44%" }}>
              Game
            </th>
            <th className={styles.th} style={{ width: 110 }}>
              Stunden
            </th>
            <th className={styles.th} style={{ width: 120 }}>
              Installiert
            </th>
            <th className={styles.th}>Last Played</th>
            <th className={styles.th} style={{ width: 190 }}>
              Aktionen
            </th>
          </tr>
        </thead>

        <tbody>
          {games.map((game, idx) => (
            <tr key={game.id} className={idx % 2 ? styles.trAlt : undefined}>
              <td className={styles.td}>
                <div className={styles.gameCell}>
                  <div className={styles.iconFallback} />
                  <div>
                    <div className={styles.gameName}>{game.title ?? "—"}</div>
                    <div className={styles.gameMeta}>
                      SteamAppId: {game.steamAppId ?? "—"} · ID: {game.id}
                    </div>
                  </div>
                </div>
              </td>

              <td className={`${styles.td} ${styles.numeric}`}>{game.playtimeHours ?? "—"}</td>

              <td className={styles.td}>
                <span className={styles.badge}>{game.installed ? "Ja" : "Nein"}</span>
              </td>

              <td className={styles.td}>{game.lastPlayed ?? "—"}</td>

              <td className={styles.td}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => onEdit(game)}
                    className={`${controls.btn} ${controls.btnPrimary}`}
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(game.id)}
                    className={`${controls.btn} ${controls.btnDanger}`}
                  >
                    Löschen
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {!loading && games.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Keine Games gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

GameTable.propTypes = {
  games: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
