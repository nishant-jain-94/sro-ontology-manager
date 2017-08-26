const neo4jController = require('../controller/index.js');


const neo4jio = (io) => {
    io.on('connection', (socket) => {
        console.log('neo4j connected');
        fetchNeo4jHealthStatus(socket);
        fetchNeo4jData(socket);
    });
};

const fetchNeo4jHealthStatus = (socket) => {
    setInterval(() => {
        neo4jController.getNeo4jStatus((err, data) => {
            let defaultValue = { status: "No Connection" };
            if(!err) { socket.emit('neo4jHealthStatus', data); }
            else { socket.emit('neo4jHealthStatus', defaultValue); } 
        });
    }, 5000);
};

const fetchNeo4jData = (socket) => {
    setInterval(() => {
        neo4jController.getNeo4jData((err, data) => {
            if(!err) { socket.emit('neo4jData', data[0].attributes); }
        });
    }, 5000);
}

module.exports = neo4jio;