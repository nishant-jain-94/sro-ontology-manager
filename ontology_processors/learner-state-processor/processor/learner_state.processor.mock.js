const mongodb = require('mongodb');

const learnerState = {
  student_id: 'amishag',
  elements: [
    {
      identifier: 'info:fedora/learning:2584',
      elementType: 'learningresource',
      isMandatory: true,
      parentId: 'info:fedora/learning:1042',
      name: 'Unordered Lists',
      elementSubType: 'lecture',
      learningTime: 180,
      proficiencyWeightage: 1,
      minProficiency: 100,
      offset: 1,
      mediaType: 'video',
      _id: new mongodb.ObjectId('58e6340e70528b2f6c86bbea'),
      conditions: []
    },
    {
      identifier: 'info:fedora/learning:7321',
      elementType: 'learningresource',
      isMandatory: true,
      parentId: 'info:fedora/learning:1725',
      name: 'Using the Command-line Tool',
      elementSubType: 'lecture',
      learningTime: 480,
      proficiencyWeightage: 1,
      minProficiency: 100,
      offset: 6,
      mediaType: 'video',
      _id: new mongodb.ObjectId('58e6340e70528b2f6c86bbeb'),
      state: 2,
      conditions: []
    },
    {
      identifier: 'info:fedora/learning:7321',
      elementType: 'learningresource',
      isMandatory: true,
      parentId: 'info:fedora/learning:1725',
      name: 'Using the Command-line Tool',
      elementSubType: 'lecture',
      learningTime: 480,
      proficiencyWeightage: 1,
      minProficiency: 100,
      offset: 6,
      mediaType: 'video',
      _id: new mongodb.ObjectId('58e6340e70528b2f6c86bbeb'),
      state: 1,
      conditions: []
    }
  ]
};

module.exports = learnerState;
