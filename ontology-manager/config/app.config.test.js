const should = require('should');
const appConfig = require('./app.config.js');

describe('Ontology Manager Configurations', () => {
	it('Should have all necessary configurations', (done) => {
		appConfig.should.have.property('NEO4J_HOST').which.is.a.String();
		appConfig.should.have.property('NEO4J_PORT').which.is.a.Number();
		appConfig.should.have.property('NEO4J_BOLT_PORT').which.is.a.Number();
		appConfig.should.have.property('NEO4J_PROTOCOL').which.is.a.String();
		appConfig.should.have.property('NEO4J_USERNAME').which.is.a.String();
		appConfig.should.have.property('NEO4J_PASSWORD').which.is.a.String();
		appConfig.should.have.property('NEO4J_BASE64_ENCODED_CREDENTIALS').which.is.a.String();
		done();
	});
});