package ch.wiss.m223.steamlibrary.service;

import ch.wiss.m223.steamlibrary.controller.dto.GameRequest;
import ch.wiss.m223.steamlibrary.exception.ResourceNotFoundException;
import ch.wiss.m223.steamlibrary.model.Game;
import ch.wiss.m223.steamlibrary.model.User;
import ch.wiss.m223.steamlibrary.repository.GameRepository;
import ch.wiss.m223.steamlibrary.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit-Tests für die Repository-gestützte {@link GameLibraryService}.
 * <p>
 * Das Repository wird via Mockito gemockt – kein Spring-Kontext, keine Datenbank.
 * Benennung: whenBedingung_thenErwartung (AAA-Prinzip).
 * </p>
 */
@ExtendWith(MockitoExtension.class)
class GameLibraryServiceTest {

    @Mock GameRepository gameRepository;
    @Mock UserRepository userRepository;

    @InjectMocks GameLibraryService service;

    private GameRequest sampleRequest() {
        GameRequest req = new GameRequest();
        req.setTitle("Helldivers 2");
        req.setSteamAppId(553850);
        req.setPlaytimeHours(12);
        req.setInstalled(true);
        return req;
    }

    @Test
    void whenCreatingGameWithKnownUser_thenOwnerIsLinkedAndSaved() {
        // Arrange
        User owner = new User("admin", "admin@example.com", "hash");
        owner.setId(7L);
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(owner));
        when(gameRepository.save(any(Game.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Game saved = service.create(sampleRequest(), "admin");

        // Assert
        assertEquals("Helldivers 2", saved.getTitle());
        assertNotNull(saved.getUser());
        assertEquals(7L, saved.getUser().getId());
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void whenFindingMissingGame_thenThrowsNotFound() {
        // Arrange
        when(gameRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    void whenDeletingMissingGame_thenThrowsNotFound() {
        // Arrange
        when(gameRepository.existsById(99L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> service.delete(99L));
        verify(gameRepository, never()).deleteById(any());
    }
}
