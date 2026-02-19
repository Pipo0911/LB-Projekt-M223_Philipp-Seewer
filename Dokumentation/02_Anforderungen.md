# Anforderungen

## Funktionale Anforderungen

- Spiele müssen persistent gespeichert werden.
- CRUD-Operationen müssen über REST verfügbar sein.
- Daten müssen serverseitig validiert werden.
- Fehler müssen als strukturierte HTTP-Responses zurückgegeben werden.
- Spiele müssen nach bestimmten Kriterien filterbar sein.

## Nicht-Ziel

Ein Frontend ist nicht Bestandteil der Bewertung im Modul.


---

## User Stories

### User Story 1 – Spiel erfassen
Als Benutzer möchte ich ein neues Spiel erfassen, damit ich meine Bibliothek erweitern kann.

**Akzeptanzkriterien:**
- POST /games erstellt ein neues Spiel
- Pflichtfelder dürfen nicht leer sein
- HTTP 201 wird zurückgegeben

---

### User Story 2 – Spiel anzeigen
Als Benutzer möchte ich alle Spiele anzeigen können, damit ich eine Übersicht meiner Bibliothek habe.

**Akzeptanzkriterien:**
- GET /games liefert alle Spiele
- HTTP 200 wird zurückgegeben

---

### User Story 3 – Spiel bearbeiten
Als Benutzer möchte ich ein Spiel aktualisieren können, damit ich Spielzeit oder Status anpassen kann.

**Akzeptanzkriterien:**
- PUT /games/{id} aktualisiert das Spiel
- Bei nicht vorhandener ID → HTTP 404

---

### User Story 4 – Spiel löschen
Als Benutzer möchte ich ein Spiel löschen können, um meine Bibliothek zu bereinigen.

**Akzeptanzkriterien:**
- DELETE /games/{id} löscht das Spiel
- HTTP 204 bei Erfolg
