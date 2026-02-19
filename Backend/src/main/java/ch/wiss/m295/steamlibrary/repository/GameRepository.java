package ch.wiss.m295.steamlibrary.repository;

import ch.wiss.m295.steamlibrary.model.Game;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
/**
 * Repository for {@link ch.wiss.m295.steamlibrary.model.Game} entities.
 * <p>
 * Provides CRUD operations and derived query methods via Spring Data.
 * </p>
 */

public interface GameRepository extends CrudRepository<Game, Long> {

    Iterable<Game> findByTitleContainingIgnoreCase(String title);

    Iterable<Game> findByInstalled(Boolean installed);

    Iterable<Game> findByPlaytimeHoursGreaterThanEqual(Integer minPlaytimeHours);

    Iterable<Game> findByLastPlayedAfter(LocalDate date);
}
