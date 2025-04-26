# Stage 1: Build the React application
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV VITE_API_URL=http://localhost:8080

# Build the application
RUN npm run build

# Expose the default port
EXPOSE 5173

# Start the application using vite preview on port 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
