FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies (including bcrypt) in the container
RUN npm install

# Copy the rest of your server code
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
