# Reflexion

## M295 – Rückblick

Im Rahmen des Moduls M295 konnte ich mein Wissen im Bereich Backend-Entwicklung vertiefen.

Besonders konnte ich folgende Themen praktisch anwenden:

- Aufbau einer REST-API mit Spring Boot
- Persistente Speicherung mit JPA und MySQL
- Serverseitige Validierung von Daten mit Bean Validation
- Strukturierte Fehlerbehandlung (GlobalExceptionHandler)
- Erstellung von Unit-Tests mit JUnit 5 und MockMvc
- Dokumentation eines Softwareprojektes

Eine Herausforderung war die saubere Umsetzung der REST-Endpunkte sowie die vollständige und strukturierte Projektdokumentation.

---

## M223 – Rückblick (Multi-User-Web-App)

In Modul M223 wurde die Applikation zur vollständigen Multi-User-Web-App erweitert. Dies erforderte tiefes Verständnis von Authentifizierung, Autorisierung und Frontend-Integration.

### Was ich gelernt habe

**JWT-Authentifizierung**: Ich habe verstanden, wie JWT-Token aufgebaut sind (Header.Payload.Signature), wie sie mit HMAC-SHA256 signiert werden, und wie der Token-Flow von Login über API-Request bis zur Rollenprüfung funktioniert.

**Spring Security 6**: Die Konfiguration der SecurityFilterChain, die Einbindung eines eigenen OncePerRequestFilter und das Rollenkonzept (ROLE_USER vs. ROLE_ADMIN) waren neue, komplexe Themen.

**RBAC (Role-Based Access Control)**: Die Idee, dass dieselbe API je nach Benutzerrolle unterschiedliche Berechtigungen vergibt, ist ein zentrales Konzept in professionellen Anwendungen. Die Umsetzung mit `hasRole()` in der SecurityConfig hat das gut veranschaulicht.

**React Context API**: Der `AuthContext` als globaler State-Container für den eingeloggten Benutzer und das Pattern mit `useAuth()` Hook hat gezeigt, wie Authentifizierungszustand sauber durch eine gesamte React-App geteilt werden kann.

**PrivateRoute-Pattern**: Die Absicherung von Frontend-Routen ist genauso wichtig wie die Backend-Absicherung. Der Anwender soll keine geschützten Seiten sehen können, wenn er nicht eingeloggt ist.

### Herausforderungen

Die grösste Herausforderung war die Konfiguration der Datenbankverbindung: Da Spring Boot auf Windows läuft und MySQL in einem Docker-Container ist, war die Netzwerkkommunikation über die Docker-Bridge-IP (`172.17.0.1`) zunächst nicht möglich. Die Lösung war, den MySQL-User mit `'%'` als Host zu erstellen, um Verbindungen von beliebigen IPs zu erlauben.

Eine weitere Herausforderung war die Anpassung der bestehenden Unit-Tests: Mit aktivierter Spring Security lieferten die Tests plötzlich HTTP 401 statt der erwarteten Statuscodes. Das Problem wurde mit `@WithMockUser(roles = "USER"/"ADMIN")` gelöst.

### Fazit

Das Projekt erfüllt die Anforderungen der Module M295 und M223 vollständig. Die Applikation ist produktionsreif konfiguriert (BCrypt, stateless sessions, CORS) und demonstriert eine moderne Full-Stack-Architektur mit Spring Boot und React.
