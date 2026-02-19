# Steam Library REST-API (M295)

Dieses Projekt wurde im Rahmen des Moduls M295 entwickelt.

Es handelt sich um eine REST-API zur Verwaltung einer persönlichen Spielebibliothek.
Die API ermöglicht das Erfassen, Anzeigen, Bearbeiten, Löschen und Filtern von Spielen.

---

## Technologien

- Java 17
- Spring Boot 3
- Maven
- MySQL
- JPA / Hibernate
- JUnit

---

## REST-Endpunkte

| Methode | Endpoint | Beschreibung |
|----------|-----------|--------------|
| GET | /games | Alle Spiele abrufen |
| GET | /games/{id} | Einzelnes Spiel abrufen |
| POST | /games | Neues Spiel erstellen |
| PUT | /games/{id} | Spiel aktualisieren |
| DELETE | /games/{id} | Spiel löschen |

---

## Projekt starten

### Voraussetzungen
- Java 17
- Maven
- MySQL

### Datenbank erstellen

```sql
CREATE DATABASE steam_library;
