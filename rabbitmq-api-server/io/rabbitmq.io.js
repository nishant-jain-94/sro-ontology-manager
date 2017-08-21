const rabbitmqController = require('../controller/index.js');


const rabbitmqio = (io) => {
    io.on('connection', (socket) => {
        console.log('connected');
        fetchNoOfQueuesAndEmitData(socket);      
        fetchConsumerUtilisation(socket);
    });
};

const fetchNoOfQueuesAndEmitData = (socket) => {
    setInterval(() => {
        rabbitmqController.getNoOfQueues((err, data) => {
            if(!err) {socket.emit('queues', data);}
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
}



module.exports = rabbitmqio;