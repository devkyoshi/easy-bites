# Use Maven as a builder
FROM maven:3.8.4-openjdk-17-slim AS builder

# Set the working directory
WORKDIR /build

# Copy the pom.xml file
COPY pom.xml .

# Copy the source code
COPY src/ src/

# Build the application
RUN mvn clean package -DskipTests

# Use OpenJDK for the runtime image
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder /build/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
