const should = require('should');
const highland = require('highland');
const insertHandler = require('./oplog.insert');

describe('Insert Oplog Handler', () => {
  it('Should Handle Oplogs with insertion operation', (done) => {
    const oplogs = [{
      v: 2,
      op: 'i',
      ns: 'percp_scope_1.concepts',
      o: {
        _id: '58ad820029abbc9e35aa9a8f',
        title: 'CSS',
        context: 'Web user interfaces',
        identifier: 'info:fedora/learning:1443',
        categoryCounts: [],
        contentCategories: [],
        associations: [],
        description: 'CSS',
        metadata: {
          node_type: 'NODE',
          object_uri: 'info:fedora/learning:1443',
          setType: 'concept',
          context: 'Web user interfaces',
          nodeId: 'jsc430',
          description: 'CSS',
          identifier: 'info:fedora/learning:1443',
          descriptionVerified: false
        }
      }
    },
    {
      v: 2,
      op: 'n',
      ns: 'percp_scope_1.concepts',
      o: {
        _id: '58ad820029abbc9e35aa9a8g',
        title: 'CSS',
        context: 'Web user interfaces',
        identifier: 'info:fedora/learning:1443',
        categoryCounts: [],
        contentCategories: [],
        associations: [],
        description: 'CSS',
        metadata: {
          node_type: 'NODE',
          object_uri: 'info:fedora/learning:1443',
          setType: 'concept',
          context: 'Web user interfaces',
          nodeId: 'jsc430',
          description: 'CSS',
          identifier: 'info:fedora/learning:1443',
          descriptionVerified: false
        }
      }
    }
    ];
    highland((push) => {
      oplogs.forEach((oplog) => {
        push(null, oplog);
      });
      push(null, highland.nil);
    }).pipe(insertHandler).each((oplog) => {
      should.exist(oplog);
      oplog.queue.should.be.exactly('percp_scope_1.concepts');
      oplog.message._id.should.be.exactly('58ad820029abbc9e35aa9a8f');
      done();
    });
  });
});
