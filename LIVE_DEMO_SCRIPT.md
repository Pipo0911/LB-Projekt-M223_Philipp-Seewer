# M223 Live Demo Script (8 Minuten)

## Timing: 8 Minuten gesamt
- Intro & Überblick: 1 min
- System-Architektur zeigen: 1 min
- Registration Demo: 1 min
- Login & JWT Demo: 1.5 min
- RBAC in Aktion: 1.5 min
- Frontend Features: 1 min
- Fazit: 0.5 min

---

## Vorbereitung (vor der Demo)

### 1. Terminal Fenster vorbereiten

```bash
# Terminal 1: Backend (MySQL + Spring Boot)
cd Backend
./mvnw spring-boot:run
# Warten bis: "Tomcat started on port(s): 8080"

# Terminal 2: Frontend (React Dev Server)
cd Front-End
npm run dev
# Warten bis: "Local:   http://localhost:5173/"

# Terminal 3: Optional - API Testing mit curl
cd projekt-root
```

### 2. Browser öffnen
- Öffne http://localhost:5173 in den Browser
- Halte http://localhost:8080/swagger-ui.html bereit (optional, für API-Dokumentation)

### 3. Screenshots vorbereiten (falls nötig)
- Screenshots von Datenbank-Tabellen
- Logs des Backends

---

## LIVE DEMO SCRIPT

### ⏱ 0:00-1:00 - Intro & Überblick (1 Minute)

**Was du zeigst:**
"Willkommen zu meiner M223 Präsentation. Ich präsentiere die Steam Library Manager Anwendung - ein vollständiges Web-System mit:
- React 18 Frontend
- Spring Boot 3 REST API Backend
- JWT Authentication & RBAC
- MySQL Datenbank

Das Projekt zeigt moderne Best Practices für sichere Web-Anwendungen mit Role-Based Access Control."

**Zeige kurz:**
- Frontend auf Bildschirm (http://localhost:5173)
- Die Login-Seite mit Eingabefeldern sichtbar

---

### ⏱ 1:00-2:00 - System-Architektur (1 Minute)

**Was du erklärst:**
"Die Architektur besteht aus drei Schichten:
1. Frontend: React mit AuthContext für globalen Authentication-State
2. Backend: Spring Boot mit Spring Security & JwtAuthFilter
3. Datenbank: MySQL mit User- und Game-Tabellen

Der Authentifizierungs-Ablauf:
- Benutzer meldet sich an
- Backend validiert Credentials und gibt JWT-Token
- Token wird im Frontend gespeichert
- Bei jedem API-Request wird der Token im Authorization-Header mitgesendet"

**Zeige auf dem Bildschirm:**
- Öffne kurz Backend-Logs (Terminal sichtbar)
- Oder zeige das Klassendagram aus der Dokumentation

---

### ⏱ 2:00-3:00 - Registration Demo (1 Minute)

**Aktion in Frontend:**
1. Klicke auf "Register" Link
2. Fülle das Registrierungs-Formular aus:
   - Username: `testuser2026` (neuer eindeutiger Name)
   - Email: `test@example2026.com`
   - Password: `Test123456`
3. Klicke "Register" Button
4. **Erwartung:** "Registration successful!" Nachricht angezeigt

**Was du sprichst:**
"Hier sehen Sie die Registrierungs-Funktionalität. Der Benutzer gibt Name, E-Mail und Passwort ein. Das Passwort wird mit BCrypt gehasht auf dem Server gespeichert - es wird NIEMALS im Klartext gespeichert. Der neue Benutzer erhält automatisch die ROLE_USER Rolle."

---

### ⏱ 3:00-4:30 - Login & JWT Demo (1.5 Minuten)

**Aktion in Frontend:**
1. Navigiere zur Login-Seite (sollte automatisch sein nach Registration)
2. Gib Login-Daten ein:
   - Username: `admin_user`
   - Password: `password123`
3. Klicke "Login" Button
4. **Erwartung:** Umleitung auf /games Seite, Spielliste wird angezeigt

**Was du sprichst:**
"Der Login sendet Benutzername und Passwort an POST /api/auth/signin. Der Server validiert die Credentials mit BCrypt und generiert einen JWT-Token, der 24 Stunden gültig ist. Der Token wird im Frontend in localStorage gespeichert und automatisch bei jedem API-Request mitgesendet."

**Optional - JWT Token Inspection:**
5. Öffne Browser DevTools (F12)
6. Gehe zu Application → LocalStorage → http://localhost:5173
7. Zeige den `token` Eintrag (längere Base64-String)
8. **Kommentar:** "Das ist der JWT-Token. Er besteht aus drei Teilen: Header, Payload mit Rollen-Claims, und digitale Signatur."

---

### ⏱ 4:30-6:00 - RBAC in Aktion (1.5 Minuten)

**Szenario 1: Benutzer mit ROLE_USER sieht nur Lesezugriff**

Aktion:
1. Mit `admin_user` (ROLE_ADMIN) angemeldet
2. Zeige die Games-Tabelle mit 8 vorgeladenen Spielen
3. Zeige die "Add Game" Button (als ADMIN sichtbar)
4. Logout Klick (oben rechts)

**Dann mit normalem User einloggen:**
5. Login mit: `user1 / password123` (ROLE_USER)
6. Zeige die Games-Tabelle - **die Spiele werden angezeigt** (GET funktioniert)
7. Scrolle nach unten - **kein "Add Game" Button sichtbar** (Frontend versteckt ihn)
8. **Kommentar:** "Der ROLE_USER kann die Spiele anschauen, aber keine neuen erstellen. Das ist RBAC auf Basis von Rollen."

**Szenario 2: API-Level RBAC (Terminal Demo - optional)**

Aktion (in Terminal 3 mit curl):
```bash
# Mit User Token versuchen ein Spiel zu erstellen (sollte 403 Forbidden geben)
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password123"}' | jq -r '.token')

curl -X POST http://localhost:8080/api/games \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","steamAppId":12345}' \
  -i
# Response: HTTP 403 Forbidden
```

**Was du sprichst:**
"Selbst wenn das Frontend keine Buttons anzeigt, ist die API auf der Server-Seite geschützt. Eine POST-Anfrage von einem ROLE_USER wird mit HTTP 403 Forbidden abgelehnt. Das ist mehrschichtige Sicherheit."

---

### ⏱ 6:00-7:00 - Frontend Features (1 Minute)

**Mit ROLE_ADMIN angemeldet zeigen:**

1. Die Spiel-Tabelle mit 8 Spielen
2. Edit-Button bei einem Spiel - Klick → Edit Modal öffnet
3. Ändere ein Feld (z.B. Playtime) und klick "Save"
4. Tabelle aktualisiert sich automatisch
5. Delete-Button - Klick → Spiel wird gelöscht
6. Zeige responsive Design - Öffne Developer Tools und resiziere auf Mobile

**Was du sprichst:**
"Das Frontend ist vollständig funktional - Benutzer können Games erstellen, editieren und löschen (wenn sie ROLE_ADMIN haben). Das Design ist responsive und funktioniert auf mobilen Geräten genauso gut. Die API-Integration ist nahtlos - der Token wird automatisch verwaltet."

---

### ⏱ 7:00-7:30 - Zusätzliche Features (Optional) (0.5 Minuten)

Falls noch Zeit:
- Zeige PrivateRoute in Aktion: Logout + direkt http://localhost:5173/games öffnen → Weiterleitung auf /login
- Zeige Backend Logs (Terminal 1) für die API-Requests

---

### ⏱ 7:30-8:00 - Fazit (0.5 Minuten)

**Schließendes Statement:**

"Zusammengefasst habe ich gezeigt:

1. **Authentifizierung**: JWT-basierter Login mit Token-Verwaltung
2. **Authorization**: Rollenbasierte Zugriffskontrolle auf zwei Ebenen
   - Frontend: UI-Elemente werden basierend auf Rollen angezeigt
   - Backend: API-Endpunkte sind mit Spring Security geschützt
3. **Sichere Datenhandhabung**: BCrypt für Passwörter, JWT für Token-Signatur
4. **Responsive Frontend**: React mit Context API für State-Management
5. **Umfassende Tests**: 13 automatisierte Tests für Qualitätssicherung

Das Projekt erfüllt alle Anforderungen der M223 und M295 Module und demonstriert Best Practices für sichere Web-Anwendungen."

---

## Troubleshooting Tipps

| Problem | Lösung |
|---------|--------|
| Backend startet nicht | Prüfe MySQL läuft, Port 8080 frei, Java 11+ installiert |
| Frontend laden fehlgeschlagen | npm install ausführen, Port 5173 frei, Node.js 16+ |
| Login funktioniert nicht | Prüfe Datenbank ist initialisiert, test-users-setup.sql ausgeführt |
| API 403 Errors | Token könnte abgelaufen sein, erneut einloggen, Browser Cache löschen |
| Änderungen sichtbar nicht | Browser Reload (F5), Redux Dev Tools für Debugging öffnen |

---

## Quick Commands

```bash
# Alle drei Services starten (parallel in verschiedenen Terminals)
# Terminal 1:
cd Backend && ./mvnw spring-boot:run

# Terminal 2:
cd Front-End && npm run dev

# Terminal 3 (optional - für API Playground):
# Einfach Browser öffnen: http://localhost:5173
```

---

## Weitere Ressourcen

- **Dokumentation:** M223_Dokumentation.docx (11 Sektionen)
- **Präsentation:** M223_Presentation.pptx (8 Slides)
- **Code:** GitHub Repository mit git history
- **Tests:** Backend/src/test/ für Unit & Integration Tests
