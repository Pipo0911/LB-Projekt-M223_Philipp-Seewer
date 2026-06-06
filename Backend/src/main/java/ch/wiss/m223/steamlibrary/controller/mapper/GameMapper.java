package ch.wiss.m223.steamlibrary.controller.mapper;

import ch.wiss.m223.steamlibrary.controller.dto.GameRequest;
import ch.wiss.m223.steamlibrary.controller.dto.GameResponse;
import ch.wiss.m223.steamlibrary.model.Game;

/**
 * Manuelles Mapping zwischen {@link Game}-Entity und den DTOs.
 * Bewusst ohne zusätzliche Bibliothek (z.B. MapStruct), um die
 * Abhängigkeiten schlank zu halten.
 */
public final class GameMapper {

    private GameMapper() {
        // Utility-Klasse – keine Instanzen
    }

    /** Erzeugt eine neue Entity aus einem Request (ohne Besitzer/ID). */
    public static Game toEntity(GameRequest request) {
        Game game = new Game();
        applyRequest(game, request);
        return game;
    }

    /** Überträgt die Felder eines Requests auf eine bestehende Entity. */
    public static void applyRequest(Game game, GameRequest request) {
        game.setTitle(request.getTitle());
        game.setSteamAppId(request.getSteamAppId());
        game.setPlaytimeHours(request.getPlaytimeHours());
        game.setInstalled(request.getInstalled());
        game.setLastPlayed(request.getLastPlayed());
        game.setPrice(request.getPrice());
    }

    /** Wandelt eine Entity in das Ausgabe-DTO um. */
    public static GameResponse toResponse(Game game) {
        Long userId = game.getUser() != null ? game.getUser().getId() : null;
        return new GameResponse(
                game.getId(),
                game.getTitle(),
                game.getSteamAppId(),
                game.getPlaytimeHours(),
                game.getInstalled(),
                game.getLastPlayed(),
                game.getPrice(),
                userId
        );
    }
}
