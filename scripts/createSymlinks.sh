#!/usr/bin/env bash

sudo ln -sfn $PWD/sro_utils $PWD/amqp_utils/sro_utils
sudo ln -sfn $PWD/sro_utils $PWD/ontology_broker/sro_utils
sudo ln -sfn $PWD/amqp_utils $PWD/ontology_broker/amqp_utils

for processor in `find ./ontology_processors -maxdepth 1 -type d ! -path "./ontology_processors*/.nyc_output" ! -path "./ontology_processors*/node_modules" ! -path "./ontology_processors*/coverage" ! -path "./ontology_processors" ! -path "./ontology_processors_neo4j"`

do
    sudo ln -sfn $PWD/sro_utils $PWD/$processor/sro_utils
    sudo ln -sfn $PWD/neo4j_utils $PWD/$processor/neo4j_utils
    sudo ln -sfn $PWD/amqp_utils $PWD/$processor/amqp_utils
done

sudo ln -sfn $PWD/sro_utils $PWD/neo4j_utils

sudo ln -sfn $PWD/sro_utils $PWD/ontology_processors_api/sro_utils
sudo ln -sfn $PWD/neo4j_utils $PWD/ontology_processors_api/neo4j_utils
sudo ln -sfn $PWD/amqp_utils $PWD/ontology_processors_api/amqp_utils