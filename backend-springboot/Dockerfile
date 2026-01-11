# ========= STAGE 1: BUILD =========
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiamos el pom primero para cachear dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente
COPY src ./src

# Compilamos el JAR
RUN mvn clean package -DskipTests


# ========= STAGE 2: RUNTIME =========
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiamos el JAR generado
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
