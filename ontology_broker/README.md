# Ontology Broker

## Working of an Ontology Broker

- An Ontology Broker streams from MongoDB's Oplog Collection pipes it to Oplog Handler.
- The main intent of having an Oplog Handler is to future proof with any versions of Oplog. If there is any change in the way MongoDB represents Oplog. Then the only part which has to be changed is this Oplog Handler. Oplog Handler pipes the input stream to the following handlers.
  - Insert Handler: Insert Handler filters Oplog document based on the ***insert*** operation and returns the exact document inserted. 
  - Update Handler: 
    1. Update Handler on the other hand filters Oplog document based on the ***update*** operation.
    2. Every Update Oplog has only the portion of data which got updated. Now this partial data might not really be helpful in decision making to other Ontology Processors.
    3. So in order to avoid that the Update Handler Queries the MongoDB for the actual document which got updated. The Updated Document is then returned on to the pipe.
- The output of the Oplog Handler is then mapped to a ***toQueue***.
  - ***toQueue*** module then uses ***queueMapper.js*** to map the message to an appropriate Queue.

## Questions

### I can't see Queues being created for ***few*** oplogs?

Ontology Broker tails MongoDB's Oplog. Anything which is present in Oplog gets streamed into Ontology Broker. So the only thing which might hinder the creation of queues would probably be ***queueMapper.js***. 

A ***queueMapper.js*** is a very simple mapper which describes what kind of message is to be routed to a particular queue. 