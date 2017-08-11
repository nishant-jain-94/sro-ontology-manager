const Questions = require('./question.model.js');

const getAssessmentsItems = (identifier, cb) => {
    const responseObj = {
        responseValueObjects: {
            ASSESSMENT_ITEM: {},
            STATUS: {
                statusCode: 0,
                statusType: "SUCCESS",
                statusMessage: "Operation successfull",
                errorMessages: null
            }
        },
        errors: []
    };

    Questions.find({identifier: identifier}, (err, data) => {
        if(!err) {
            responseObj.responseValueObjects.ASSESSMENT_ITEM = data;
            cb(null, responseObj)
        } else {
            cb(err, null);
        }
    });
};

const countAssessmentItems = (cb) => {
    const responseObj = {
      responseValueObjects: {
        COUNT: {
          id: 0
        },
        STATUS: {
          statusCode: 0,
          statusType: "SUCCESS",
          statusMessage: "Operation successfull",
          errorMessages: null
        }
      },
      errors: []
    };
    Questions.count({}, (err, count) => {
        if(!err) {
            responseObj.responseValueObjects.COUNT.id = count;
            cb(null, responseObj);
        } else {
            cb(err, null);
        }
    });
};

const searchAssessmentItems = () => {
    const responseObj = {
        responseValueObjects: {
            ASSESSMENT_ITEM_LIST: {
                valueObjectList: []
            },
            STATUS: {
                statusCode: "0",
                statusType: "SUCCESS",
                statusMessage: "Operation successful",
                errorMessages: null
            }
        },
        errors: []
    };
    Questions.find({}, 'identifier questionSubType difficultyLevel purpose title concepts learningElements body duration status mediaURL data testUsage', (err, data) => {
        if(!err) {
            responseObj.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList = data;
            cb(null, responseObj);
        } else {
            cb(err, null);
        }
        
    });
};


module.exports = {
    countAssessmentItems,    
    getAssessmentsItems,
    searchAssessmentItems
};