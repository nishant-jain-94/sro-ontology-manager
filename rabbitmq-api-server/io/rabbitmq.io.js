const rabbitmqController = require('../controller/index.js');


const rabbitmqio = (io) => {
    io.on('connection', (socket) => {
        console.log('connected');
        fetchNoOfQueuesAndEmitData(socket);      
        fetchConsumerUtilisation(socket);
        fetchHealthStatus(socket);
        fetchNoOfConsumers(socket);
    });
};

const fetchNoOfQueuesAndEmitData = (socket) => {
    setInterval(() => {
        rabbitmqController.getNoOfQueues((err, data) => {
            let defaultValue = { count: 0 };
            if(!err) {socket.emit('queues', data);}
            else { socket.emit('queues', defaultValue); }
        });
    }, 5000);
};

const fetchConsumerUtilisation = (socket) => {
    setInterval(() => {
        rabbitmqController.getConsumerUtilisation((err, data) => {
            if(!err) { socket.emit('consumerUtilization', data); }
            else { socket.emit('consumerUtilization', ''); }
        });
    }, 5000);
};

const fetchHealthStatus = (socket) => {
    setInterval(() => {
        rabbitmqController.getHealthStatus((err, data) => {
            let defaultValue = { status: "No Connection" };
            if(!err) { socket.emit('healthStatus', data); }
            else { socket.emit('healthStatus', defaultValue); }
        });
    }, 5000);
};

const fetchNoOfConsumers = (socket) => {
    setInterval(() => {
        rabbitmqController.getNoOfConsumers((err, data) => {
            let defaultValue = { count: 0 };
            if(!err) { socket.emit('consumers', data); }
            else { socket.emit('consumers', defaultValue); }
        });
    }, 5000);
};



module.exports = rabbitmqio;