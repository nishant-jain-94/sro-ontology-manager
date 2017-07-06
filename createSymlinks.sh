#!/usr/bin/env bash

:'

The purpose of the createSymlinks.sh is to create a softlink for all the *_utils.
The main intent is to share these modules across ontology_broker and ontology_processors.
Advantages:
1. Make it easier to create Docker containers
2. Avoids long require paths

'

sudo ln -s $PWD/sro_utils $PWD/amqp_utils/sro_utils
sudo ln -s $PWD/sro_utils $PWD/ontology_broker/sro_utils
sudo ln -s $PWD/amqp_utils $PWD/ontology_broker/amqp_utils

for processor in `find ./ontology_processors -type d -maxdepth 1 \
                    ! -path "./ontology_processors/.nyc_output" \
                    ! -path "./ontology_processors/node_modules" \
                    ! -path "./ontology_processors/coverage" \
                    ! -path "./ontology_processors"`

do
    sudo ln -s $PWD/sro_utils $PWD/$processor/sro_utils
    sudo ln -s $PWD/neo4j_utils $PWD/$processor/neo4j_utils
    sudo ln -s $PWD/amqp_utils $PWD/$processor/amqp_utils
done

sudo ln -s $PWD/sro_utils $PWD/neo4j_utils