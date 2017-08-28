FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN yarn install

# Bundle app source
COPY . /usr/src/app

# Expose port 4200 of the container
EXPOSE 4201

# Start serving files using yarn start
CMD ["yarn", "start", "--host=0.0.0.0"]


