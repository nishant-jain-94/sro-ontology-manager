const should = require('should');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');
const log = require('../logger');
const async = require('async');
const getDirectories = require('./getDirectories');


describe('Get Directoriess', () => {
    before((done) => {
        async.series([
            (callback) => {
                mkdirp('./tmp/test1', callback);
            },
            (callback) => {
                mkdirp('./tmp/test2', callback);
            }
        ], done);
        
    });

    it('Should get all the directories', (done) => {
        const directories = getDirectories('tmp');
        directories.length.should.be.exactly(2);
        directories[0].should.be.exactly('test1');
        directories[1].should.be.exactly('test2');
        done();
    });

    after((done) => {
        rmdir('./tmp', done);
    });

});