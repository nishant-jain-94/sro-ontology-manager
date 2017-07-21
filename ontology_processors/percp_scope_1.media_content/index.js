// # Media Content

// ## index.js (Media Content)

// Imports the required dependencies.
const mediaContentAck = require('./media_content.ack');
const mediaContentStream = require('./media_content.consumer');
const mediaContentProcessor = require('./media_content.processor');
const mediaContentRouter = require('./media_content.router');

// Orchestrates the pipeline
// 1. The input `mediaContentStream` coming from the mediaContent consumer is piped to the `mediaContentProcessor`.
// 2. `mediaContentProcessor` processes the media and create triples of Media.
// 3. Then the output from the `mediaContentProcessor` is piped to the `mediaContentRouter` which routes the mediaContent to the node_factory and relation_factory.
// 4. Once the entire processing on the mediaContent is performed an acknowledgement is sent to the queue using `mediaContentAck`.
mediaContentStream.pipe(mediaContentProcessor).pipe(mediaContentRouter).each(mediaContentAck);