package ch.wiss.m295.steamlibrary.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.NotNull;


/**
 * Entity representing a game in the user's Steam library.
 * <p>
 * This entity is persisted in the relational database using JPA/Hibernate.
 * </p>
 */
@Entity
@Table(name = "games")
public class Game {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "title darf nicht leer sein")
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

    @Column(name = "user_id")
    private Long userId;

    public Game() {
    }

    /**
     * Convenience-Konstruktor für Unit Tests (GameService-Tests).
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
