const highland = require('highland');

const processors = [
    {name: 'percp_scope_1.concepts', processor: require('./percp_scope_1.concepts')}
    // {name: 'percp_scope_1.learning_object_element', processor: require('./percp_scope_1.learning_object_element')},
    // {name: 'percp_scope_1.learner_state', processor: require('./percp_scope_1.learner_state')},
    // {name: 'percp_scope_1.user', processor: require('./percp_scope_1.user')}
]

exports.event_processor = (s) => {
    const streams = processors.map((processor) => {
        const byProcessor = event => event.name == process.name; 
        return s.fork()
                .filter(byProcessor)
                .through(processor.processor);
    });

    return highland(streams).merge();
};

exports.processors = processors;
