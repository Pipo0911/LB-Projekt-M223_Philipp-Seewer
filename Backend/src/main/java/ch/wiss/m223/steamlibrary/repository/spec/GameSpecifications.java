package ch.wiss.m223.steamlibrary.repository.spec;

import ch.wiss.m223.steamlibrary.model.Game;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

/**
 * Wiederverwendbare JPA-Specifications für die dynamische Game-Filterung.
 * <p>
 * Ersetzt die frühere In-Memory-Filterung im Controller: Die Filter werden
 * direkt in der Datenbank als WHERE-Bedingungen ausgewertet und sind beliebig
 * kombinierbar.
 * </p>
 */
public final class GameSpecifications {

    private GameSpecifications() {
        // Utility-Klasse – keine Instanzen
    }

    /** Titel enthält den Suchbegriff (case-insensitive). */
    public static Specification<Game> titleContains(String title) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    /** Filtert nach Installations-Status. */
    public static Specification<Game> installedIs(Boolean installed) {
        return (root, query, cb) -> cb.equal(root.get("installed"), installed);
    }

    /** Mindest-Spielzeit in Stunden. */
    public static Specification<Game> playtimeAtLeast(Integer minPlaytime) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("playtimeHours"), minPlaytime);
    }

    /** Zuletzt gespielt nach dem angegebenen Datum. */
    public static Specification<Game> lastPlayedAfter(LocalDate date) {
        return (root, query, cb) -> cb.greaterThan(root.get("lastPlayed"), date);
    }
}
