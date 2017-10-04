#!/usr/bin/env bash

:'

To install all node_modules in all the Components. 
Ideal when setting up projects or setting up CI

'

cd amqp_utils && yarn install
cd .. && cd neo4j_utils && yarn install
cd ../ontology_broker && yarn install 
cd ../ontology_processors/concept-processor && yarn install
cd ../../ontology_processors/learner-state-processor && yarn install
cd ../../ontology_processors/media-content-processor && yarn install
cd ../../ontology_processors/user-processor && yarn install
cd ../../ontology_processors/learning-resource-processor && yarn install
cd ../../ontology_processors/question-processor && yarn install
cd ../../ontology_processors/course-processor && yarn install
cd ../../ontology_processors/node-factory && yarn install
cd ../../ontology_processors/relation-factory && yarn install
cd ../../ontology_processors_api/ && yarn install
cd ../sro_utils/ && yarn install
cd ../meta-client/ && yarn install
cd ../meta-api/ && yarn install