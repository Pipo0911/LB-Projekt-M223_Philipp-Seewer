# Steam Library Datenbank Setup Anleitung

## Übersicht
Dieses Verzeichnis enthält SQL-Skripte zum Einrichten der kompletten Steam Library Datenbank für das M223 Projekt (JWT Authentication & RBAC Implementation).

## Dateien

### 1. `steam_library_schema.sql`
Enthält die Datenbankschema- und Tabellendefinitionen:
- **Datenbank**: `steam_library`
- **Tabellen**:
  - `users` - Benutzerkonten mit Anmeldedaten
  - `user_roles` - Rollenzuweisungen (ROLE_USER, ROLE_ADMIN)
  - `games` - Spiel-Datensätze mit Metadaten

### 2. `steam_library_testdata.sql`
Enthält Testdaten für Entwicklung und Demonstration:
- **4 Test-Benutzer**: alice, bob, charlie, admin_user
- **12 Beispiel-Spiele**: 3 pro Benutzer (plus 2 für admin)
- **Rollenzuweisungen**: Benutzer haben Lesezugriff, Admin hat volle CRUD-Rechte

## Setup-Anleitung

### Option 1: Mit MySQL CLI

```bash
# Mit MySQL verbinden
mysql -u root -p

# Schema ausführen
mysql -u root -p steam_library < steam_library_schema.sql

# Testdaten ausführen
mysql -u root -p steam_library < steam_library_testdata.sql
```

### Option 2: Mit MySQL Workbench

1. MySQL Workbench öffnen
2. Neue Query-Registerkarte erstellen
3. `steam_library_schema.sql` öffnen und ausführen
4. `steam_library_testdata.sql` öffnen und ausführen
5. In den Datentabellen überprüfen

### Option 3: Mit Docker

```bash
# MySQL-Container starten
docker run --name mysql-steam -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8

# Dateien in Container kopieren
docker cp steam_library_schema.sql mysql-steam:/tmp/
docker cp steam_library_testdata.sql mysql-steam:/tmp/

# Skripte ausführen
docker exec mysql-steam mysql -uroot -proot < /tmp/steam_library_schema.sql
docker exec mysql-steam mysql -uroot -proot steam_library < /tmp/steam_library_testdata.sql
```

## Test-Benutzer

Alle Test-Benutzer verwenden das Passwort: `password123`

| Benutzername | Email | Rolle | Zweck |
|----------|-------|------|---------|
| alice | alice@test.ch | ROLE_USER | Lesezugriff Test-Benutzer |
| bob | bob@test.ch | ROLE_USER | Lesezugriff Test-Benutzer |
| charlie | charlie@test.ch | ROLE_USER | Lesezugriff Test-Benutzer |
| admin_user | admin@test.ch | ROLE_ADMIN | Admin-Benutzer |

## Beispiel-Spiele

Jeder Benutzer hat einen kuratierten Satz von Spielen:

### Alice (Story/RPG Spiele)
- The Witcher 3 (150 Stunden)
- Cyberpunk 2077 (80 Stunden)
- Portal 2 (25 Stunden)

### Bob (Souls-like Spiele)
- Elden Ring (200 Stunden)
- Dark Souls 3 (120 Stunden)
- Sekiro Shadows Die Twice (90 Stunden)

### Charlie (Entspannende/Lang-Spiele)
- Valheim (300 Stunden)
- Minecraft (1000 Stunden)
- Stardew Valley (450 Stunden)

### Admin-Benutzer
- Half-Life 2 (30 Stunden)
- Counter-Strike 2 (500 Stunden)

## Datenbankschema Details

### Users Tabelle
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User Roles Tabelle
```sql
CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    roles VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Games Tabelle
```sql
CREATE TABLE games (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    steam_app_id BIGINT,
    playtime_hours INT DEFAULT 0,
    installed BOOLEAN DEFAULT false,
    price DECIMAL(10, 2),
    last_played DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Sicherheits-Hinweise

- Alle Passwörter sind BCrypt-gehashed (10 Runden Salz)
- Das Passwort `password123` wird nur für Testzwecke bereitgestellt
- In der Produktion müssen Benutzer ihre Passwörter nach dem initialen Setup ändern
- Foreign Key Constraints verhindern verwaiste Spiel-Datensätze

## Überprüfung

Nach dem Setup mit diesen Abfragen überprüfen:

```sql
-- Benutzer überprüfen
SELECT COUNT(*) as user_count FROM users;

-- Rollen überprüfen
SELECT username, roles FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Spiele überprüfen
SELECT u.username, COUNT(*) as game_count
FROM games g
JOIN users u ON g.user_id = u.id
GROUP BY u.id;
```

## Umgebungs-Konfiguration

Spring Boot `application.properties` aktualisieren:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/steam_library
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

## Bereinigung

Um die Datenbank zurückzusetzen:

```bash
# Gesamte Datenbank löschen
mysql -u root -p -e "DROP DATABASE steam_library;"

# Setup-Skripte von vorne ausführen
```

---

**Zuletzt aktualisiert**: 2026-03-20
**Projekt**: M223 - JWT Authentication & RBAC Implementation
**Autor**: Philipp Seewer
