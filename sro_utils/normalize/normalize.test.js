const should = require('should');
const replaceWhiteSpaceByUnderscore = require('./normalize');

describe('String Utility', (done) => {
    it('Should Replace WhiteSpace in string with Underscore', (done) => {
        const s = "App Engine Support";
        const modifiedString = s.normalize();
        modifiedString.should.be.exactly('App_Engine_Support');
        done();
    });
    
    it('Should Replace Period in string with Underscore', (done) => {
        const s = "Salesforce.com.in";
        const modifiedString = s.normalize();
        modifiedString.should.be.exactly('Salesforce_com_in');
        done();
    });

});