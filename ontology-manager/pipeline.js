const _ = require('lodash');
const highland = require('highland');

const log = require('./util/logger');
const {processors, event_processor} = require('./event_processors');

const byNamespace = s => _.filter(processors, { 'name': s.ns }).length > 0;

const pipeline = highland.pipeline(
    highland.filter(byNamespace),
    highland.through(event_processor)
);

module.exports = pipeline;