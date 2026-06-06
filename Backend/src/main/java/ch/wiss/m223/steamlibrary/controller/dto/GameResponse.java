package ch.wiss.m223.steamlibrary.controller.dto;

import java.time.LocalDate;

/**
 * Ausgabe-DTO für Spiele. Die Entity wird nie direkt serialisiert; so bleiben
 * interne Felder (z.B. die volle User-Beziehung) verborgen und das API stabil.
 */
public class GameResponse {

    private Long id;
    private String title;
    private Integer steamAppId;
    private Integer playtimeHours;
    private Boolean installed;
    private LocalDate lastPlayed;
    private Double price;
    private Long userId;

    public GameResponse(Long id, String title, Integer steamAppId, Integer playtimeHours,
                        Boolean installed, LocalDate lastPlayed, Double price, Long userId) {
        this.id = id;
        this.title = title;
        this.steamAppId = steamAppId;
        this.playtimeHours = playtimeHours;
        this.installed = installed;
        this.lastPlayed = lastPlayed;
        this.price = price;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getSteamAppId() {
        return steamAppId;
    }

    public Integer getPlaytimeHours() {
        return playtimeHours;
    }

    public Boolean getInstalled() {
        return installed;
    }

    public LocalDate getLastPlayed() {
        return lastPlayed;
    }

    public Double getPrice() {
        return price;
    }

    public Long getUserId() {
        return userId;
    }
}
