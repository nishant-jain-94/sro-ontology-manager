// Ontology Broker

// ## ontology_broker/queueMapper.js

// Maps a Message of a certain type to the queue mapped. 
const queueMapper = {
    'percp_scope_1.concepts': 'concept',
    'percp_scope_1.course': 'course',
    'percp_scope_1.media_content': 'content',
    'percp_scope_1.user': 'user',
    'percp_scope_1.learner_state': 'learner_state',
    'percp_scope_1.learning_resources': 'learning_resource',
    'percp_scope_1.questions': 'questions'
};

// Exports the queueMapper Object.
module.exports = queueMapper;