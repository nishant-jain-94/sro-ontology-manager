FROM yarnpkg/node-yarn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN yarn install

# Bundle app source
COPY . /usr/src/app

VOLUME /scripts /usr/src/app/neo4j_utils /usr/src/app/amqp_utils /usr/src/app/sro_utils /usr/src/app/logs

CMD ["yarn", "start"]