# Build and serve the application
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port 80 (to match the expected listening port)
EXPOSE 80

# Start the application using vite preview on port 80
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]
