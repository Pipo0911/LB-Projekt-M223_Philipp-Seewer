# =====================================================================
# Multi-Stage Build fuer das Steam-Library-Backend (Java 21)
# =====================================================================

# --- Build-Stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# 1) Nur pom.xml kopieren und Abhaengigkeiten vorab laden (Layer-Caching:
#    aendert sich der Quellcode, bleibt dieser Layer gecacht).
COPY pom.xml .
RUN mvn -B dependency:go-offline

# 2) Quellcode kopieren, testen und bauen (Tests laufen hermetisch gegen H2).
COPY src ./src
RUN mvn -B clean test package

# --- Runtime-Stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
