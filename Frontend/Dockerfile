FROM node:16 AS build




# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# COPY package*.json ./
COPY package*.json /app/

# Install project dependencies
RUN npm install

# Copy the rest of the application code
# COPY . .
COPY ./ /app/

# Build the React app
RUN npm run build

# Use a lightweight web server to serve the static files
# FROM nginx:alpine
FROM nginx:1.15

# Copy the built static files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration for URL rewriting
COPY --from=build ./app/nginx.conf /etc/nginx/conf.d/default.conf

# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# comment user directive as master process is run as user in OpenShift anyhow
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

EXPOSE 8081

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]

