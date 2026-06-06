package ch.wiss.m223.steamlibrary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
/**
 * Entry point for the Steam Library REST API application.
 * <p>
 * Starts the Spring Boot context and exposes REST endpoints.
 * </p>
 */
@SpringBootApplication
public class SteamLibraryApplication {

    public static void main(String[] args) {
        SpringApplication.run(SteamLibraryApplication.class, args);
    }
}
