# Testing

## Übersicht

Das Projekt enthält zwei Test-Suiten:

1. **GameServiceTest** – Unit Tests für den Service-Layer (ohne Spring-Kontext, ohne Datenbank)
2. **GameControllerTest** – Integrations-Tests für den Controller-Layer (MockMvc, mit Spring Security)

---

## Unit Tests – GameService (SideQuest Modul 450)

Die Klasse `GameServiceTest` testet den `GameService` isoliert mit einer In-Memory-Liste.
Alle Tests folgen dem **AAA-Prinzip** (Arrange – Act – Assert) und verwenden die Namenskonvention `whenBedingung_thenErwartung`.

| Test-ID | Testmethode | Beschreibung | Erwartetes Ergebnis |
|---------|------------|-------------|---------------------|
| UT-01 | `whenAddingValidGame_thenGameIsSaved` | Gültiges Spiel hinzufügen | Liste enthält 1 Eintrag mit korrektem Titel |
| UT-02 | `whenGettingAllGames_thenReturnCorrectCount` | Alle Spiele abrufen | Liste enthält 3 Einträge |
| UT-03 | `whenGettingGameById_thenReturnCorrectGame` | Spiel nach ID suchen | Korrektes Spiel mit Titel und Preis zurückgegeben |
| UT-04 | `whenAddingGameWithEmptyTitle_thenThrowException` | Spiel mit leerem Titel (NEGATIV) | `IllegalArgumentException` wird geworfen |
| UT-05 | `whenAddingGameWithNegativePrice_thenThrowException` | Spiel mit negativem Preis (NEGATIV) | `IllegalArgumentException` wird geworfen |
| UT-06 | `whenDeletingExistingGame_thenGameIsRemoved` | Spiel löschen | Liste ist danach leer |
| UT-07 | `whenUpdatingGame_thenPlaytimeIsUpdated` | Spielzeit aktualisieren | Spielzeit auf neuen Wert gesetzt |
| UT-08 | `whenFilteringByMinPlaytime_thenReturnOnlyMatchingGames` | Filtern nach Mindest-Spielzeit | Nur Spiele mit >= 50h zurückgegeben |

---

## Integrations-Tests – GameController (M295 / M223)

Die Klasse `GameControllerTest` testet die REST-API mit MockMvc und einer echten Datenbankverbindung. Ab M223 sind alle Endpunkte durch Spring Security geschützt — die Tests verwenden `@WithMockUser` um Rollen zu simulieren.

| Test-ID | Testmethode | Rolle | Beschreibung | Erwartetes Ergebnis |
|---------|------------|-------|-------------|---------------------|
| UT-01 | `getAll_returnsOkAndArray` | USER | GET /games | HTTP 200, JSON-Array |
| UT-02 | `create_validGame_returnsCreatedAndId` | ADMIN | POST /games mit gültigen Daten | HTTP 201, id und title in Response |
| UT-03 | `create_missingTitle_returnsBadRequest` | ADMIN | POST /games ohne title | HTTP 400, `error: VALIDATION_FAILED` |
| UT-04 | `getById_existing_returnsOk` | USER | GET /games/{id} existierender Eintrag | HTTP 200, korrekte id und title |
| UT-05 | `delete_existing_returnsNoContentAndRemoves` | ADMIN | DELETE /games/{id} | HTTP 204, danach GET liefert 404 |

### Hinweis zu Spring Security in Tests

Da ab M223 alle `/games`-Endpunkte durch Spring Security geschützt sind, müssen Tests die Rolle des anfragenden Benutzers simulieren:

```java
@WithMockUser(roles = "USER")   // für GET-Anfragen
@WithMockUser(roles = "ADMIN")  // für POST/PUT/DELETE-Anfragen
```

Ohne diese Annotation würde der Test HTTP 401 erhalten und fehlschlagen.

---

## Testplanung – Manueller Testplan (M223)

| Testfall | Vorbedingung | Eingabe | Erwartetes Ergebnis | Tatsächliches Ergebnis |
|---------|-------------|---------|---------------------|------------------------|
| Registrierung (gültig) | Kein bestehender User | name, email, password | HTTP 200, Erfolgsmeldung | ✅ Bestanden |
| Registrierung (doppelt) | User existiert bereits | gleicher username | HTTP 400, Fehlermeldung | ✅ Bestanden |
| Login (gültig) | User registriert | username, password | HTTP 200, JWT-Token | ✅ Bestanden |
| Login (ungültig) | – | falsches Passwort | HTTP 401 | ✅ Bestanden |
| GET /games (mit Token) | Eingeloggt als USER | Bearer Token im Header | HTTP 200, Spielliste | ✅ Bestanden |
| GET /games (ohne Token) | Nicht eingeloggt | kein Header | HTTP 401 | ✅ Bestanden |
| POST /games (als ADMIN) | Eingeloggt als ADMIN | gültige Spieldaten | HTTP 201, neues Spiel | ✅ Bestanden |
| POST /games (als USER) | Eingeloggt als USER | gültige Spieldaten | HTTP 403 Forbidden | ✅ Bestanden |
| DELETE /games/{id} (als ADMIN) | Spiel vorhanden, ADMIN | – | HTTP 204, Spiel gelöscht | ✅ Bestanden |
| Frontend: /games ohne Login | Nicht eingeloggt | direkte URL-Eingabe | Weiterleitung auf /login | ✅ Bestanden |
| Frontend: Login erfolgreich | User existiert | korrekte Credentials | Weiterleitung auf /games | ✅ Bestanden |

---

## Testdurchführung

Alle definierten Testfälle wurden erfolgreich durchgeführt. Die API reagiert stabil und liefert korrekte HTTP-Statuscodes.

Die automatisierten Tests können mit folgendem Befehl ausgeführt werden:

```bash
cd Backend
./mvnw test
```

Alle 13 Tests (8 Service + 5 Controller) werden grün abgeschlossen.
