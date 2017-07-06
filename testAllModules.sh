#!/usr/bin/env bash

yarn add global nyc mocha

nyc mocha $(find . -type f -name "*.test.js" \
          ! -path "./neo4j_utils/node_modules*" \
          ! -path "./sro_utils/node_modules*" \
          ! -path "./amqp_utils/node_modules*" \
          ! -path "./ontology_processors/node_modules*" \
          ! -path "./ontology_broker/node_modules*")