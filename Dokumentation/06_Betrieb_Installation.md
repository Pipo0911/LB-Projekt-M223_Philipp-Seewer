# Betrieb & Installation

## Voraussetzungen

Folgende Software muss installiert sein:

- Java 17  
- Maven 3.9+  
- MySQL 8+  
- (Optional für das Frontend) Node.js 18+

---

## Datenbank Setup

1. MySQL starten.

2. Neue Datenbank erstellen:

```sql
CREATE DATABASE steam_library;
```

3. Benutzer erstellen und Rechte vergeben:

```sql
CREATE USER 'steam_user'@'localhost' IDENTIFIED BY 'steam_pass';
GRANT ALL PRIVILEGES ON steam_library.* TO 'steam_user'@'localhost';
FLUSH PRIVILEGES;
```

### Hinweis

Die Standard-Konfiguration in  
`src/main/resources/application.properties` lautet:

```
spring.datasource.username=steam_user
spring.datasource.password=steam_pass
```

Falls andere Zugangsdaten verwendet werden, müssen diese in der Datei angepasst werden.

Die Tabellen werden beim ersten Start automatisch durch JPA erstellt:

```
spring.jpa.hibernate.ddl-auto=update
```

---

## Backend starten

Im Projektordner (dort wo sich die `pom.xml` befindet):

```bash
mvn clean install
mvn spring-boot:run
```

Die API ist anschliessend erreichbar unter:

```
http://localhost:8080
```

Beispiel:

```
http://localhost:8080/games
```

---

## Projekt in IDE importieren

1. Projekt als Maven-Projekt öffnen  
2. Dependencies automatisch laden lassen  
3. Anwendung über die Hauptklasse `SteamLibraryApplication` starten  

---

# Frontend starten (optional)

Das Frontend ist nicht Bestandteil der Bewertung, kann jedoch zur Visualisierung genutzt werden.

## Voraussetzungen

- Node.js 18+
- npm

## Installation

Im Front-End-Ordner:

```bash
npm install
```

## Starten

```bash
npm run dev
```

Das Frontend ist anschliessend erreichbar unter:

```
http://localhost:5173
```

### Wichtig

Das Backend muss vor dem Start des Frontends laufen:

```
http://localhost:8080
```
