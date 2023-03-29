FROM node:17-alpine

# Create app directory 
WORKDIR /User-API-Assignment/src/index

COPY package*.json ./

RUN npm install 

# Copy source code to container
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
