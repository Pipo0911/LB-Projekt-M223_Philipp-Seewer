import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

/**
 * Kapselt das Laden und die CRUD-Operationen für Spiele.
 * Hält Daten-, Lade- und Fehlerzustand und stellt eine einheitliche
 * `save`-Funktion bereit (erstellen ODER aktualisieren – je nach ID).
 */
export function useGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api.listGames();
      setGames(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || e?.error || "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** Erstellt (id == null) oder aktualisiert ein Spiel und lädt die Liste neu. */
  const save = useCallback(
    async (id, payload) => {
      if (id) {
        await api.updateGame(id, payload);
      } else {
        await api.createGame(payload);
      }
      await load();
    },
    [load]
  );

  /** Löscht ein Spiel und entfernt es optimistisch aus der Liste. */
  const remove = useCallback(async (id) => {
    await api.deleteGame(id);
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { games, loading, error, setError, load, save, remove };
}
