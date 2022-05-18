FROM node:latest
WORKDIR /counterterrorism_dash
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]