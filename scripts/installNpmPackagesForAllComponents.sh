#!/usr/bin/env bash

:'

To install all node_modules in all the Components. 
Ideal when setting up projects or setting up CI

'

cd amqp_utils && npm install
cd .. && cd neo4j_utils && npm install
cd ../ontology_broker && npm install 
cd ../ontology_processors_neo4j/node_factory && npm install
cd ../../ontology_processors_neo4j/relation_factory && npm install
cd ../../ontology_processors/percp_scope_1.concepts && npm install
cd ../../ontology_processors/percp_scope_1.learner_state && npm install
cd ../../ontology_processors/percp_scope_1.learning_object_element && npm install
cd ../../ontology_processors/percp_scope_1.media && npm install
cd ../../ontology_processors/percp_scope_1.media_content && npm install
cd ../../ontology_processors/percp_scope_1.user && npm install
cd ../../sro_utils/ && npm install