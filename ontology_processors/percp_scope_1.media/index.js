// # Media

// ## index.js (Media)

// Imports the required dependencies.
const mediaAck = require('./media.ack');
const mediaStream = require('./media.consumer');
const mediaProcessor = require('./media.processor');

// Orchestrates the pipeline
// 1. The input `mediaStream` coming from the Media consumer is piped to the `mediaProcessor`.
// 2. `mediaProcessor` processes the media and create triples of Media.
// 3. Then the output from the `mediaProcessor` is piped to the `mediaRouter` which routes the learningResource to the node_factory and relation_factory.
// 4. Once the entire processing on the media is performed an acknowledgement is sent to the queue using `mediaAck`.
mediaStream.pipe(mediaProcessor).each(mediaAck);