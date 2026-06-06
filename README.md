# Steam Library App – Dokumentation

![Badge](https://img.shields.io/badge/Java-21-blue) ![Badge](https://img.shields.io/badge/Spring%20Boot-3.3.2-green) ![Badge](https://img.shields.io/badge/React-Vite-purple) ![Badge](https://img.shields.io/badge/MySQL-8.0-orange)

Eine moderne Multi-User-Webanwendung zur Verwaltung einer persönlichen Spielebibliothek. Das Projekt demonstriert eine vollständige Full-Stack-Architektur mit JWT-Authentifizierung, rollenbasierten Zugriffskontrollen und einem responsiven React-Frontend.

**Module:** M295 (REST-API) | M223 (Web-App mit Authentifizierung)

---

## Inhaltsverzeichnis

- [Features](#features)
- [Architektur](#architektur)
- [Technologie-Stack](#technologie-stack)
- [Installation & Setup](#installation--setup)
- [Verwendung](#verwendung)
- [API-Dokumentation](#api-dokumentation)
- [Datenbank](#datenbank)
- [Docker-Deployment](#docker-deployment)
- [Testing](#testing)
- [Dokumentation](#dokumentation)

---

## Features

### Benutzerseite
- **Registrierung & Login** – JWT-Token-basierte Authentifizierung
- **Spielebibliothek anzeigen** – Alle erfassten Spiele einsehen (READ-Zugriff)
- **Geschützte Routen** – Automatische Weiteleitung nicht angemeldeter Benutzer zur Login-Seite

### Administrator-Seite
- **Spiele hinzufügen** – Neue Spiele mit vollständigen Informationen erfassen
- **Spiele bearbeiten** – Existierende Spieleinformationen aktualisieren
- **Spiele löschen** – Spieleinträge aus der Bibliothek entfernen
- **Spiele filtern** – Nach verschiedenen Kriterien suchen und filtern

### System
- **Validierung** – Server- und Client-seitige Eingabevalidierung
- **Fehlerbehandlung** – Strukturierte HTTP-Error-Responses
- **RBAC** – Rollenbasierte Zugriffskontrolle (ROLE_USER, ROLE_ADMIN)
- **Persistierung** – Relationale Datenbank (MySQL) für Daten- und Benutzerverwaltung

---

## Architektur

```
Steam Library App
│
├── Backend (Spring Boot REST-API)
│   ├── auth/ – JWT-Authentifizierung & Autorisierung
│   ├── controller/ – REST-Endpoints
│   ├── service/ – Geschäftslogik
│   ├── model/ – Datenbankentitäten
│   ├── repository/ – Datenzugriff (JPA)
│   └── config/ – Security & CORS-Konfiguration
│
├── Frontend (React + Vite)
│   ├── components/ – Wiederverwendbare UI-Komponenten
│   ├── pages/ – Seiten (Login, Register, Games)
│   ├── hooks/ – Custom React Hooks
│   ├── services/ – API-Integration
│   └── contexts/ – State Management (Auth)
│
└── Database (MySQL)
    ├── games – Spiele
    └── users – Benutzerkonten & Rollen
```

---

## Technologie-Stack

| Layer | Technologie | Version |
|-------|------------|---------|
| **Runtime** | Java | 21 (LTS) |
| **Backend Framework** | Spring Boot | 3.3.2 |
| **Web** | Spring Web MVC | 3.3.2 |
| **Authentifizierung** | Spring Security | 3.3.2 |
| **JWT** | JJWT (jsonwebtoken) | 0.12.6 |
| **Persistierung** | Spring Data JPA | 3.3.2 |
| **Datenbank** | MySQL | 8.0+ |
| **Build-Tool** | Maven | 3.9+ |
| **Frontend Framework** | React | 18+ |
| **Build-Tool Frontend** | Vite | 5+ |
| **Validierung** | Jakarta Bean Validation | 3.0+ |
| **Testing** | JUnit 5 + Mockito | - |

---

## Installation & Setup

### Voraussetzungen

- **Java 21** (LTS) – [Download](https://www.oracle.com/java/technologies/downloads/)
- **MySQL 8.0+** – [Download](https://www.mysql.com/downloads/)
- **Node.js 18+** – [Download](https://nodejs.org/)
- **Maven 3.9+** – Ist im Projekt enthalten (Maven Wrapper: `mvnw.cmd`)

### Backend Setup

#### 1. Repository klonen
```bash
cd Backend
```

#### 2. Datenbank initialisieren
```bash
# Datenbank erstellen und mit Testdaten füllen
mysql -u root -p < ../steam_library_schema.sql
mysql -u root -p < ../steam_library_testdata.sql
```

#### 3. Umgebungsvariablen konfigurieren
Datei `Backend/src/main/resources/application.properties` anpassen:

```properties
# MySQL-Verbindung
spring.datasource.url=jdbc:mysql://localhost:3306/steam_library
spring.datasource.username=root
spring.datasource.password=<dein-passwort>

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT-Secret
jwt.secret=<dein-geheimes-key-256-zeichen>
jwt.expiration=3600000
```

#### 4. Backend starten
```bash
# Mit Maven Wrapper (Windows)
mvnw.cmd clean package
mvnw.cmd spring-boot:run

# Oder direkt:
java -jar target/steam-library-0.0.1-SNAPSHOT.jar
```

Backend läuft dann unter: **http://localhost:8080**

### Frontend Setup

#### 1. Dependencies installieren
```bash
cd Front-End
npm install
```

#### 2. Umgebungsvariablen konfigurieren
Datei `Front-End/src/config.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8080';
```

#### 3. Development-Server starten
```bash
npm run dev
```

Frontend läuft dann unter: **http://localhost:5173**

#### 4. Tests ausführen
```bash
npm run test
```

---

## Verwendung

### 1. Registrierung
- Öffne http://localhost:5173
- Klicke auf „Register"
- Fülle das Formular aus
- **Neue Benutzer erhalten standardmäßig die Rolle ROLE_USER**

### 2. Admin-Benutzer erstellen (Optional)
Benutzer manuell in der Datenbank mit ROLE_ADMIN erstellen:

```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE username = 'admin-benutzer';
```

Oder über SQL-Setup:
```bash
mysql -u root -p steam_library < test-users-setup.sql
```

### 3. Login
- Gib deine Anmeldedaten ein
- Du erhältst einen JWT-Token
- Token wird automatisch in lokalen Cookies gespeichert

### 4. Spiele verwalten
- **Benutzer (ROLE_USER)**: Können Spiele anzeigen und filtern
- **Admins (ROLE_ADMIN)**: Können zusätzlich Spiele hinzufügen, bearbeiten und löschen

---

## API-Dokumentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "user123",
  "role": "ROLE_USER"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "securepass123"
}
```

### Games API

#### Alle Spiele abrufen (authentifiziert)
```http
GET /api/games
Authorization: Bearer <JWT-Token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Elden Ring",
    "developer": "FromSoftware",
    "releaseYear": 2022,
    "genre": "Action RPG",
    "platform": "PC"
  }
]
```

#### Spiel erstellen (nur Admin)
```http
POST /api/games
Authorization: Bearer <JWT-Token>
Content-Type: application/json

{
  "name": "Baldur's Gate 3",
  "developer": "Larian Studios",
  "releaseYear": 2023,
  "genre": "RPG",
  "platform": "PC"
}
```

**Response (201 Created):**
```json
{
  "id": 42,
  "name": "Baldur's Gate 3",
  "developer": "Larian Studios",
  "releaseYear": 2023,
  "genre": "RPG",
  "platform": "PC"
}
```

#### Spiel aktualisieren (nur Admin)
```http
PUT /api/games/{id}
Authorization: Bearer <JWT-Token>
Content-Type: application/json

{
  "name": "Baldur's Gate 3",
  "developer": "Larian Studios",
  "releaseYear": 2023,
  "genre": "CRPG",
  "platform": "PC, PlayStation 5"
}
```

#### Spiel löschen (nur Admin)
```http
DELETE /api/games/{id}
Authorization: Bearer <JWT-Token>
```

**Response (204 No Content)**

---

## Datenbank

### Schema

#### users-Tabelle
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ROLE_USER', 'ROLE_ADMIN') DEFAULT 'ROLE_USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### games-Tabelle
```sql
CREATE TABLE games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  developer VARCHAR(255),
  release_year INT,
  genre VARCHAR(100),
  platform VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Testdaten initialisieren
```bash
mysql -u root -p steam_library < steam_library_testdata.sql
```

---

## Docker-Deployment

### Dockerfile (Backend)

Das Projekt enthält einen `Dockerfile` für die Backend-Containerisierung.

#### Image bauen
```bash
cd Backend
docker build -t steam-library-api .
```

#### Container starten
```bash
docker run -d \
  --name steam-library-api \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/steam_library \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=<passwort> \
  steam-library-api
```

#### Mit Docker Compose (empfohlen)
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: steam_library
    volumes:
      - ./steam_library_schema.sql:/docker-entrypoint-initdb.d/schema.sql
      - ./steam_library_testdata.sql:/docker-entrypoint-initdb.d/testdata.sql
    ports:
      - "3306:3306"

  api:
    build: ./Backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/steam_library
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - mysql

  frontend:
    build: ./Front-End
    ports:
      - "5173:5173"
```

Starten mit: `docker-compose up -d`

---

## Testing

### Backend-Tests
```bash
cd Backend
mvnw.cmd test
```

Tests sind in `Backend/src/test/java/ch/wiss/m223/steamlibrary/` vorhanden.

**Test-Coverage:**
- Controller-Tests – REST-Endpoints
- Service-Tests – Geschäftslogik
- Integration Tests – API-Endpoints

### Frontend-Tests
```bash
cd Front-End
npm run test
```

### Manuelles Testing (Postman/curl)
1. **User registrieren**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"test123"}'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"test123"}'
   ```

3. **Mit Token Spiele abrufen**
   ```bash
   curl -H "Authorization: Bearer <JWT-TOKEN>" \
     http://localhost:8080/api/games
   ```

---

## Dokumentation

Detaillierte Dokumentation:

| Datei | Beschreibung |
|-------|------------|
| [Dokumentation/01_Projektübersicht.md](Dokumentation/01_Projektübersicht.md) | Projektidee & Ziele |
| [Dokumentation/02_Anforderungen.md](Dokumentation/02_Anforderungen.md) | Funktionale & Non-funktionale Anforderungen |
| [Dokumentation/03_Architektur.md](Dokumentation/03_Architektur.md) | System-Architektur & Komponenten |
| [Dokumentation/04_Implementierung.md](Dokumentation/04_Implementierung.md) | Technische Implementierungsdetails |
| [Dokumentation/05_Testing.md](Dokumentation/05_Testing.md) | Test-Strategie & Cases |
| [Dokumentation/06_Betrieb_Installation.md](Dokumentation/06_Betrieb_Installation.md) | Betrieb & Deployment |
| [Dokumentation/07_Reflexion.md](Dokumentation/07_Reflexion.md) | Lernerkenntnisse & Reflexion |

---

## Konfiguration

### Backend (application.properties)

```properties
# Server
server.port=8080
server.servlet.context-path=/

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/steam_library
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=<256-character-secret-key>
jwt.expiration=3600000

# Logging
logging.level.root=INFO
logging.level.ch.wiss.m223=DEBUG
```

### Frontend (config.js)

```javascript
export const API_BASE_URL = 'http://localhost:8080';
export const TIMEOUT = 10000;
```

---

## 🔐 Sicherheit

- ✅ **JWT-Token-basierte Authentifizierung**
- ✅ **Spring Security mit RBAC**
- ✅ **Eingabevalidierung** (Server- & Client-seitig)
- ✅ **CORS-Konfiguration** für Frontend-Integration
- ✅ **Passwort-Hashing** (Spring Security BCrypt)
- ✅ **Rollenbasierte Zugriffskontrolle**

---

## Statistiken

- **Backend LOC:** ~1200+
- **Frontend LOC:** ~800+
- **Database Tables:** 2 (users, games)
- **API Endpoints:** 6+ (auth + CRUD games)
- **Test Coverage:** Unit & Integration Tests

---

## Beiträge

Dieses Projekt wurde als Schulprojekt entwickelt. Für Verbesserungsvorschläge oder Fehlerberichte bitte die Dokumentation unter `Dokumentation/07_Reflexion.md` einsehen.

---

## Lizenz

Schulprojekt – M223/M295 (WISS Ausbildung)

---

## Autor

**Philipp Seewer**

Projekt: LB-Projekt-M223_Philipp-Seewer

---

## Letzte Änderungen

- Projektstruktur aufgebaut
- JWT-Authentifizierung implementiert
- React-Frontend mit geschützten Routen
- Docker-Integration
- Umfassende Dokumentation

---

**Für Fragen oder Probleme:** Siehe Dokumentation im Ordner `Dokumentation/`
