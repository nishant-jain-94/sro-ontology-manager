# Stackroute Online Ontology Manager - Worker Queue  
[![Build Status](https://travis-ci.org/nishant-jain-94/sro-ontology-manager.svg?branch=dev-mq-ui)](https://travis-ci.org/nishant-jain-94/sro-ontology-manager) [![Coverage Status](https://coveralls.io/repos/github/nishant-jain-94/sro-ontology-manager/badge.svg?branch=dev-mq-ui)](https://coveralls.io/github/nishant-jain-94/sro-ontology-manager?branch=dev-mq-ui)


### Approach
![RepresentingEntitiesUsingWorkerQueue](./thoughts/SRO-RepresentingEntitiesInGraphDBUsingWorkerQueues-v1.1.png)

## Running Ontology Manager

```
docker-compose build --build -d
```

### Running Node Factory Seperately ###

Remain in the context of SRO-ONTOLOGY-MANAGER and execute the following command.
```
docker build -t node_factory -f ontology_processors_neo4j/node_factory/Dockerfile .
```

#### Why to remain in the context of SRO-ONTOLOGY-MANAGER? ####

All the utils like neo4j_utils, amqp_utils, sro_utils, are present in the SRO-ONTOLOGY-MANAGER and a symlinks is created in the node-factory, relation-factory and other Microservices.