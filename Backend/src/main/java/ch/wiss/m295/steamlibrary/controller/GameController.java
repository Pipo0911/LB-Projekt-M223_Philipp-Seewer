package ch.wiss.m295.steamlibrary.controller;

import ch.wiss.m295.steamlibrary.model.Game;
import ch.wiss.m295.steamlibrary.repository.GameRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.net.URI;
/**
 * REST controller for managing games in the Steam library.
 * <p>
 * Provides CRUD endpoints and optional filtering via query parameters.
 * </p>
 */

@RestController
@RequestMapping("/games")
public class GameController {

    private final GameRepository repo;

    public GameController(GameRepository repo) {
        this.repo = repo;
    }

    // GET /games (optional mit Filtern)
@GetMapping
public Iterable<Game> getAll(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) Boolean installed,
        @RequestParam(required = false) Integer minPlaytime,
        @RequestParam(required = false) String lastPlayedAfter
) {
    // 1) Wenn genau EIN Filter gesetzt ist -> Repository-Query (zeigt JPA/Derived Queries)
    if (title != null && installed == null && minPlaytime == null && lastPlayedAfter == null) {
        return repo.findByTitleContainingIgnoreCase(title);
    }
    if (installed != null && title == null && minPlaytime == null && lastPlayedAfter == null) {
        return repo.findByInstalled(installed);
    }
    if (minPlaytime != null && title == null && installed == null && lastPlayedAfter == null) {
        return repo.findByPlaytimeHoursGreaterThanEqual(minPlaytime);
    }
    if (lastPlayedAfter != null && title == null && installed == null && minPlaytime == null) {
        return repo.findByLastPlayedAfter(java.time.LocalDate.parse(lastPlayedAfter));
    }

    // 2) Wenn mehrere Filter kombiniert werden -> einfache In-Memory Filterung (für Schulprojekt völlig ok)
    java.util.List<Game> result = new java.util.ArrayList<>();
    for (Game g : repo.findAll()) {
        if (title != null && (g.getTitle() == null || !g.getTitle().toLowerCase().contains(title.toLowerCase()))) {
            continue;
        }
        if (installed != null && (g.getInstalled() == null || !g.getInstalled().equals(installed))) {
            continue;
        }
        if (minPlaytime != null && (g.getPlaytimeHours() == null || g.getPlaytimeHours() < minPlaytime)) {
            continue;
        }
        if (lastPlayedAfter != null) {
            java.time.LocalDate date = java.time.LocalDate.parse(lastPlayedAfter);
            if (g.getLastPlayed() == null || !g.getLastPlayed().isAfter(date)) {
                continue;
            }
        }
        result.add(g);
    }
    return result;
}


    // GET /games/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Game> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /games
    @PostMapping
    public ResponseEntity<Game> create(@Valid @RequestBody Game game) {
        game.setId(null);
        Game saved = repo.save(game);
        return ResponseEntity.created(java.net.URI.create("/games/" + saved.getId())).body(saved);
    }

    // PUT /games/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Game> update(@PathVariable Long id, @Valid @RequestBody Game game) {
        return repo.findById(id).map(existing -> {
            existing.setTitle(game.getTitle());
            existing.setSteamAppId(game.getSteamAppId());
            existing.setPlaytimeHours(game.getPlaytimeHours());
            existing.setInstalled(game.getInstalled());
            existing.setLastPlayed(game.getLastPlayed());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /games/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id))
            return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
