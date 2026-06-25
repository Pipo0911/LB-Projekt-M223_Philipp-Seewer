# 🎮 Demo-Start-Anleitung — Steam Library (M223)

> **Ziel:** Auf einem frischen Notebook von Null bis zur laufenden Live-Demo.
> Folge den Schritten der Reihe nach. Jeder Schritt hat eine **Prüfung**, ob er geklappt hat.

---

## ⚡ Kurzfassung (wenn alles installiert ist)

Du brauchst **3 Terminals**:

| Terminal | Befehl | Läuft auf |
|---|---|---|
| 1 – Datenbank | `docker run ...` (siehe Schritt 4) | Port 3306 |
| 2 – Backend | `cd Backend` → `.\mvnw.cmd spring-boot:run` | http://localhost:8080 |
| 3 – Frontend | `cd Front-End` → `npm run dev` | http://localhost:5173 |

Dann Admin anlegen (Schritt 6) → fertig.

---

## 📋 Teil 0 — Was muss installiert sein? (einmalig prüfen)

Öffne PowerShell und prüfe jedes Tool. **Fehlt eins → vorher installieren!**

| Tool | Prüf-Befehl | Erwartet | Download falls fehlt |
|---|---|---|---|
| **GitHub Desktop** | (App öffnen) | startet | desktop.github.com |
| **Java (JDK 21+)** | `java -version` | `version "21"` o. höher | adoptium.net |
| **Docker Desktop** | `docker --version` | `Docker version ...` | docker.com/products/docker-desktop |
| **Node.js (18+)** | `node --version` | `v18` o. höher | nodejs.org |
| **Insomnia** | (App öffnen) | startet | insomnia.rest |

> 💡 **Schul-Notebook:** Falls du Programme nicht selbst installieren darfst, kläre das **vorher** mit der Schule ab. Ohne Docker + Java + Node läuft die Demo nicht.

---

## 🏠 Teil 1 — VORHER zu Hause erledigen (WICHTIG!)

Damit auf dem Notebook **alles** dabei ist:

1. **Code-Fix committen + pushen** (sonst fehlt das 401-Verhalten!). In GitHub Desktop:
   - Du siehst die geänderten Dateien (u. a. `SecurityConfig.java` und diese Anleitung).
   - Unten **Summary** eingeben, z. B. `fix: 401 + Demo-Anleitung`.
   - **Commit to main** → dann oben **Push origin**.
2. **Prüfen:** Auf github.com im Repo nachsehen, dass `SecurityConfig.java` die Zeile mit `HttpStatusEntryPoint` enthält.

> ⚠️ Ohne diesen Push ziehst du am Samstag die **alte** Version (403 statt 401).

---

## 🏫 Teil 2 — Am Samstag in der Schule

### Schritt 1 — Projekt klonen (GitHub Desktop)
1. GitHub Desktop öffnen → **File → Clone Repository**.
2. `LB-Projekt-M223_Philipp-Seewer` auswählen → **Clone**.
3. Merk dir den Zielordner (Standard: `Dokumente\GitHub\LB-Projekt-M223_Philipp-Seewer`).

**Prüfung:** Das Projekt erscheint in GitHub Desktop ohne Fehler.

---

### Schritt 2 — Terminal im Projekt öffnen
In GitHub Desktop: **Repository → Open in Command Prompt** (oder PowerShell).
→ Damit bist du **automatisch im richtigen Ordner** und musst keinen Pfad tippen.

**Prüfung:** `ls` (bzw. `dir`) zeigt die Ordner `Backend`, `Front-End`, `Dokumentation`.

---

### Schritt 3 — Docker Desktop starten
1. **Docker Desktop** über das Startmenü starten.
2. Warten, bis das Wal-Symbol unten **grün/„running"** zeigt (kann 1–2 Min dauern).

**Prüfung:** `docker ps` läuft ohne Fehler (zeigt evtl. leere Liste).

---

### Schritt 4 — Datenbank starten (Terminal 1)
Eine Zeile (alles kopieren):
```powershell
docker run --name mysql-steam -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=steam_library -e MYSQL_USER=steam_user -e MYSQL_PASSWORD=steam_pass -p 3306:3306 -d mysql:8
```
Das erstellt die DB `steam_library` + Benutzer `steam_user/steam_pass` — **passt exakt** zur `application.properties`, keine Konfig nötig.

**Prüfung:** Nach ~20 Sek:
```powershell
docker exec -i mysql-steam mysql -uroot -proot -e "SHOW DATABASES;"
```
→ `steam_library` ist in der Liste.

> Falls „name is already in use": `docker start mysql-steam` (Container existiert schon).

---

### Schritt 5 — Backend starten (Terminal 2)
Im Projektordner (Schritt 2):
```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```
> ⏳ **Beim allerersten Mal** lädt Maven viele Pakete (braucht **Internet** + ein paar Minuten). Nicht abbrechen!

**Prüfung:** Am Ende erscheint `Started SteamLibraryApplication in ... seconds`.
Test im Browser: http://localhost:8080/api/games → zeigt `401` o. JSON (= API antwortet).

---

### Schritt 6 — Admin-Benutzer anlegen & befördern
Der frische Container hat **keine Benutzer**. Lege den Admin an:

**6a. Registrieren** (neues Terminal oder Insomnia „POST signup – admin"):
```powershell
curl.exe -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d '{\"name\":\"admin\",\"email\":\"admin@test.ch\",\"password\":\"test123\"}'
```
→ Antwort: `{"message":"Registrierung erfolgreich"}`

**6b. Zur ADMIN-Rolle befördern:**
```powershell
docker exec -i mysql-steam mysql -uroot -proot steam_library -e "INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM users WHERE username='admin'), 'ROLE_ADMIN');"
```

**6c. (Optional) Normalen User für die 403-Demo:**
```powershell
curl.exe -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d '{\"name\":\"user\",\"email\":\"user@test.ch\",\"password\":\"test123\"}'
```

**Prüfung:**
```powershell
docker exec -i mysql-steam mysql -uroot -proot steam_library -e "SELECT u.username, ur.role FROM users u JOIN user_roles ur ON u.id=ur.user_id;"
```
→ `admin` hat `ROLE_USER` **und** `ROLE_ADMIN`.

**Zugangsdaten:** `admin` / `test123` · `user` / `test123`

---

### Schritt 7 — Frontend starten (Terminal 3, optional für die UI)
```powershell
cd Front-End
npm install
npm run dev
```
> ⏳ `npm install` nur beim ersten Mal (braucht Internet).

**Prüfung:** Browser → http://localhost:5173 → Login-Seite erscheint.
Login mit `admin` / `test123` → Spiele-Seite.

---

### Schritt 8 — Insomnia einrichten
1. Insomnia öffnen → **Import** → Datei `M223_Insomnia_Collection.json`
   *(liegt nicht im Repo — vorher auf USB-Stick / OneDrive kopieren!)*
2. Collection **„M223 Steam Library – Demo"** öffnen, Umgebung auf **Base Environment**.
3. **„POST signin – admin"** → Send → `token` kopieren.
4. ⚙️ Umgebung öffnen → bei `admin_token` einfügen.
5. (Für 403) `signin – user` → Token in `user_token` einfügen.

> 💡 Falls Insomnia fehlt/nicht erlaubt ist: Die Demo geht auch komplett mit `curl.exe` (siehe Schritt 9).

---

### Schritt 9 — Generalprobe: der Demo-Ablauf
Klick in Insomnia (oder per curl) der Reihe nach:

| # | Request | Erwartet | Aussage |
|---|---|---|---|
| 1 | GET games – OHNE Token | **401** | „nicht eingeloggt" |
| 2 | GET games – MIT Token | **200** | „USER darf lesen" |
| 3 | POST games – als ADMIN | **201** | „ADMIN darf schreiben" |
| 4 | POST games – als USER | **403** | „USER darf NICHT schreiben (RBAC)" |

**Wenn alle 4 stimmen, ist deine Demo bereit. 🎉**

---

## 🆘 Troubleshooting

| Problem | Lösung |
|---|---|
| `cd Backend` findet nichts | Du bist im falschen Ordner → Schritt 2 (Terminal über GitHub Desktop öffnen). |
| Backend bricht mit DB-Fehler ab | Datenbank läuft nicht → Schritt 3 + 4 zuerst. `docker ps` prüfen. |
| `docker: name already in use` | `docker start mysql-steam` (Container existiert bereits). |
| Port 3306/8080 belegt | Alten Prozess beenden oder Notebook neu starten. |
| `Benutzername bereits vergeben` | Admin existiert schon → einfach weiter zu Schritt 6b/Login. |
| Bekomme **403 statt 401** ohne Token | Der SecurityConfig-Fix fehlt → du hast die alte Version gezogen (Teil 1!). |
| `mvnw.cmd nicht erkannt` | Du bist nicht im `Backend`-Ordner. |
| Frontend zeigt Login-Fehler | Backend läuft nicht (Schritt 5) oder DB fehlt. |

---

## ✅ Finale Checkliste (kurz vor der Präsentation)

- [ ] Docker Desktop läuft (grün)
- [ ] DB-Container läuft (`docker ps`)
- [ ] Backend läuft (`Started SteamLibraryApplication`)
- [ ] `admin` existiert mit ROLE_ADMIN
- [ ] Insomnia-Collection importiert, Tokens gesetzt
- [ ] Generalprobe 401 → 200 → 201 → 403 erfolgreich
- [ ] (Optional) Frontend läuft auf :5173

**Tipp:** Komm **30 Minuten früher** und mach den ganzen Durchlauf einmal — dann läuft der erste (langsame) Maven-/npm-Download nicht kurz vor der Präsentation.

---

*Zugangsdaten Demo: `admin` / `test123` · `user` / `test123`*
