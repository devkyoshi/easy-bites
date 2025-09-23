# Docker Deployment Guide for Easy Bites

This guide provides step-by-step instructions for deploying the Easy Bites application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- The Easy Bites codebase cloned to your local machine

## Setup Steps

### 1. Configure Environment Variables

Before building the Docker containers, configure the environment variables for both the frontend and backend services.

#### Backend Services

Ensure each service has its appropriate `application.properties` file configured. For the auth-service, make sure to include the Firebase configuration as described in the OAuth setup guide.

#### Frontend

Create a `.env` file in the `web-app` directory using the `.env.template` file as a starting point.

### 2. Update Docker Compose File

The main `docker-compose.yml` file needs to be updated to include the Firebase configuration for the auth-service. Add the following environment variables to the auth-service section:

```yaml
auth-service:
  build:
    context: ./backend
    dockerfile: auth-service/Dockerfile
  depends_on:
    mysql:
      condition: service_healthy
  environment:
    SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/easy-bites
    SPRING_DATASOURCE_USERNAME: root
    SPRING_DATASOURCE_PASSWORD: password
    # Add Firebase Configuration
    FIREBASE_CREDENTIALS_ENCODED: ${FIREBASE_CREDENTIALS_ENCODED}
  ports:
    - "8081:8081"
```

Similarly, update the frontend service to include the Firebase environment variables:

```yaml
frontend:
  build:
    context: ./web-app
    dockerfile: Dockerfile
  depends_on:
    api-gateway:
      condition: service_healthy
  environment:
    VITE_API_URL: http://localhost:8080
    VITE_PUBLIC_SOCKET_URL: http://localhost:8085
    VITE_PUBLIC_MAP_TILE_URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    VITE_ORS_API_KEY: ${VITE_ORS_API_KEY}
    # Add Firebase Configuration
    VITE_FIREBASE_API_KEY: ${VITE_FIREBASE_API_KEY}
    VITE_FIREBASE_AUTH_DOMAIN: ${VITE_FIREBASE_AUTH_DOMAIN}
    VITE_FIREBASE_PROJECT_ID: ${VITE_FIREBASE_PROJECT_ID}
    VITE_FIREBASE_STORAGE_BUCKET: ${VITE_FIREBASE_STORAGE_BUCKET}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${VITE_FIREBASE_MESSAGING_SENDER_ID}
    VITE_FIREBASE_APP_ID: ${VITE_FIREBASE_APP_ID}
```

### 3. Create a .env File for Docker Compose

Create a `.env` file in the root of your project to store the environment variables that Docker Compose will use:

```
# Database
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=easy-bites

# Firebase Configuration
FIREBASE_CREDENTIALS_ENCODED=your_base64_encoded_service_account_key

# Frontend Configuration
VITE_ORS_API_KEY=your_ors_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Ensure Dockerfiles Are Properly Configured

For the backend services, ensure that each Dockerfile is properly configured to copy the application.properties file and build the service:

Example for auth-service Dockerfile:

```dockerfile
FROM maven:3.8.5-openjdk-17 as build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/auth-service/target/auth-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

For the frontend, ensure the Dockerfile is configured to build the React application:

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5. Build and Start the Services

Run the following command to build and start all services:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up --build -d
```

### 6. Access the Application

Once all containers are running, access the application at:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Individual Services: http://localhost:PORT (as defined in the docker-compose.yml)

### 7. Stopping the Services

To stop all services:

```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:

```bash
docker-compose down -v
```

## Troubleshooting Docker Deployment

### Service Fails to Start

If a service fails to start, check the logs for that service:

```bash
docker-compose logs service-name
```

### Database Connection Issues

Ensure the database container is running and healthy:

```bash
docker-compose ps mysql
```

If there are issues, check the database logs:

```bash
docker-compose logs mysql
```

### Network Issues Between Services

Ensure all services are on the same Docker network:

```bash
docker network ls
docker network inspect easy-bites_default
```

### Environment Variables Not Being Passed

If environment variables are not being passed to the containers, ensure they are properly defined in your `.env` file and correctly referenced in the `docker-compose.yml` file.

## Production Deployment Considerations

For production deployment, consider:

1. Using a container orchestration platform like Kubernetes
2. Setting up a CI/CD pipeline for automated builds and deployments
3. Implementing proper logging and monitoring
4. Using a reverse proxy like Nginx for SSL termination
5. Implementing database backups and high availability
6. Setting up proper network security rules

---

For additional help or questions, please contact the development team.