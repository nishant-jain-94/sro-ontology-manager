#!/usr/bin/env bash

yarn add global nyc mocha
export BUNYAN_OFF=true
nyc mocha $(find . -type f -name "*.test.js" \
          ! -path "./neo4j_utils/node_modules*" \
          ! -path "./sro_utils/node_modules*" \
          ! -path "./amqp_utils/node_modules*" \
          ! -path "./ontology*/node_modules*" \
          ! -path "./ontology*/neo4j_utils*" \
          ! -path "./ontology*/amqp_utils*" \
          ! -path "./ontology*/sro_utils*" \
          ! -path "./integration-tests*")