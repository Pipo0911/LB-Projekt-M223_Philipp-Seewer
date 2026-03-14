package ch.wiss.m295.steamlibrary.auth;

import ch.wiss.m295.steamlibrary.auth.dto.JwtResponse;
import ch.wiss.m295.steamlibrary.auth.dto.LoginRequest;
import ch.wiss.m295.steamlibrary.auth.dto.RegisterRequest;
import ch.wiss.m295.steamlibrary.model.ERole;
import ch.wiss.m295.steamlibrary.model.User;
import ch.wiss.m295.steamlibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Authentifizierungs-Controller.
 *
 * POST /api/auth/signup  – Registrierung (gibt ROLE_USER)
 * POST /api/auth/signin  – Login (gibt JWT-Token zurück)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /** Login: Benutzername + Passwort prüfen und JWT-Token zurückgeben. */
    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getEmail(), roles));
    }

    /** Registrierung: Neuen Benutzer anlegen (standardmässig ROLE_USER). */
    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getName())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Benutzername bereits vergeben"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "E-Mail-Adresse bereits registriert"));
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );
        user.getRoles().add(ERole.ROLE_USER);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Registrierung erfolgreich"));
    }
}
