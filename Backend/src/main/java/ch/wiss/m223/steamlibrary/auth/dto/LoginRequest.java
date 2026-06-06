package ch.wiss.m223.steamlibrary.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Request-Body für POST /api/auth/signin */
public class LoginRequest {

    @NotBlank(message = "Benutzername darf nicht leer sein")
    private String username;

    @NotBlank(message = "Passwort darf nicht leer sein")
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
