package ch.wiss.m295.steamlibrary.model;

/**
 * Rollen für rollenbasierte Zugriffskontrolle (RBAC).
 * ROLE_USER  – darf Games lesen
 * ROLE_ADMIN – darf Games lesen, erstellen, bearbeiten und löschen
 */
public enum ERole {
    ROLE_USER,
    ROLE_ADMIN
}
