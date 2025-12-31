# Step 1: Use Node.js to build the website
FROM node:20-alpine AS build-stage

# Set the working directory
WORKDIR /app

# Copy the "instructions" for what libraries to install
COPY package*.json ./
RUN npm install

# Take the API Key from Google Cloud settings and save it for the website
ARG GEMINI_API_KEY
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Copy your actual website files
COPY . .

# Create the final production version of your site
RUN npm run build

# Step 2: Use a lightweight web server (Nginx) to host the site
FROM nginx:alpine

# Copy the finished website from Step 1 into the web server's folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy our custom settings (requires the nginx.conf file)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Tell Google Cloud to use port 8080
EXPOSE 8080

# Start the web server
CMD ["nginx", "-g", "daemon off;"]
