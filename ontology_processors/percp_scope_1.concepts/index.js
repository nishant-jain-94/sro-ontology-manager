// # Concept Processor

// ## index.js (Concept Processor)

// Imports the required dependencies
const conceptAck = require('./concept.ack');
const conceptStream = require('./concept.consumer');
const conceptProcessor = require('./concept.processor');
const conceptRouter = require('./concept.router');

// Orchestrates the pipeline
// 1. The input `conceptStream` coming from the concept consumer is piped to the `conceptProcessor`.
// 2. `conceptProcessor` processes the concept and create triples of concepts.
// 3. Then the output from the `conceptProcessor` is piped to the `conceptRouter` which routes the concepts to the node_factory and relation_factory.
// 4. Once the entire processing on the concept is performed an acknowledgement is sent to the queue using `conceptAck`.
conceptStream.pipe(conceptProcessor).pipe(conceptRouter).each(conceptAck);