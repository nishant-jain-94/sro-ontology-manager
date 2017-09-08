# Meta API

Provides Sockets and API end points to get the status and other information about various components like RabbbitMQ, Neo4j etc.

---

## Socket Events

### RabbitMQ

- `healthStatus`- To get the status of RabbitMQ.

- `queues` - To get the number of queues.

- `consumers`- To get the number of active consumers.

- `consumerUtilization` - To get consumer Utilisation and other data.

### Neo4j

- `neo4jHealthStatus`- To get the status of Neo4j.

- `neo4jData` - To get the number of nodes and number of relationships created in Neo4j database.



## API Endpoints

### RabbitMQ

- `GET healthStatus`- To get the status of RabbiMQ.

- `GET noOfQueues` - To get the number of queues.

- `GET noOfConsumers` - To get the number of active consumers.

- `GET consumerUtilisation` - To get consumer Utilisation and other data.

### Neo4j

- `GET neo4jHealthStatus` - To get the status of Neo4j.

- `GET neo4jData` - To get the number of nodes and number of relationships created in Neo4j database. 

