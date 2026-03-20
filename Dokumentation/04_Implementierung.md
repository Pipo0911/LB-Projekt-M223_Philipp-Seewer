# Implementierung

## Backend (M295 – Basis)

Das Backend wurde mit Spring Boot 3 implementiert und folgt dem klassischen Schichtenmodell (Controller → Repository → Datenbank).

Der `GameController` stellt alle CRUD-Endpunkte bereit. Die `Game`-Entität wird über JPA in einer MySQL-Datenbank persistiert. Bean Validation (`@NotBlank`, `@NotNull`, `@PositiveOrZero`) sichert die Datenintegrität auf Serverseite.

---

## Backend (M223 – Authentifizierung & Autorisierung)

### Dateistruktur (neu in M223)

```
src/main/java/ch/wiss/m295/steamlibrary/
├── auth/
│   ├── AuthController.java          ← /api/auth/signup, /api/auth/signin
│   ├── JwtUtil.java                 ← Token generieren, validieren, auslesen
│   ├── JwtAuthFilter.java           ← OncePerRequestFilter: Token aus Header lesen
│   ├── UserDetailsServiceImpl.java  ← Benutzer aus DB laden für Spring Security
│   └── dto/
│       ├── LoginRequest.java
│       ├── RegisterRequest.java
│       └── JwtResponse.java
├── config/
│   └── SecurityConfig.java          ← FilterChain, CORS, RBAC-Regeln
├── model/
│   ├── User.java                    ← Benutzer-Entität
│   └── ERole.java                   ← Enum: ROLE_USER, ROLE_ADMIN
└── repository/
    └── UserRepository.java
```

### JwtUtil

`JwtUtil` ist verantwortlich für:
- **Token generieren**: `generateToken(UserDetails)` erstellt einen signierten JWT mit Benutzername und Ablaufzeit (24h).
- **Token auslesen**: `getUsernameFromToken(String)` extrahiert den Benutzernamen aus dem Token.
- **Token validieren**: `validateToken(String, UserDetails)` prüft Signatur, Ablaufdatum und Übereinstimmung mit dem Benutzer.

Der Token wird mit einem geheimen Schlüssel (HMAC-SHA256) signiert, der in `application.properties` konfiguriert ist.

### JwtAuthFilter

`JwtAuthFilter` ist ein `OncePerRequestFilter`. Er wird bei jedem Request ausgeführt:

1. Liest den `Authorization`-Header (Format: `Bearer <token>`)
2. Extrahiert den Benutzernamen aus dem Token
3. Lädt den Benutzer via `UserDetailsServiceImpl`
4. Validiert den Token
5. Setzt den Benutzer als `UsernamePasswordAuthenticationToken` im `SecurityContext`

### SecurityConfig

Die `SecurityConfig` definiert:
- **CORS**: Erlaubt Requests von `http://localhost:5173` (React-Dev-Server)
- **CSRF**: Deaktiviert (stateless REST-API)
- **Session-Management**: `STATELESS` (kein Server-seitiger Session-State)
- **Filterreihenfolge**: `JwtAuthFilter` wird vor `UsernamePasswordAuthenticationFilter` eingehängt
- **RBAC-Regeln**:
  - `/api/auth/**` → `permitAll`
  - `GET /games, /games/**` → `hasAnyRole("USER", "ADMIN")`
  - `POST /games` → `hasRole("ADMIN")`
  - `PUT /games/**` → `hasRole("ADMIN")`
  - `DELETE /games/**` → `hasRole("ADMIN")`
  - Alles andere → `authenticated`

### AuthController

Der `AuthController` bietet zwei Endpunkte:

**POST /api/auth/signup**
- Prüft auf doppelten Benutzernamen und E-Mail
- Hasht das Passwort mit BCrypt
- Erstellt einen neuen User mit ROLE_USER
- Gibt HTTP 200 mit Erfolgsmeldung zurück

**POST /api/auth/signin**
- Authentifiziert mit `AuthenticationManager`
- Generiert einen JWT-Token via `JwtUtil`
- Gibt HTTP 200 mit `JwtResponse` (token, type, username, email, roles) zurück

---

## Frontend (M223)

Das React-Frontend wurde mit Vite erstellt und nutzt React Router v7 für das Routing.

### Neue Dateien

```
src/
├── contexts/
│   └── AuthContext.jsx   ← Globaler Auth-State, login(), register(), logout()
├── components/
│   └── PrivateRoute.jsx  ← Weiterleitung auf /login wenn nicht eingeloggt
├── pages/
│   ├── Login.jsx         ← Loginformular mit Fehlerbehandlung
│   └── Register.jsx      ← Registrierungsformular mit Weiterleitung
└── services/
    └── api.jsx           ← API-Funktionen + getAuthHeader() für JWT
```

### AuthContext

Der `AuthContext` stellt den globalen Authentifizierungszustand bereit:

- **State**: `user` (Objekt mit token, username, email, roles oder `null`)
- **Initialisierung**: Beim App-Start wird der User aus `localStorage` geladen
- **`login(username, password)`**: POST zu `/api/auth/signin`, speichert User in State und localStorage
- **`register(name, email, password)`**: POST zu `/api/auth/signup`
- **`logout()`**: Setzt State auf `null`, entfernt User aus localStorage
- **`getToken()`**: Gibt den aktuellen JWT-Token zurück

### PrivateRoute

`PrivateRoute` prüft über `useAuth()` ob ein Benutzer eingeloggt ist. Falls nicht, wird mit `<Navigate to="/login" />` auf die Loginseite weitergeleitet.

### api.jsx – JWT im Header

Jede API-Funktion sendet den JWT-Token automatisch mit:

```js
function getAuthHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
}
```

Die Funktion wird in alle Fetch-Aufrufe (getGames, createGame, updateGame, deleteGame) als Header eingebunden.

### App.jsx – Routing

```jsx
<AuthProvider>
  <Route path="/login"    element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/games"    element={<PrivateRoute><Games /></PrivateRoute>} />
</AuthProvider>
```

### Layout.jsx – Navigation

Das Layout zeigt kontextabhängig:
- **Eingeloggt**: Benutzername + „Abmelden"-Button
- **Nicht eingeloggt**: Links zu „Anmelden" und „Registrieren"
