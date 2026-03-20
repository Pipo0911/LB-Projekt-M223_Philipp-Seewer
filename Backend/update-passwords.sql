-- Update user passwords with BCrypt hashes
-- password123 = $2a$10$slYQmyNdGzin7olVN3p5be3DlH.PKZbv5H8KnzzVgXXbVxzy.SLKG (generated with BCrypt)

UPDATE users SET password = '$2a$10$slYQmyNdGzin7olVN3p5be3DlH.PKZbv5H8KnzzVgXXbVxzy.SLKG' WHERE username = 'alice';
UPDATE users SET password = '$2a$10$slYQmyNdGzin7olVN3p5be3DlH.PKZbv5H8KnzzVgXXbVxzy.SLKG' WHERE username = 'bob';
UPDATE users SET password = '$2a$10$slYQmyNdGzin7olVN3p5be3DlH.PKZbv5H8KnzzVgXXbVxzy.SLKG' WHERE username = 'charlie';
UPDATE users SET password = '$2a$10$slYQmyNdGzin7olVN3p5be3DlH.PKZbv5H8KnzzVgXXbVxzy.SLKG' WHERE username = 'admin_user';

-- Verify the update
SELECT username, password FROM users;
