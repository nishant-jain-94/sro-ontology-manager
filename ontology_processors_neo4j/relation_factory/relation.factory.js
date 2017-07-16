const async = require('async');
const {sendToQueue} = require('./amqp_utils');
const highland = require('highland');
const mergeOrCreateRelation = require('./neo4j_utils/mergeOrCreateRelation');

const toObject = (message) => {
    const triple = JSON.parse(message.content.toString());
    const header = message;
    return {header, triple};
};

const mergeOrCreateRelationWrapper = highland.wrapCallback(({header, triple}, cb) => {
    mergeOrCreateRelation(triple, (err, data) => {
        if (data.records.length === 0) {
            const messageData = {
                message: triple,
                queue: 'relation_factory'
            };
            console.log(triple);
            console.log(data);
            sendToQueue(messageData);
        };
        cb(err, {header, data});
    });
});

const relation_factory = (s) => s.map(toObject).flatMap(mergeOrCreateRelationWrapper);

module.exports = relation_factory;