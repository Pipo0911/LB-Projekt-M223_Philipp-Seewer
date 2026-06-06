package ch.wiss.m223.steamlibrary.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

/**
 * Eingabe-DTO für das Erstellen und Aktualisieren eines Spiels
 * (POST / PUT {@code /api/games}). Entkoppelt das öffentliche API von der Entity.
 */
public class GameRequest {

    @NotBlank(message = "Titel darf nicht leer sein")
    private String title;

    @NotNull(message = "steamAppId ist erforderlich")
    private Integer steamAppId;

    @PositiveOrZero(message = "playtimeHours muss >= 0 sein")
    private Integer playtimeHours;

    private Boolean installed;

    private LocalDate lastPlayed;

    @PositiveOrZero(message = "price muss >= 0 sein")
    private Double price;

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
}
