# Use official Nginx image
FROM nginx:alpine

# Copy custom configuration file
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80 

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
