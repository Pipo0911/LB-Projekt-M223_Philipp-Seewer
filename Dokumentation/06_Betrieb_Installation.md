# Betrieb & Installation

## Voraussetzungen

- Java 17
- Maven
- MySQL

---

## Datenbank Setup

1. MySQL starten
2. Neue Datenbank erstellen:

CREATE DATABASE steam_library;

3. Optional: Benutzer steam_user erstellen

---

## Backend starten

Im Backend-Ordner:

mvn spring-boot:run

Die API ist anschliessend erreichbar unter:

http://localhost:8080

---

## Projekt in IDE importieren

1. Projekt als Maven-Projekt öffnen
2. Dependencies automatisch laden lassen
3. Projekt starten
