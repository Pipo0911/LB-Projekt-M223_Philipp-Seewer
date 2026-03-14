package ch.wiss.m295.steamlibrary.auth.dto;

import java.util.List;

/**
 * Antwort-Body nach erfolgreichem Login.
 * Das Frontend speichert dieses Objekt in localStorage und liest user.token.
 */
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse(String token, String username, String email, List<String> roles) {
        this.token    = token;
        this.username = username;
        this.email    = email;
        this.roles    = roles;
    }

    public String getToken()       { return token; }
    public String getType()        { return type; }
    public String getUsername()    { return username; }
    public String getEmail()       { return email; }
    public List<String> getRoles() { return roles; }
}
