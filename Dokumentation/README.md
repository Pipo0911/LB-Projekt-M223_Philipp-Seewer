# Steam Library – Projektdokumentation (M295 / M223)

**Module:** M295 – REST-API mit Spring Boot · M223 – Multi-User-Web-App  
**Autor:** Philipp Seewer  
**Schule:** WISS  
**Projekt:** Steam Library

Diese Dokumentation beschreibt die Entwicklung einer Full-Stack-Web-Applikation
zur Verwaltung einer persönlichen Steam-Spielbibliothek. Spiele werden über eine
abgesicherte REST-API verwaltet (CRUD), serverseitig validiert und in einem
React-Frontend angezeigt und bearbeitet.

Das Projekt wurde in zwei aufeinander aufbauenden Modulen entwickelt:

- **M295** – REST-API mit Spring Boot, JPA/MySQL, Bean Validation, strukturierte
  Fehlerbehandlung und Unit-/Integrationstests.
- **M223** – Erweiterung zur Multi-User-Web-App: JWT-Authentifizierung,
  Spring Security 6, rollenbasierte Zugriffskontrolle (RBAC) und ein
  React-Frontend mit geschützten Routen.

## Inhaltsübersicht

| Nr. | Dokument | Inhalt |
|-----|----------|--------|
| 01 | [Projektübersicht](01_Projektübersicht.md) | Idee, Ziele, Story Board, Mockups |
| 02 | [Anforderungen](02_Anforderungen.md) | Funktionale Anforderungen, User Stories |
| 03 | [Architektur](03_Architektur.md) | Technologie-Stack, Schichten, Datenmodell, API |
| 04 | [Implementierung](04_Implementierung.md) | Backend- & Frontend-Umsetzung im Detail |
| 05 | [Testing](05_Testing.md) | Unit-, Integrations- und Frontend-Tests |
| 06 | [Betrieb & Installation](06_Betrieb_Installation.md) | Setup, Konfiguration, Docker |
| 07 | [Reflexion](07_Reflexion.md) | Rückblick, gelernte Konzepte, Herausforderungen |

Ergänzend: [Fachgespräch-Lernzettel](Fachgespraech_Lernzettel.md) als Vorbereitung
auf das technische Gespräch.
