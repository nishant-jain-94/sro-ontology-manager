#!/usr/bin/env bash

yarn add global nyc mocha
export BUNYAN_OFF=true
./node_modules/.bin/nyc ./node_modules/.bin/mocha $(find . -type f -name "*.test.js" \
          ! -path "./neo4j_utils*" \
          ! -path "./sro_utils*" \
          ! -path "./amqp_utils*" \
          ! -path "./ontology*/node_modules*" \
          ! -path "./ontology*/neo4j_utils*" \
          ! -path "./ontology*/amqp_utils*" \
          ! -path "./ontology*/sro_utils*" \
          ! -path "./integration-tests*" \
          ! -path "./exploreui/node_modules*" \
          ! -path "./ontology_processors_api/neo4j_utils*" \
          ! -path "./ontology_processors_api/sro_utils*" \
          ! -path "./ontology_processors_api/amqp_utils*" \
          ! -path "./meta-api/node_modules*" \
          ! -path "./meta-client/node_modules*") --timeout 10000