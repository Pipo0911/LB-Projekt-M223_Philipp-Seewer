package ch.wiss.m223.steamlibrary.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Request-Body für POST /api/auth/signup */
public class RegisterRequest {

    @NotBlank(message = "Benutzername darf nicht leer sein")
    @Size(min = 3, max = 50, message = "Benutzername muss 3–50 Zeichen lang sein")
    private String name;

    @NotBlank(message = "E-Mail darf nicht leer sein")
    @Email(message = "Ungültige E-Mail-Adresse")
    @Size(max = 100, message = "E-Mail darf höchstens 100 Zeichen lang sein")
    private String email;

    @NotBlank(message = "Passwort darf nicht leer sein")
    @Size(min = 6, max = 120, message = "Passwort muss mindestens 6 Zeichen lang sein")
    private String password;

    public String getName()     { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail()    { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
