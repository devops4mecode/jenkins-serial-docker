# Use official Nginx image
FROM nginx:alpine

# Copy custom configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 443
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
