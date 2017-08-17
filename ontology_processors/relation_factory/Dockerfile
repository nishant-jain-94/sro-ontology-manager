FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN yarn install

# Bundle app source
COPY . /usr/src/app

VOLUME /usr/src/app/neo4j_utils /usr/src/app/amqp_utils /usr/src/app/sro_utils

CMD ["yarn", "start"]