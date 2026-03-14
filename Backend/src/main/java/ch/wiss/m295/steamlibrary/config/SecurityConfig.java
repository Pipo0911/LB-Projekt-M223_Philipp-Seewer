package ch.wiss.m295.steamlibrary.config;

import ch.wiss.m295.steamlibrary.auth.JwtAuthFilter;
import ch.wiss.m295.steamlibrary.auth.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security Konfiguration.
 *
 * RBAC-Regeln:
 *  - /api/auth/**            → öffentlich (Login / Registrierung)
 *  - GET /games/**           → ROLE_USER oder ROLE_ADMIN
 *  - POST/PUT/DELETE /games  → nur ROLE_ADMIN
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS über Spring Security aktivieren (übernimmt CorsConfig-Bean)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Kein CSRF nötig bei JWT (stateless)
            .csrf(csrf -> csrf.disable())
            // Keine HTTP-Session – jeder Request trägt den Token selbst
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Zugriffs-Regeln (RBAC)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET,    "/games", "/games/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.POST,   "/games").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/games/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/games/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            // JWT-Filter vor dem Standard-Auth-Filter einschalten
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /** CORS-Konfiguration für Spring Security (erlaubt React-Dev-Server). */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
