const should = require('should');
const doesPropertyExists = require('./doesPropertyExists');

describe('Does Property Exists', (done) => {
    const testObj = {
        subObj: {
            a: '',
            b: null,
            c: undefined,
            d: 'Hello'
        }
    };
    
    it('Should return false when property is undefined', (done) => {
        doesPropertyExists(testObj, 'subObj.c').should.be.exactly(false);
        done();
    });

    it('Should return false when property is null', (done) => {
        doesPropertyExists(testObj, 'subObj.b').should.be.exactly(false);     
        done();   
    });

    it('Should return false when property is empty', (done) => {
        doesPropertyExists(testObj, 'subObj.a').should.be.exactly(false);
        done();
    });

    it('Should return true when property exists', (done) => {
        doesPropertyExists(testObj, 'subObj.d').should.be.exactly(true);
        done();
    });
});