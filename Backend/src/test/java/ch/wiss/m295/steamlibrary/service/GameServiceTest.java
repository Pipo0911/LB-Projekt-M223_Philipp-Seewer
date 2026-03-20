package ch.wiss.m295.steamlibrary.service;

import ch.wiss.m295.steamlibrary.model.Game;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

/**
 * Unit Tests für GameService (SideQuest – Modul 450).
 * <p>
 * Testet den Service-Layer isoliert (ohne Spring-Kontext oder Datenbank).
 * Alle Tests folgen dem AAA-Prinzip (Arrange – Act – Assert).
 * Benennung: whenBedingung_thenErwartung
 * </p>
 *
 * @author Philipp Seewer / Dario Romano
 */
class GameServiceTest {

    private GameService gameService;

    // ============================================================
    // FIXTURE-METHODEN
    // ============================================================

    @BeforeEach
    void setUp() {
        // Vor jedem Test: frisches Service-Objekt mit leerer In-Memory-Liste
        gameService = new GameService();
    }

    @AfterEach
    void tearDown() {
        // Nach jedem Test: Liste leeren (Seiteneffekte verhindern)
        gameService.clearAll();
    }

    // ============================================================
    // UT-01: Spiel erfolgreich hinzufügen
    // ============================================================

    @Test
    void whenAddingValidGame_thenGameIsSaved() {
        // Arrange
        Game game = new Game("Minecraft", 29.99, 0);

        // Act
        gameService.addGame(game);

        // Assert
        assertEquals(1, gameService.getAllGames().size());
        assertEquals("Minecraft", gameService.getAllGames().get(0).getTitle());
    }

    // ============================================================
    // UT-02: Alle Spiele abrufen
    // ============================================================

    @Test
    void whenGettingAllGames_thenReturnCorrectCount() {
        // Arrange
        gameService.addGame(new Game("CS:GO", 0.0, 500));
        gameService.addGame(new Game("Elden Ring", 59.99, 120));
        gameService.addGame(new Game("Terraria", 9.99, 200));

        // Act
        List<Game> games = gameService.getAllGames();

        // Assert
        assertEquals(3, games.size());
    }

    // ============================================================
    // UT-03: Spiel nach ID abrufen
    // ============================================================

    @Test
    void whenGettingGameById_thenReturnCorrectGame() {
        // Arrange
        Game game = new Game("Stardew Valley", 13.99, 80);
        game.setId(1L);
        gameService.addGame(game);

        // Act
        Game result = gameService.getGameById(1L);

        // Assert
        assertEquals("Stardew Valley", result.getTitle());
        assertEquals(13.99, result.getPrice(), 0.001);
    }

    // ============================================================
    // UT-04: Spiel mit leerem Titel – Exception erwartet (NEGATIV)
    // ============================================================

    @Test
    void whenAddingGameWithEmptyTitle_thenThrowException() {
        // Arrange
        Game game = new Game("", 29.99, 0); // Leerer Titel

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            gameService.addGame(game);
        });
    }

    // ============================================================
    // UT-05: Spiel mit negativem Preis – Exception erwartet (NEGATIV)
    // ============================================================

    @Test
    void whenAddingGameWithNegativePrice_thenThrowException() {
        // Arrange
        Game game = new Game("GTA V", -10.0, 0); // Negativer Preis

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            gameService.addGame(game);
        });
    }

    // ============================================================
    // UT-06: Spiel löschen
    // ============================================================

    @Test
    void whenDeletingExistingGame_thenGameIsRemoved() {
        // Arrange
        Game game = new Game("Portal 2", 9.99, 15);
        game.setId(1L);
        gameService.addGame(game);
        assertEquals(1, gameService.getAllGames().size()); // sicherstellen dass vorhanden

        // Act
        gameService.deleteGame(1L);

        // Assert
        assertEquals(0, gameService.getAllGames().size());
    }

    // ============================================================
    // UT-07: Spielzeit aktualisieren
    // ============================================================

    @Test
    void whenUpdatingGame_thenPlaytimeIsUpdated() {
        // Arrange
        Game game = new Game("Hollow Knight", 14.99, 10);
        game.setId(1L);
        gameService.addGame(game);

        // Act
        gameService.updatePlaytime(1L, 50);

        // Assert
        assertEquals(50, gameService.getGameById(1L).getPlaytimeHours());
    }

    // ============================================================
    // UT-08: Filtern nach minimaler Spielzeit
    // ============================================================

    @Test
    void whenFilteringByMinPlaytime_thenReturnOnlyMatchingGames() {
        // Arrange
        gameService.addGame(new Game("Cyberpunk 2077", 59.99, 5));
        gameService.addGame(new Game("The Witcher 3", 29.99, 200));
        gameService.addGame(new Game("Hades", 24.99, 80));

        // Act
        List<Game> result = gameService.getGamesByMinPlaytime(50);

        // Assert
        assertEquals(2, result.size()); // Nur Witcher 3 und Hades haben >= 50h
        assertTrue(result.stream().allMatch(g -> g.getPlaytimeHours() >= 50));
    }
}
