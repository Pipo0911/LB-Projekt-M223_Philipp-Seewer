package ch.wiss.m223.steamlibrary.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

/**
 * Entity, die ein Spiel in der Steam-Bibliothek eines Benutzers abbildet.
 * <p>
 * Wird via JPA/Hibernate in der relationalen Datenbank persistiert.
 * </p>
 */
@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Titel darf nicht leer sein")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "steamAppId ist erforderlich")
    @Column(unique = true)
    private Integer steamAppId;

    @PositiveOrZero(message = "playtimeHours muss >= 0 sein")
    private Integer playtimeHours;

    private Boolean installed;

    private LocalDate lastPlayed;

    @PositiveOrZero(message = "price muss >= 0 sein")
    private Double price;

    /**
     * Besitzer des Spiels. Echte Many-to-One-Beziehung statt loser Fremdschlüssel-Spalte.
     * Spaltenname bleibt {@code user_id} → schema-kompatibel zum bestehenden SQL-Schema.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Game() {
    }

    /**
     * Convenience-Konstruktor für die In-Memory-Unit-Tests (GameService-Tests).
     */
    public Game(String title, double price, int playtimeHours) {
        this.title = title;
        this.price = price;
        this.playtimeHours = playtimeHours;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getSteamAppId() {
        return steamAppId;
    }

    public void setSteamAppId(Integer steamAppId) {
        this.steamAppId = steamAppId;
    }

    public Integer getPlaytimeHours() {
        return playtimeHours;
    }

    public void setPlaytimeHours(Integer playtimeHours) {
        this.playtimeHours = playtimeHours;
    }

    public Boolean getInstalled() {
        return installed;
    }

    public void setInstalled(Boolean installed) {
        this.installed = installed;
    }

    public LocalDate getLastPlayed() {
        return lastPlayed;
    }

    public void setLastPlayed(LocalDate lastPlayed) {
        this.lastPlayed = lastPlayed;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
