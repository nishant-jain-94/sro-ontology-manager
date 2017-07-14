const highland = require('highland');

const byInsertOperation = (oplog) => oplog.op == 'i';
const toMessage = (oplog) => {
    return {queue: oplog.ns, message: oplog.o};
}

const insertStream = highland.pipeline(
                highland.filter(byInsertOperation),
                highland.map(toMessage)
            ); 
                    

module.exports = insertStream;