# Architektur

## Technologie-Stack

Die Applikation wurde mit folgenden Technologien umgesetzt:

- Java 17
- Spring Boot 3
- Maven
- MySQL
- JPA / Hibernate
- JUnit (Unit-Tests)

---

## Systemarchitektur

Die Architektur folgt dem klassischen Schichtenmodell:

Client → Controller → Repository → Datenbank

1. Ein Client sendet einen HTTP-Request an die REST-API.
2. Der Controller verarbeitet die Anfrage.
3. Die Daten werden mittels Bean Validation validiert.
4. Das Repository greift über JPA auf die MySQL-Datenbank zu.
5. Eine strukturierte JSON-Response wird zurückgegeben.

---

## Klassendiagramm

### Klasse: Game

| Attribut | Typ | Beschreibung |
|----------|------|-------------|
| id | Long | Primärschlüssel |
| steamAppId | Integer | Eindeutige Steam-ID |
| title | String | Name des Spiels |
| playtimeHours | Integer | Spielzeit in Stunden |
| installed | Boolean | Installationsstatus |
| lastPlayed | LocalDate | Datum der letzten Nutzung |

Aktuell besteht das System aus einer zentralen Entität (`Game`).  
Beziehungen zu weiteren Entitäten sind nicht implementiert.
