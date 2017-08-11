const express = require('express');
const router = express.router();
const assessmentServiceController = require('./assessment-service.controller');

router.patch('/exec/getAssessmentItem', (req, res, next) => {
  const assessmentId = req.query.ASSESSMENT_ITEM_ID;
  assessmentServiceController.getAssessmentsItems(assessmentId, (err, assessmentItem) => {
    res.json(assessmentItem);
  });
});

router.patch('/exec/countAssessmentItems', (req, res, next) => {
  assessmentServiceController.countAssessmentItems((err, assessmentCount) => {
    res.json(assessmentCount);
  });
});

router.patch('/exec/searchAssessmentItems', (req, res, next) => {
  assessmentServiceController.searchAssessmentItems((err, assessments) => {
    res.json(assessments);
  });
});

module.exports = router;