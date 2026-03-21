-- M223 Steam Library Manager - Datenbankschema
-- Erstellt die komplette Datenbankstruktur für das Projekt
-- Datenbankname: steam_library
-- Zeichensatz: UTF-8

-- =========================================
-- 1. DATENBANK ERSTELLEN
-- =========================================
CREATE DATABASE IF NOT EXISTS steam_library
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE steam_library;

-- =========================================
-- 2. USERS TABELLE
-- =========================================
-- Speichert Benutzer mit Authentifizierungsdaten (BCrypt-gehashed Passwörter)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 3. USER_ROLES TABELLE (Viele-zu-Viele Beziehung)
-- =========================================
-- Verbindet Benutzer mit ihren Rollen (ROLE_USER, ROLE_ADMIN)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',

    PRIMARY KEY (user_id, role),
    CONSTRAINT fk_user_roles_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 4. GAMES TABELLE
-- =========================================
-- Speichert Spiele der Benutzer aus ihrer Steam-Bibliothek
CREATE TABLE IF NOT EXISTS games (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    steam_app_id INT UNIQUE,
    playtime_hours INT DEFAULT 0,
    installed BOOLEAN DEFAULT FALSE,
    last_played DATE,
    price DOUBLE DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_steam_app_id (steam_app_id),
    INDEX idx_title (title),

    CONSTRAINT fk_games_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 5. DATENBANK-BENUTZER ERSTELLEN
-- =========================================
-- Erstellt einen beschränkten Benutzer für die Anwendung
-- Benutzername: steam_user
-- Passwort: steam_pass
-- Berechtigungen: Alle Operationen auf steam_library Datenbank

CREATE USER IF NOT EXISTS 'steam_user'@'localhost' IDENTIFIED BY 'steam_pass';
GRANT ALL PRIVILEGES ON steam_library.* TO 'steam_user'@'localhost';
FLUSH PRIVILEGES;

-- =========================================
-- 6. VERIFIKATION
-- =========================================
SELECT 'Datenbankschema erfolgreich erstellt!' AS status;
SELECT COUNT(*) AS table_count FROM information_schema.tables
WHERE table_schema = 'steam_library';
