// # RabbitMQ Socket methods

// ## rabbitmq.io.js

// The socket methods which emit the data returned by the controller
// at regular intervals (at an interval of 5 seconds).


// Importing the RabbitMQ Controller methods
const rabbitmqController = require('./rabbitmq.controller');

// Listening for an incoming socket connection request upon which
// the socket methods are called 
const rabbitmqio = (io) => {
    io.on('connection', (socket) => {
        console.log('connected');
        fetchNoOfQueues(socket);      
        fetchConsumerUtilisation(socket);
        fetchHealthStatus(socket);
        fetchNoOfConsumers(socket);
    });
};

// `fetchNoOfQueuesAndEmitData` Socket method that emits the number of queues data
// of RabbitMQ every 5 seconds. If RabbitMQ instance is not running then it emits a default value.
const fetchNoOfQueues = (socket) => {
    setInterval(() => {
        rabbitmqController.getNoOfQueues((err, data) => {
            let defaultValue = { count: 0 };
            if(!err) {socket.emit('queues', data);}
            else { socket.emit('queues', defaultValue); }
        });
    }, 5000);
};

// `fetchConsumerUtilisation` Socket method that emits the number of queues data
// of RabbitMQ every 5 seconds. If RabbitMQ instance is not running then it emits an empty value.
const fetchConsumerUtilisation = (socket) => {
    setInterval(() => {
        rabbitmqController.getConsumerUtilisation((err, data) => {
            if(!err) { socket.emit('consumerUtilization', data); }
            else { socket.emit('consumerUtilization', ''); }
        });
    }, 5000);
};

// `fetchHealthStatus` Socket method that emits the Health Status of RabbitMQ
// every five seconds. If RabbitMQ instance is not running then it emits a default value.
const fetchHealthStatus = (socket) => {
    setInterval(() => {
        rabbitmqController.getHealthStatus((err, data) => {
            let defaultValue = { status: "No Connection" };
            if(!err) { socket.emit('healthStatus', data); }
            else { socket.emit('healthStatus', defaultValue); }
        });
    }, 5000);
};

// `fetchNoOfConsumers` Socket method that emits the number of consumers data
// from RabbitMQ every five seconds. If RabbitMQ is not running then it emits a default value.
const fetchNoOfConsumers = (socket) => {
    setInterval(() => {
        rabbitmqController.getNoOfConsumers((err, data) => {
            let defaultValue = { count: 0 };
            if(!err) { socket.emit('consumers', data); }
            else { socket.emit('consumers', defaultValue); }
        });
    }, 5000);
};

// Exporting the rabbitmqio socket method
module.exports = rabbitmqio;