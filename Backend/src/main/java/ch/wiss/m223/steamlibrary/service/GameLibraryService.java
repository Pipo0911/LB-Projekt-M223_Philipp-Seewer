package ch.wiss.m223.steamlibrary.service;

import ch.wiss.m223.steamlibrary.controller.dto.GameRequest;
import ch.wiss.m223.steamlibrary.controller.mapper.GameMapper;
import ch.wiss.m223.steamlibrary.exception.ResourceNotFoundException;
import ch.wiss.m223.steamlibrary.model.Game;
import ch.wiss.m223.steamlibrary.repository.GameRepository;
import ch.wiss.m223.steamlibrary.repository.UserRepository;
import ch.wiss.m223.steamlibrary.repository.spec.GameSpecifications;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Service-Schicht für die persistente Game-Verwaltung.
 * <p>
 * Kapselt die gesamte Geschäftslogik (Filterung, CRUD, Besitzer-Zuordnung),
 * die zuvor im Controller lag. Nutzt das {@link GameRepository}.
 * </p>
 * <p>
 * Hinweis: Die separate, rein in-memory arbeitende {@code GameService}-Klasse
 * bleibt unverändert für die isolierten JUnit-Unit-Tests bestehen.
 * </p>
 */
@Service
public class GameLibraryService {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public GameLibraryService(GameRepository gameRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    /**
     * Liefert alle Spiele, optional gefiltert. Die Filter werden über
     * JPA-Specifications kombiniert und in der Datenbank ausgewertet.
     */
    @Transactional(readOnly = true)
    public List<Game> findAll(String title, Boolean installed, Integer minPlaytime, LocalDate lastPlayedAfter) {
        Specification<Game> spec = Specification.where(null);

        if (title != null && !title.isBlank()) {
            spec = spec.and(GameSpecifications.titleContains(title));
        }
        if (installed != null) {
            spec = spec.and(GameSpecifications.installedIs(installed));
        }
        if (minPlaytime != null) {
            spec = spec.and(GameSpecifications.playtimeAtLeast(minPlaytime));
        }
        if (lastPlayedAfter != null) {
            spec = spec.and(GameSpecifications.lastPlayedAfter(lastPlayedAfter));
        }

        return gameRepository.findAll(spec);
    }

    /** Sucht ein Spiel oder wirft {@link ResourceNotFoundException}. */
    @Transactional(readOnly = true)
    public Game findById(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spiel mit ID " + id + " nicht gefunden"));
    }

    /**
     * Erstellt ein neues Spiel und ordnet es – falls vorhanden – dem aktuell
     * angemeldeten Benutzer zu.
     */
    @Transactional
    public Game create(GameRequest request, String username) {
        Game game = GameMapper.toEntity(request);
        userRepository.findByUsername(username).ifPresent(game::setUser);
        return gameRepository.save(game);
    }

    /** Aktualisiert ein bestehendes Spiel oder wirft {@link ResourceNotFoundException}. */
    @Transactional
    public Game update(Long id, GameRequest request) {
        Game existing = findById(id);
        GameMapper.applyRequest(existing, request);
        return gameRepository.save(existing);
    }

    /** Löscht ein Spiel oder wirft {@link ResourceNotFoundException}, falls es nicht existiert. */
    @Transactional
    public void delete(Long id) {
        if (!gameRepository.existsById(id)) {
            throw new ResourceNotFoundException("Spiel mit ID " + id + " nicht gefunden");
        }
        gameRepository.deleteById(id);
    }
}
