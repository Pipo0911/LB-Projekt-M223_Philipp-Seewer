# Fachgespräch Lernzettel – M223 Steam Library App
**Philipp Seewer | WISS**

---

## 1. JWT – Was ist das?

JWT steht für **JSON Web Token**. Es ist ein Standard um Informationen sicher zwischen zwei Parteien zu übertragen.

Ein JWT besteht aus **3 Teilen**, getrennt durch Punkte:

```
eyJhbGciOiJIUzI1NiJ9 . eyJ1c2VybmFtZSI6InBoaWxpcHAifQ . xK9s2F3...
      HEADER                      PAYLOAD                    SIGNATURE
```

| Teil | Inhalt | Kodierung |
|------|--------|-----------|
| **Header** | Algorithmus (HS256), Typ (JWT) | Base64 |
| **Payload** | Benutzername, Ablaufzeit, Rollen | Base64 |
| **Signature** | HMAC-SHA256(Header + Payload + Secret) | Hash |

> **Wichtig:** Der Token ist **nicht verschlüsselt** – jeder kann Header und Payload lesen. Er ist aber **signiert** – niemand kann ihn verändern ohne den geheimen Schlüssel.

**Warum ist er trotzdem sicher?**
Wenn jemand den Payload verändert (z.B. die Rolle auf ADMIN setzt), stimmt die Signatur nicht mehr. Der Server merkt das sofort und lehnt den Token ab.

---

## 2. Login-Flow – Schritt für Schritt

```
1. Benutzer gibt Username + Passwort im Frontend ein
2. POST /api/auth/signin → Spring prüft Credentials mit BCrypt
3. Bei Erfolg: JwtUtil.generateToken() erstellt einen signierten Token
4. Token + Username + Rollen werden als JSON zurückgesendet
5. Frontend speichert das Objekt im localStorage
6. Bei jedem weiteren API-Request: Authorization: Bearer <token> im Header
7. JwtAuthFilter liest Token, validiert ihn, setzt Benutzer im SecurityContext
8. SecurityConfig prüft die Rolle → Zugriff erlaubt oder HTTP 403
```

---

## 3. JwtAuthFilter – Was macht er genau?

Der `JwtAuthFilter` ist ein **OncePerRequestFilter** – er wird bei **jedem HTTP-Request einmal** ausgeführt, bevor der Controller aufgerufen wird.

**Ablauf:**
1. Liest den `Authorization`-Header
2. Prüft ob er mit `Bearer ` beginnt
3. Schneidet den Token aus (`substring(7)`)
4. Extrahiert den Benutzernamen mit `JwtUtil.getUsernameFromToken()`
5. Lädt den Benutzer aus der Datenbank (`UserDetailsServiceImpl`)
6. Validiert den Token (Signatur + Ablaufzeit + Benutzername)
7. Setzt den Benutzer als `UsernamePasswordAuthenticationToken` in den `SecurityContext`

> Danach weiß Spring Security wer der Benutzer ist und kann Rollenprüfungen machen.

**Was passiert ohne Token?**
Der Filter findet keinen `Authorization`-Header → setzt nichts in den SecurityContext → Spring Security liefert **HTTP 401 Unauthorized**.

---

## 4. SecurityConfig – Was konfiguriert sie?

```java
.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```
→ Kein Server-seitiger Session-State. Der Server merkt sich nichts. Jeder Request muss den Token mitschicken.

```java
.cors(cors -> cors.configurationSource(...))
```
→ Erlaubt Requests vom React-Dev-Server (`localhost:5173`). Ohne CORS-Konfiguration blockiert der Browser die API-Antworten.

```java
.csrf(csrf -> csrf.disable())
```
→ CSRF-Schutz deaktiviert, weil die API stateless ist und keine Cookies verwendet. CSRF-Angriffe funktionieren nur mit Cookies.

**RBAC-Regeln:**

| Endpunkt | Methode | Erlaubte Rolle |
|----------|---------|---------------|
| /api/auth/** | POST | Alle (permitAll) |
| /games, /games/** | GET | ROLE_USER, ROLE_ADMIN |
| /games | POST | ROLE_ADMIN |
| /games/** | PUT | ROLE_ADMIN |
| /games/** | DELETE | ROLE_ADMIN |

---

## 5. BCrypt – Warum Passwörter hashen?

Passwörter werden **niemals im Klartext** gespeichert. BCrypt ist ein Hashing-Algorithmus:

- Aus `"meinpasswort"` wird z.B. `"$2a$10$xK9s2F3..."`
- Das ist **nicht umkehrbar** – man kann den Hash nicht zurückrechnen
- BCrypt fügt automatisch ein **Salt** hinzu (zufällige Zeichen) → gleiche Passwörter haben verschiedene Hashes

**Beim Login:** Spring Security hasht das eingegebene Passwort und vergleicht es mit dem gespeicherten Hash.

---

## 6. RBAC – Role-Based Access Control

Zwei Rollen im Projekt:

| Rolle | Berechtigungen |
|-------|---------------|
| **ROLE_USER** | GET /games lesen |
| **ROLE_ADMIN** | Alles: GET + POST + PUT + DELETE |

**Wie wird die Rolle vergeben?**
- Bei der Registrierung (`/api/auth/signup`) bekommt jeder neue Benutzer automatisch **ROLE_USER**
- ROLE_ADMIN muss manuell per SQL vergeben werden

**Wie wird die Rolle geprüft?**
- Der `JwtAuthFilter` setzt die Rollen aus dem Token in den `SecurityContext`
- Die `SecurityConfig` prüft mit `hasRole("ADMIN")` ob die Rolle vorhanden ist
- Bei fehlender Berechtigung → **HTTP 403 Forbidden**

---

## 7. AuthContext (React) – Was macht er?

Der `AuthContext` ist ein **globaler State-Container** in React. Er speichert den eingeloggten Benutzer und stellt Funktionen bereit, die überall in der App verwendet werden können.

**Gespeichert wird:**
```json
{
  "token": "eyJ...",
  "username": "philipp",
  "email": "ph.seewer@...",
  "roles": ["ROLE_USER"]
}
```

**Bereitgestellte Funktionen:**
- `login(username, password)` → API-Call, speichert User in State + localStorage
- `register(name, email, password)` → API-Call für Registrierung
- `logout()` → setzt State auf null, entfernt localStorage-Eintrag
- `getToken()` → gibt aktuellen JWT-Token zurück

**Warum localStorage?**
→ Damit der Benutzer nach einem Browser-Neustart noch eingeloggt bleibt. Ohne localStorage wäre er bei jedem F5 ausgeloggt.

---

## 8. PrivateRoute – Wie funktioniert sie?

```jsx
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
```

**In App.jsx:**
```jsx
<Route path="/games" element={<PrivateRoute><Games /></PrivateRoute>} />
```

→ Wenn `user` null ist (nicht eingeloggt) → Weiterleitung auf `/login`
→ Wenn `user` vorhanden → zeige die `<Games />`-Komponente

**Warum ist das wichtig?**
Ohne PrivateRoute könnte man `/games` direkt in der URL eingeben und die Seite sehen, auch ohne Token. Die API würde zwar 401 zurückgeben, aber der Benutzer würde trotzdem die leere Seite sehen.

---

## 9. JWT im Header senden – api.jsx

```js
function getAuthHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
}
```

Diese Funktion wird bei **jedem API-Call** aufgerufen und der Header automatisch mitgesendet:
```js
fetch("/games", { headers: { ...getAuthHeader(), "Content-Type": "application/json" } })
```

→ Der Backend-Filter liest diesen Header und authentifiziert den Benutzer.

---

## 10. Mögliche Fachgespräch-Fragen & Antworten

**„Erkläre mir wie der Login funktioniert."**
Der Benutzer gibt Username und Passwort ein. Das Frontend schickt einen POST-Request an `/api/auth/signin`. Spring Security prüft das Passwort mit BCrypt. Bei Erfolg erstellt `JwtUtil` einen signierten Token. Der Token wird mit Username, E-Mail und Rollen als JSON zurückgesendet und im localStorage gespeichert.

---

**„Was passiert wenn ich ohne Token auf /games zugreife?"**
Der `JwtAuthFilter` findet keinen Authorization-Header. Es wird kein Benutzer in den SecurityContext gesetzt. Spring Security liefert HTTP 401 Unauthorized. Im Frontend leitet die PrivateRoute auf die Login-Seite weiter.

---

**„Warum ist der Token sicher obwohl man ihn im localStorage lesen kann?"**
Der Token enthält keine sensiblen Daten wie Passwörter. Selbst wenn jemand den Token sieht, kann er ihn nicht verändern ohne den geheimen Schlüssel – denn die Signatur würde dann nicht mehr stimmen. Ausserdem läuft der Token nach 24 Stunden ab.

---

**„Was ist der Unterschied zwischen Authentifizierung und Autorisierung?"**
Authentifizierung prüft **wer** jemand ist (Login mit Username/Passwort → JWT-Token).
Autorisierung prüft **was** jemand darf (ROLE_USER darf nur lesen, ROLE_ADMIN darf alles).

---

**„Warum hast du CSRF deaktiviert?"**
CSRF-Angriffe funktionieren über Cookies. Da unsere API stateless ist und JWT-Token im Authorization-Header (nicht in Cookies) sendet, ist CSRF kein Angriffsszenario. Deshalb kann CSRF sicher deaktiviert werden.

---

**„Was ist der Unterschied zwischen HTTP 401 und HTTP 403?"**
- **401 Unauthorized**: Der Benutzer ist **nicht eingeloggt** (kein oder ungültiger Token)
- **403 Forbidden**: Der Benutzer ist eingeloggt, hat aber **nicht die nötige Berechtigung** (z.B. ROLE_USER versucht POST)

---

**„Wo werden Benutzerrollen in der Datenbank gespeichert?"**
In einer eigenen Tabelle `user_roles`, da es eine `@ElementCollection` ist. Die Tabelle enthält `user_id` und `roles` (den Enum-Wert als String).

---

**„Was macht `@WithMockUser` in den Tests?"**
Da Spring Security aktiv ist, würden Tests ohne Authentifizierung HTTP 401 bekommen. `@WithMockUser(roles = "ADMIN")` simuliert einen eingeloggten Benutzer mit der gewünschten Rolle, ohne einen echten Login-Flow durchzuführen.

---

**„Erkläre den Unterschied zwischen dem Frontend und Backend in deiner Sicherheitsarchitektur."**
Das Backend ist die eigentliche Sicherheitsschicht: Jeder Request wird geprüft, egal woher er kommt. Das Frontend (PrivateRoute) ist nur eine **UX-Massnahme** – sie verhindert dass der Benutzer eine leere Seite sieht. Ein technisch versierter Benutzer könnte die PrivateRoute umgehen, würde aber trotzdem HTTP 401 vom Backend erhalten.
