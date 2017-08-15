// # Course Processor

// ## index.js (Course Processor)

// Imports the required dependencies
const courseAck = require('./course.ack');
const courseStream = require('./course.consumer');
const courseProcessor = require('./course.processor');
const courseRouter = require('./course.router');

// Orchestrates the pipeline
// 1. The input `courseStream` coming from the course consumer is piped to the `courseProcessor`.
// 2. `courseProcessor` processes the course and create triples of courses.
// 3. Then the output from the `courseProcessor` is piped to the `courseRouter` which routes the courses to the node_factory and relation_factory.
// 4. Once the entire processing on the course is performed an acknowledgement is sent to the queue using `courseAck`.
courseStream.pipe(courseProcessor).pipe(courseRouter).each(courseAck);