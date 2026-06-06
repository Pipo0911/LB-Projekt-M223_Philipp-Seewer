package ch.wiss.m223.steamlibrary.repository;

import ch.wiss.m223.steamlibrary.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

/**
 * Repository für {@link Game}-Entities.
 * <p>
 * Bietet CRUD-Operationen sowie dynamische Abfragen über
 * {@link JpaSpecificationExecutor} (siehe {@code GameSpecifications}).
 * </p>
 */
public interface GameRepository
        extends JpaRepository<Game, Long>, JpaSpecificationExecutor<Game> {

    /** Alle Spiele eines bestimmten Benutzers. */
    List<Game> findByUser_Id(Long userId);
}
