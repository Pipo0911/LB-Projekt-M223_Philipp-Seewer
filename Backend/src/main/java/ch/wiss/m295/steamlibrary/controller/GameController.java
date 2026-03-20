package ch.wiss.m295.steamlibrary.controller;

import ch.wiss.m295.steamlibrary.model.Game;
import ch.wiss.m295.steamlibrary.repository.GameRepository;
import ch.wiss.m295.steamlibrary.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;

/**
 * REST controller for managing games in the Steam library.
 * <p>
 * Provides CRUD endpoints with Spring Security protection.
 * </p>
 */

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository repo;
    private final UserRepository userRepository;

    public GameController(GameRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    // GET /games (optional mit Filtern)
    @GetMapping
    public Iterable<Game> getAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean installed,
            @RequestParam(required = false) Integer minPlaytime,
            @RequestParam(required = false) String lastPlayedAfter
    ) {
        // 1) Wenn genau EIN Filter gesetzt ist -> Repository-Query
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
            return repo.findByLastPlayedAfter(LocalDate.parse(lastPlayedAfter));
        }

        // 2) Wenn mehrere Filter kombiniert werden -> In-Memory Filterung
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
                LocalDate date = LocalDate.parse(lastPlayedAfter);
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

    // POST /api/games
    @PostMapping
    public ResponseEntity<Game> create(@Valid @RequestBody Game game) {
        game.setId(null);

        // Get current user and set userId
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userRepository.findByUsername(username)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        game.setUserId(userId);

        Game saved = repo.save(game);
        return ResponseEntity.created(java.net.URI.create("/api/games/" + saved.getId())).body(saved);
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
            existing.setPrice(game.getPrice());
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
