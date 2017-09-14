FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app

# Declare /usr/src/app as the source folder
WORKDIR /usr/src/app

# Copy package.json into the src folder
COPY package.json /usr/src/app

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . /usr/src/app

# Run yarn start command
CMD ["yarn", "start"]