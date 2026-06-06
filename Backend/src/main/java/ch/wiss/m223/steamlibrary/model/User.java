package ch.wiss.m223.steamlibrary.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

/**
 * Benutzer-Entity für die Authentifizierung.
 * Speichert Username, E-Mail, Passwort (gehasht) und Rollen.
 */
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<ERole> roles = new HashSet<>();

    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email    = email;
        this.password = password;
    }

    // --- Getter & Setter ---

    public Long getId()                  { return id; }
    public void setId(Long id)           { this.id = id; }

    public String getUsername()          { return username; }
    public void setUsername(String u)    { this.username = u; }

    public String getEmail()             { return email; }
    public void setEmail(String e)       { this.email = e; }

    public String getPassword()          { return password; }
    public void setPassword(String p)    { this.password = p; }

    public Set<ERole> getRoles()         { return roles; }
    public void setRoles(Set<ERole> r)   { this.roles = r; }
}
