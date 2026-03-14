package ch.wiss.m295.steamlibrary.service;

import ch.wiss.m295.steamlibrary.model.Game;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service-Klasse für die Game-Verwaltung.
 * <p>
 * Enthält die Geschäftslogik inkl. Validierungen.
 * Verwendet eine In-Memory-Liste – primär für Unit Tests (SideQuest JUnit).
 * </p>
 */
public class GameService {

    private final List<Game> games = new ArrayList<>();

    /**
     * Fügt ein neues Spiel zur Liste hinzu.
     *
     * @param game Das hinzuzufügende Spiel
     * @throws IllegalArgumentException wenn Titel leer oder Preis negativ ist
     */
    public void addGame(Game game) {
        if (game.getTitle() == null || game.getTitle().isBlank()) {
            throw new IllegalArgumentException("Titel darf nicht leer sein.");
        }
        if (game.getPrice() != null && game.getPrice() < 0) {
            throw new IllegalArgumentException("Preis darf nicht negativ sein.");
        }
        games.add(game);
    }

    /**
     * Gibt alle gespeicherten Spiele zurück.
     */
    public List<Game> getAllGames() {
        return new ArrayList<>(games);
    }

    /**
     * Sucht ein Spiel anhand seiner ID.
     *
     * @param id Die gesuchte ID
     * @return Das gefundene Spiel oder null
     */
    public Game getGameById(Long id) {
        return games.stream()
                .filter(g -> id.equals(g.getId()))
                .findFirst()
                .orElse(null);
    }

    /**
     * Löscht ein Spiel anhand seiner ID.
     *
     * @param id Die ID des zu löschenden Spiels
     */
    public void deleteGame(Long id) {
        games.removeIf(g -> id.equals(g.getId()));
    }

    /**
     * Aktualisiert die Spielzeit eines Spiels.
     *
     * @param id    Die ID des Spiels
     * @param hours Die neue Spielzeit in Stunden
     */
    public void updatePlaytime(Long id, int hours) {
        Game game = getGameById(id);
        if (game != null) {
            game.setPlaytimeHours(hours);
        }
    }

    /**
     * Gibt alle Spiele zurück, die mindestens die angegebene Spielzeit haben.
     *
     * @param minHours Mindest-Spielzeit in Stunden
     * @return Gefilterte Liste
     */
    public List<Game> getGamesByMinPlaytime(int minHours) {
        return games.stream()
                .filter(g -> g.getPlaytimeHours() != null && g.getPlaytimeHours() >= minHours)
                .collect(Collectors.toList());
    }

    /**
     * Leert die gesamte Spielliste (für Test-Teardown).
     */
    public void clearAll() {
        games.clear();
    }
}
