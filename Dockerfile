FROM node:18:bullseye


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Define the command to run your app
CMD ["npm", "start"]
