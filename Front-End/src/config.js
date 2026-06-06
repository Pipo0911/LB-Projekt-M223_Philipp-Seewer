/**
 * Zentrale Frontend-Konfiguration.
 * Liest die Backend-URL aus den Vite-Umgebungsvariablen (VITE_API_BASE_URL),
 * mit lokalem Default als Fallback (z.B. in Tests ohne .env).
 */
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8080";
