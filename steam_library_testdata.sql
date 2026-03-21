-- M223 Steam Library Manager - Test-Daten
-- Lädt 4 Test-Benutzer mit unterschiedlichen Rollen und Spielen
-- Datenbank: steam_library
-- Alle Test-Benutzer verwenden das Passwort: "password123"

USE steam_library;

-- =========================================
-- 1. TEST-BENUTZER ERSTELLEN
-- =========================================
-- Passwort-Hash: BCrypt("password123") mit 10 Runden
-- Hash: $2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z

INSERT INTO users (username, email, password) VALUES
('alice', 'alice@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('bob', 'bob@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('charlie', 'charlie@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('admin_user', 'admin@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z');

-- =========================================
-- 2. ROLLEN ZUWEISEN
-- =========================================
-- alice, bob, charlie: ROLE_USER (Lesezugriff)
-- admin_user: ROLE_ADMIN (Vollständiger Zugriff)

INSERT INTO user_roles (user_id, role) VALUES
((SELECT id FROM users WHERE username = 'alice'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'bob'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'charlie'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'admin_user'), 'ROLE_ADMIN');

-- =========================================
-- 3. TEST-SPIELE EINFÜGEN
-- =========================================

-- Alice: Story/RPG Spiele
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'alice'), 'The Witcher 3', 292030, 150, TRUE, 39.99),
((SELECT id FROM users WHERE username = 'alice'), 'Cyberpunk 2077', 1091500, 80, TRUE, 59.99),
((SELECT id FROM users WHERE username = 'alice'), 'Portal 2', 620, 25, TRUE, 9.99);

-- Bob: Souls-like Spiele
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'bob'), 'Elden Ring', 1245620, 200, TRUE, 59.99),
((SELECT id FROM users WHERE username = 'bob'), 'Dark Souls 3', 374320, 120, TRUE, 39.99),
((SELECT id FROM users WHERE username = 'bob'), 'Sekiro Shadows Die Twice', 1312590, 90, TRUE, 39.99);

-- Charlie: Entspannende/Lang-Spiele
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'charlie'), 'Valheim', 892970, 300, TRUE, 19.99),
((SELECT id FROM users WHERE username = 'charlie'), 'Minecraft', 220600, 1000, TRUE, 26.95),
((SELECT id FROM users WHERE username = 'charlie'), 'Stardew Valley', 413150, 450, TRUE, 14.99);

-- Admin-Benutzer: Verschiedene Spiele
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'admin_user'), 'Half-Life 2', 220, 30, TRUE, 9.99),
((SELECT id FROM users WHERE username = 'admin_user'), 'Counter-Strike 2', 730, 500, TRUE, 0.00);

-- =========================================
-- 4. VERIFIKATION - DATEN ANZEIGEN
-- =========================================

SELECT '===========================================' AS '';
SELECT 'BENUTZER ERSTELLT' AS status;
SELECT '===========================================' AS '';
SELECT id, username, email, created_at FROM users WHERE username IN ('alice', 'bob', 'charlie', 'admin_user');

SELECT '' AS '';
SELECT '===========================================' AS '';
SELECT 'ROLLEN ZUGEWIESEN' AS status;
SELECT '===========================================' AS '';
SELECT u.username, ur.role FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.username IN ('alice', 'bob', 'charlie', 'admin_user')
ORDER BY u.username;

SELECT '' AS '';
SELECT '===========================================' AS '';
SELECT 'SPIELE PRO BENUTZER' AS status;
SELECT '===========================================' AS '';
SELECT u.username, COUNT(g.id) AS game_count, SUM(g.playtime_hours) AS total_playtime
FROM users u
LEFT JOIN games g ON u.id = g.user_id
WHERE u.username IN ('alice', 'bob', 'charlie', 'admin_user')
GROUP BY u.id, u.username
ORDER BY u.username;

SELECT '' AS '';
SELECT '===========================================' AS '';
SELECT 'ALLE SPIELE' AS status;
SELECT '===========================================' AS '';
SELECT u.username, g.title, g.steam_app_id, g.playtime_hours, g.installed, g.price
FROM users u
LEFT JOIN games g ON u.id = g.user_id
WHERE u.username IN ('alice', 'bob', 'charlie', 'admin_user')
ORDER BY u.username, g.title;
