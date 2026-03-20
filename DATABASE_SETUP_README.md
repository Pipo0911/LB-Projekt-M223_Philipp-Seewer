# Steam Library Database Setup Guide

## Overview
This directory contains SQL scripts to set up the complete Steam Library database for the M223 project (JWT Authentication & RBAC Implementation).

## Files

### 1. `steam_library_schema.sql`
Contains the database and table schema definitions:
- **Database**: `steam_library`
- **Tables**:
  - `users` - User accounts with credentials
  - `user_roles` - Role assignments (ROLE_USER, ROLE_ADMIN)
  - `games` - Game records with metadata

### 2. `steam_library_testdata.sql`
Contains test data for development and demonstration:
- **4 Test Users**: alice, bob, charlie, admin_user
- **12 Sample Games**: 3 per user (plus 2 for admin)
- **Role Assignments**: Users have read-only access, admin has full CRUD

## Setup Instructions

### Option 1: Using MySQL CLI

```bash
# Connect to MySQL
mysql -u root -p

# Execute schema
mysql -u root -p steam_library < steam_library_schema.sql

# Execute test data
mysql -u root -p steam_library < steam_library_testdata.sql
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Create new Query tab
3. Open and execute `steam_library_schema.sql`
4. Open and execute `steam_library_testdata.sql`
5. Verify in Data tables

### Option 3: Using Docker

```bash
# Start MySQL container
docker run --name mysql-steam -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8

# Copy files to container
docker cp steam_library_schema.sql mysql-steam:/tmp/
docker cp steam_library_testdata.sql mysql-steam:/tmp/

# Execute scripts
docker exec mysql-steam mysql -uroot -proot < /tmp/steam_library_schema.sql
docker exec mysql-steam mysql -uroot -proot steam_library < /tmp/steam_library_testdata.sql
```

## Test Users

All test users have the password: `password123`

| Username | Email | Role | Purpose |
|----------|-------|------|---------|
| alice | alice@test.ch | ROLE_USER | Read-only test user |
| bob | bob@test.ch | ROLE_USER | Read-only test user |
| charlie | charlie@test.ch | ROLE_USER | Read-only test user |
| admin_user | admin@test.ch | ROLE_ADMIN | Administrative user |

## Sample Games

Each user has a curated set of games:

### Alice (Story/RPG Games)
- The Witcher 3 (150 hours)
- Cyberpunk 2077 (80 hours)
- Portal 2 (25 hours)

### Bob (Souls-like Games)
- Elden Ring (200 hours)
- Dark Souls 3 (120 hours)
- Sekiro Shadows Die Twice (90 hours)

### Charlie (Relaxing/Long Games)
- Valheim (300 hours)
- Minecraft (1000 hours)
- Stardew Valley (450 hours)

### Admin User
- Half-Life 2 (30 hours)
- Counter-Strike 2 (500 hours)

## Database Schema Details

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User Roles Table
```sql
CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    roles VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Games Table
```sql
CREATE TABLE games (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    steam_app_id BIGINT,
    playtime_hours INT DEFAULT 0,
    installed BOOLEAN DEFAULT false,
    price DECIMAL(10, 2),
    last_played DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Security Notes

- All passwords are BCrypt-hashed (10-round salt)
- The plain password `password123` is only provided for testing purposes
- In production, users must change their passwords after initial setup
- Foreign key constraints prevent orphaned game records

## Verification

After setup, verify with these queries:

```sql
-- Check users
SELECT COUNT(*) as user_count FROM users;

-- Check roles
SELECT username, roles FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- Check games
SELECT u.username, COUNT(*) as game_count
FROM games g
JOIN users u ON g.user_id = u.id
GROUP BY u.id;
```

## Environment Configuration

Update your Spring Boot `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/steam_library
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

## Cleanup

To reset the database:

```bash
# Drop the entire database
mysql -u root -p -e "DROP DATABASE steam_library;"

# Re-run the setup scripts from the beginning
```

---

**Last Updated**: 2026-03-20
**Project**: M223 - JWT Authentication & RBAC Implementation
**Author**: Philipp Seewer
