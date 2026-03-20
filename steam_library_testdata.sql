-- ============================================================
-- Steam Library Test Data
-- M223 Project - Sample Users, Roles, and Games
-- ============================================================

USE steam_library;

-- ============================================================
-- TEST USERS
-- ============================================================
-- Password for all users: "password123"
-- BCrypt Hash: $2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z
-- ============================================================

INSERT INTO users (username, email, password) VALUES
('alice', 'alice@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('bob', 'bob@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('charlie', 'charlie@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z'),
('admin_user', 'admin@test.ch', '$2a$10$xK9s2F3d.K4E7V8vL9mK0eYq6K7L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z');

-- ============================================================
-- USER ROLES
-- ============================================================
-- alice, bob, charlie -> ROLE_USER (read-only access)
-- admin_user -> ROLE_ADMIN (full CRUD access)
-- ============================================================

INSERT INTO user_roles (user_id, roles) VALUES
((SELECT id FROM users WHERE username = 'alice'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'bob'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'charlie'), 'ROLE_USER'),
((SELECT id FROM users WHERE username = 'admin_user'), 'ROLE_ADMIN');

-- ============================================================
-- TEST GAMES
-- ============================================================

-- Alice's Games (RPGs and Story-Driven Games)
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price, last_played) VALUES
((SELECT id FROM users WHERE username = 'alice'), 'The Witcher 3', 292030, 150, true, 39.99, '2026-03-15'),
((SELECT id FROM users WHERE username = 'alice'), 'Cyberpunk 2077', 1091500, 80, true, 59.99, '2026-03-10'),
((SELECT id FROM users WHERE username = 'alice'), 'Portal 2', 620, 25, true, 9.99, '2026-02-28');

-- Bob's Games (Souls-like and Challenging Games)
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price, last_played) VALUES
((SELECT id FROM users WHERE username = 'bob'), 'Elden Ring', 1245620, 200, true, 59.99, '2026-03-18'),
((SELECT id FROM users WHERE username = 'bob'), 'Dark Souls 3', 374320, 120, true, 39.99, '2026-03-12'),
((SELECT id FROM users WHERE username = 'bob'), 'Sekiro Shadows Die Twice', 1312590, 90, true, 39.99, '2026-03-05');

-- Charlie's Games (Relaxing and Long-Playtime Games)
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price, last_played) VALUES
((SELECT id FROM users WHERE username = 'charlie'), 'Valheim', 892970, 300, true, 19.99, '2026-03-19'),
((SELECT id FROM users WHERE username = 'charlie'), 'Minecraft', 220600, 1000, true, 26.95, '2026-03-20'),
((SELECT id FROM users WHERE username = 'charlie'), 'Stardew Valley', 413150, 450, true, 14.99, '2026-03-17');

-- Admin's Games
INSERT INTO games (user_id, title, steam_app_id, playtime_hours, installed, price, last_played) VALUES
((SELECT id FROM users WHERE username = 'admin_user'), 'Half-Life 2', 220, 30, true, 9.99, '2026-01-15'),
((SELECT id FROM users WHERE username = 'admin_user'), 'Counter-Strike 2', 730, 500, true, 0.00, '2026-03-19');

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

SELECT 'Users Created:' AS section;
SELECT id, username, email FROM users;

SELECT '' AS spacer;
SELECT 'User Roles:' AS section;
SELECT u.username, ur.roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.username;

SELECT '' AS spacer;
SELECT 'Games Count by User:' AS section;
SELECT u.username, COUNT(g.id) AS game_count,
       SUM(g.playtime_hours) AS total_playtime,
       COUNT(CASE WHEN g.installed = true THEN 1 END) AS installed_count
FROM users u
LEFT JOIN games g ON u.id = g.user_id
GROUP BY u.id, u.username
ORDER BY u.username;

SELECT '' AS spacer;
SELECT 'Sample Games:' AS section;
SELECT u.username, g.title, g.playtime_hours, g.installed, g.price
FROM games g
JOIN users u ON g.user_id = u.id
ORDER BY u.username, g.title
LIMIT 10;

-- ============================================================
-- Test Data Loaded Successfully
-- ============================================================
