CREATE DATABASE IF NOT EXISTS steam_library;
CREATE USER IF NOT EXISTS 'steam_user'@'localhost' IDENTIFIED BY 'steam_pass';
GRANT ALL PRIVILEGES ON steam_library.* TO 'steam_user'@'localhost';
FLUSH PRIVILEGES;
