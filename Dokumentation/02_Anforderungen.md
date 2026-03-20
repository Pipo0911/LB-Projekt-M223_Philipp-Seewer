# Anforderungen

## Funktionale Anforderungen (M295)

- Spiele müssen persistent gespeichert werden.
- CRUD-Operationen müssen über REST verfügbar sein.
- Daten müssen serverseitig validiert werden.
- Fehler müssen als strukturierte HTTP-Responses zurückgegeben werden.
- Spiele müssen nach bestimmten Kriterien filterbar sein.

## Funktionale Anforderungen (M223 – Erweiterung)

- Benutzer müssen sich registrieren und anmelden können.
- Die API muss mit JWT-Token abgesichert sein.
- Leseoperationen (GET) sind für eingeloggte Benutzer mit ROLE_USER erlaubt.
- Schreiboperationen (POST, PUT, DELETE) sind nur für Benutzer mit ROLE_ADMIN erlaubt.
- Das Frontend muss geschützte Routen bereitstellen (PrivateRoute).
- Nicht eingeloggte Benutzer werden auf die Login-Seite weitergeleitet.

---

## User Stories

### User Story 1 – Spiel erfassen
Als Administrator möchte ich ein neues Spiel erfassen, damit ich die Bibliothek erweitern kann.

**Akzeptanzkriterien:**
- POST /games erstellt ein neues Spiel
- Pflichtfelder dürfen nicht leer sein
- HTTP 201 wird zurückgegeben
- Nur ROLE_ADMIN darf POST ausführen (sonst HTTP 403)

---

### User Story 2 – Spiel anzeigen
Als eingeloggter Benutzer möchte ich alle Spiele anzeigen können, damit ich eine Übersicht der Bibliothek habe.

**Akzeptanzkriterien:**
- GET /games liefert alle Spiele
- HTTP 200 wird zurückgegeben
- Nur eingeloggte Benutzer (ROLE_USER oder ROLE_ADMIN) haben Zugriff

---

### User Story 3 – Spiel bearbeiten
Als Administrator möchte ich ein Spiel aktualisieren können, damit ich Spielzeit oder Status anpassen kann.

**Akzeptanzkriterien:**
- PUT /games/{id} aktualisiert das Spiel
- Bei nicht vorhandener ID → HTTP 404
- Nur ROLE_ADMIN darf PUT ausführen (sonst HTTP 403)

---

### User Story 4 – Spiel löschen
Als Administrator möchte ich ein Spiel löschen können, um die Bibliothek zu bereinigen.

**Akzeptanzkriterien:**
- DELETE /games/{id} löscht das Spiel
- HTTP 204 bei Erfolg
- Nur ROLE_ADMIN darf DELETE ausführen (sonst HTTP 403)

---

### User Story 5 – Registrierung
Als neuer Benutzer möchte ich mich registrieren können, damit ich Zugang zur Applikation erhalte.

**Akzeptanzkriterien:**
- POST /api/auth/signup nimmt Name, E-Mail und Passwort entgegen
- Doppelte Benutzernamen oder E-Mail-Adressen werden abgelehnt (HTTP 400)
- Passwort wird mit BCrypt gehasht gespeichert
- Neuer Benutzer erhält standardmässig ROLE_USER

---

### User Story 6 – Login
Als registrierter Benutzer möchte ich mich anmelden können, um einen JWT-Token zu erhalten.

**Akzeptanzkriterien:**
- POST /api/auth/signin mit Benutzername und Passwort
- Bei Erfolg: HTTP 200 mit JWT-Token, Benutzername, E-Mail und Rollen
- Bei ungültigen Credentials: HTTP 401
- Token wird im Frontend in localStorage gespeichert

---

### User Story 7 – Geschützte Spielliste im Frontend
Als eingeloggter Benutzer möchte ich im Browser die Spielliste sehen können, ohne den direkten API-Zugriff zu kennen.

**Akzeptanzkriterien:**
- Die /games-Route ist nur nach Login zugänglich (PrivateRoute)
- Nicht eingeloggte Benutzer werden auf /login weitergeleitet
- JWT-Token wird automatisch bei jedem API-Request im Authorization-Header mitgesendet
