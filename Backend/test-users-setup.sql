-- M223 Test-Benutzer Setup
-- Fügt 4 Benutzer hinzu: 3x ROLE_USER + 1x ROLE_ADMIN mit unterschiedlichen Spielen

USE steam_library;

-- 1. Normale Benutzer erstellen (Passwörter sind BCrypt-gehashed, alle: "password123")
-- BCrypt hash von "password123": $2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z

INSERT INTO users (username, email, password) VALUES
('alice', 'alice@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('bob', 'bob@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('charlie', 'charlie@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('admin_user', 'admin@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z');

-- 2. Rollen zuweisen (ROLE_USER für alice, bob, charlie / ROLE_ADMIN für admin_user)
INSERT INTO user_roles (user_id, roles) VALUES
((SELECT id FROM users WHERE username = 'alice'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'bob'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'charlie'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'admin_user'), 'ROLE_ADMIN');

-- 3. Test-Spiele für alice (ID sollte die erste neue user sein)
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'alice'), 'The Witcher 3', 292030, 150, true, 39.99),
((SELECT id FROM users WHERE username = 'alice'), 'Cyberpunk 2077', 1091500, 80, true, 59.99),
((SELECT id FROM users WHERE username = 'alice'), 'Portal 2', 620, 25, true, 9.99);

-- 4. Test-Spiele für bob
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'bob'), 'Elden Ring', 1245620, 200, true, 59.99),
((SELECT id FROM users WHERE username = 'bob'), 'Dark Souls 3', 374320, 120, true, 39.99),
((SELECT id FROM users WHERE username = 'bob'), 'Sekiro Shadows Die Twice', 1312590, 90, true, 39.99);

-- 5. Test-Spiele für charlie
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'charlie'), 'Valheim', 892970, 300, true, 19.99),
((SELECT id FROM users WHERE username = 'charlie'), 'Minecraft', 220600, 1000, true, 26.95),
((SELECT id FROM users WHERE username = 'charlie'), 'Stardew Valley', 413150, 450, true, 14.99);

-- 6. Test-Spiele für admin (kann alle sehen, diese sind seine "persönlichen")
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price) VALUES
((SELECT id FROM users WHERE username = 'admin_user'), 'Half-Life 2', 220, 30, true, 9.99),
((SELECT id FROM users WHERE username = 'admin_user'), 'Counter-Strike 2', 730, 500, true, 0.00);

-- Verifikation
SELECT 'Users created:' AS info;
SELECT id, username, email FROM users WHERE username IN ('alice', 'bob', 'charlie', 'admin_user');

SELECT '' AS info;
SELECT 'User Roles:' AS info;
SELECT u.username, ur.roles FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.username IN ('alice', 'bob', 'charlie', 'admin_user');

SELECT '' AS info;
SELECT 'Games by User:' AS info;
SELECT u.username, COUNT(g.id) AS game_count FROM users u
LEFT JOIN games g ON u.id = g.user_id
WHERE u.username IN ('alice', 'bob', 'charlie', 'admin_user')
GROUP BY u.id, u.username;
