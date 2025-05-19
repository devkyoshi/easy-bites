# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /build

# Copy parent pom and all modules needed for build
COPY ../ backend/

# Download dependencies and build all modules
RUN mvn -f backend/pom.xml clean package -pl delivery-service -am -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /build/backend/delivery-service/target/delivery-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
