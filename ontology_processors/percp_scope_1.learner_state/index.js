const learnerStateAck = require('./learner_state.ack');
const learnerStateStream = require('./learner_state.consumer');
const learnerStateProcessor = require('./learner_state.processor');
const learnerStateRouter = require('./learner_state.router');
const log = require('./sro_utils/logger');

learnerStateStream.pipe(learnerStateProcessor).pipe(learnerStateRouter).each(learnerStateAck);