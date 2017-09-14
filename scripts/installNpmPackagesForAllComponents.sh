#!/usr/bin/env bash

:'

To install all node_modules in all the Components. 
Ideal when setting up projects or setting up CI

'

cd amqp_utils && npm install
cd .. && cd neo4j_utils && npm install
cd ../ontology_broker && npm install 
cd ../ontology_processors/concept-processor && npm install
cd ../../ontology_processors/learner-state-processor && npm install
cd ../../ontology_processors/media-content-processor && npm install
cd ../../ontology_processors/user-processor && npm install
cd ../../ontology_processors/learning-resource-processor && npm install
cd ../../ontology_processors/question-processor && npm install
cd ../../ontology_processors/course-processor && npm install
cd ../../ontology_processors/node-factory && npm install
cd ../../ontology_processors/relation-factory && npm install
cd ../../ontology_processors_api/ && npm install
cd ../sro_utils/ && npm install
cd ../meta-client/ && npm install
cd ../meta-api/ && npm install