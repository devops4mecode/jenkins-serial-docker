# Use official Node.js image as the base image
FROM node:12

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server files
COPY . .

# Expose port 3500
EXPOSE 3500

# Start the server
CMD ["npm", "start"]
