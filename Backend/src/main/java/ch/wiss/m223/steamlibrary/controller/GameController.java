package ch.wiss.m223.steamlibrary.controller;

import ch.wiss.m223.steamlibrary.controller.dto.GameRequest;
import ch.wiss.m223.steamlibrary.controller.dto.GameResponse;
import ch.wiss.m223.steamlibrary.controller.mapper.GameMapper;
import ch.wiss.m223.steamlibrary.model.Game;
import ch.wiss.m223.steamlibrary.service.GameLibraryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

/**
 * REST-Controller für die Verwaltung der Spiele in der Steam-Bibliothek.
 * <p>
 * Dünne Schicht: nimmt Requests entgegen, delegiert die Logik an den
 * {@link GameLibraryService} und gibt {@link GameResponse}-DTOs zurück.
 * Zugriffsschutz erfolgt über Spring Security (siehe {@code SecurityConfig}).
 * </p>
 */
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameLibraryService gameService;

    public GameController(GameLibraryService gameService) {
        this.gameService = gameService;
    }

    /** GET /api/games – alle Spiele, optional kombinierbar gefiltert. */
    @GetMapping
    public List<GameResponse> getAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean installed,
            @RequestParam(required = false) Integer minPlaytime,
            @RequestParam(required = false) String lastPlayedAfter
    ) {
        LocalDate lastPlayedDate = lastPlayedAfter != null ? LocalDate.parse(lastPlayedAfter) : null;
        return gameService.findAll(title, installed, minPlaytime, lastPlayedDate).stream()
                .map(GameMapper::toResponse)
                .toList();
    }

    /** GET /api/games/{id} – einzelnes Spiel. */
    @GetMapping("/{id}")
    public GameResponse getById(@PathVariable Long id) {
        return GameMapper.toResponse(gameService.findById(id));
    }

    /** POST /api/games – neues Spiel anlegen (nur ADMIN). */
    @PostMapping
    public ResponseEntity<GameResponse> create(@Valid @RequestBody GameRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Game saved = gameService.create(request, username);
        return ResponseEntity
                .created(URI.create("/api/games/" + saved.getId()))
                .body(GameMapper.toResponse(saved));
    }

    /** PUT /api/games/{id} – bestehendes Spiel aktualisieren (nur ADMIN). */
    @PutMapping("/{id}")
    public GameResponse update(@PathVariable Long id, @Valid @RequestBody GameRequest request) {
        return GameMapper.toResponse(gameService.update(id, request));
    }

    /** DELETE /api/games/{id} – Spiel löschen (nur ADMIN). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gameService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
