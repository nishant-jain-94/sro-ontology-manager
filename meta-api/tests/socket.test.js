var io = require('socket.io-client'),
    assert = require('assert'),
    chai = require('chai'),
    expect = chai.expect;

    describe('Test for sockets', function() {
        var socket;

        beforeEach((done) => {
            // Setup
            socket = io.connect('http://localhost:3001', {
                'reconnection delay': 0,
                'reopen delay': 0,
                'forcr new connection': true
            });
            socket.on('connect', () => {
                done();
              });
        });

        afterEach((done) => {
            if(socket.connected) {
                // console.log('disconnecting ...');
                socket.disconnect();
            } 
            
            done();
        });


        it('should emit \'queues\' event', function(done) {
            socket.on('queues', function(data) {
                expect(data).to.have.property('count');
                  
            }); 
            // done();
        });

    });