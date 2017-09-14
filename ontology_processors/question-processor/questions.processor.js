// # Question Processor

// ## question.processor.js

// Imports the required dependencies.
require('./sro_utils/normalize');
const highland = require('highland');

// const log = require('./sro_utils/logger')('Questions_Processor');

// `toQuestionNode` converts a question document to a source node.
// `toQuestionNode` inputs a message and then creates a source node following the steps below.
// 1. Stores the `message` in `header` which is to be used in later stages to send Acknowledgements.
// 2. Parses the string in the message to the question.
// 3. Creates a `source` using the `label`, `identifier`. With `identifier` being the property used to create Question Node.
const toQuestionNode = (message) => {
    const header = message;
    const percpQuestion = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: 'question',
            identifier: percpQuestion.identifier,
            question: percpQuestion.question,
            learningElements: percpQuestion.learningElements,
            purpose: percpQuestion.purpose,
            questionType: percpQuestion.questionType,
            difficultyLevel: percpQuestion.difficultyLevel
        },
        options: {
            uniqueConstraintsOn: [
                'identifier'
            ]
        }
    };
    let triples = [{source}];

    return {header, triples};
};

// The `processor` input a stream and maps it toQuestionNode.
const processor = highland.pipeline(
    highland.map(toQuestionNode)
);

// Exports the processor
module.exports = processor;