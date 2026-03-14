package ch.wiss.m295.steamlibrary.controller;

import ch.wiss.m295.steamlibrary.model.Game;
import ch.wiss.m295.steamlibrary.repository.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

    @Autowired MockMvc mvc;
    @Autowired GameRepository repo;

    @BeforeEach
    void cleanDb() {
        repo.deleteAll();
    }

    // UT-01: GET /games liefert 200 und Array (ROLE_USER reicht)
    @Test
    @WithMockUser(roles = "USER")
    void getAll_returnsOkAndArray() throws Exception {
        mvc.perform(get("/games"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    // UT-02: POST /games mit gültigen Daten liefert 201 und id (nur ADMIN)
    @Test
    @WithMockUser(roles = "ADMIN")
    void create_validGame_returnsCreatedAndId() throws Exception {
        String body = """
                {
                  "title": "Helldivers 2",
                  "steamAppId": 553850,
                  "playtimeHours": 12,
                  "installed": true,
                  "lastPlayed": "2026-02-05"
                }
                """;

        mvc.perform(post("/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Helldivers 2"));
    }

    // UT-03: POST /games ohne title -> 400 (Validierung, ADMIN)
    @Test
    @WithMockUser(roles = "ADMIN")
    void create_missingTitle_returnsBadRequest() throws Exception {
        String body = """
                {
                  "steamAppId": 999999,
                  "playtimeHours": 0
                }
                """;

        mvc.perform(post("/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fields.title", notNullValue()));
    }

    // UT-04: GET /games/{id} existierend -> 200
    @Test
    @WithMockUser(roles = "USER")
    void getById_existing_returnsOk() throws Exception {
        Game g = new Game();
        g.setTitle("Test");
        g.setSteamAppId(123456);
        g.setPlaytimeHours(0);
        g.setInstalled(false);
        Game saved = repo.save(g);

        mvc.perform(get("/games/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.title").value("Test"));
    }

    // UT-05: DELETE /games/{id} -> 204 und danach nicht mehr vorhanden (nur ADMIN)
    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_existing_returnsNoContentAndRemoves() throws Exception {
        Game g = new Game();
        g.setTitle("ToDelete");
        g.setSteamAppId(777777);
        Game saved = repo.save(g);

        mvc.perform(delete("/games/" + saved.getId()))
                .andExpect(status().isNoContent());

        mvc.perform(get("/games/" + saved.getId()))
                .andExpect(status().isNotFound());
    }
}
