const listOfContents = [
    {
        "mongoId": "54dcd67e2ff5495f08e6b478",
        "mediaContentId": "info:fedora/learning:34062",
        "displayName": "JUnit tutorial",
        "contentSubType": "None"
    },
    {
        "mongoId": "54dcd67e2ff5495f08e6b344",
        "mediaContentId": "info:fedora/learning:39309",
        "displayName": "Java Environment Setup",
        "contentSubType": "None"
    },
    {
        "mongoId": "54dcd67d2ff5495f08e6b197",
        "mediaContentId": "info:fedora/learning:29306",
        "displayName": "Java - Basic Syntax",
        "contentSubType": "None"
    },
    {
        "mongoId": "54dcd67d2ff5495f08e6b191",
        "mediaContentId": "info:fedora/learning:26372",
        "displayName": "Computer Programming Environment",
        "contentSubType": "None"
    },
    {
        "mongoId": "54dcd67d2ff5495f08e6b026",
        "mediaContentId": "info:fedora/learning:22126",
        "displayName": "RACI Chart Tool",
        "contentSubType": "None"
    },
    {
        "mongoId": "54dcd67d2ff5495f08e6b023",
        "mediaContentId": "info:fedora/learning:27992",
        "displayName": "  JUnit Tutorial (PDF Version)",
        "contentSubType": "None"
    }];

const listOfRelatedConcepts = [
    {
        "identifier": "info:fedora/learning:10485",
        "displayName": "AOP",
        "name": "AOP"
    },
    {
        "identifier": "info:fedora/learning:10643",
        "displayName": "AWS",
        "name": "AWS"
    },
    {
        "identifier": "info:fedora/learning:8793",
        "displayName": "Absolute Positioning",
        "name": "Absolute_Positioning"
    },
    {
        "identifier": "info:fedora/learning:15376",
        "displayName": "Abstract Class",
        "name": "Abstract_Class"
    },
    {
        "identifier": "info:fedora/learning:17486",
        "displayName": "Abstract Factory",
        "name": "Abstract_Factory"
    },
    {
        "identifier": "info:fedora/learning:15895",
        "displayName": "Abstraction",
        "name": "Abstraction"
    },
    {
        "identifier": "info:fedora/learning:10781",
        "displayName": "Activity Diagram",
        "name": "Activity_Diagram"
    }
];

const listOfRelatedCourses = [];
const relatedEntities = {
    "entityId": "info:fedora/learning:24966",
    "entityType": "contents",
    "entityName": "Component-based software engineering",
    "relatedGroups": [
      {
        "name": "courses",
        "entities": [
          {
            "entityId": "info:fedora/learning:11280",
            "entityType": "concepts",
            "entityName": "Programming Language"
          }
        ]
      },
      {
        "name": "concepts",
        "entities": [
          {
            "entityId": "info:fedora/learning:34062",
            "entityType": "contents",
            "entityName": "JUnit tutorial"
          },
          {
            "entityId": "info:fedora/learning:39309",
            "entityType": "contents",
            "entityName": "Java Environment Setup"
          },
          {
            "entityId": "info:fedora/learning:29306",
            "entityType": "contents",
            "entityName": "Java - Basic Syntax"
          },
          {
            "entityId": "info:fedora/learning:26372",
            "entityType": "contents",
            "entityName": "Computer Programming Environment"
          },
          {
            "entityId": "info:fedora/learning:22126",
            "entityType": "contents",
            "entityName": "RACI Chart Tool"
          },
          {
            "entityId": "info:fedora/learning:27992",
            "entityType": "contents",
            "entityName": "  JUnit Tutorial (PDF Version)"
          }
        ]
      }
    ]
  };

module.exports = {
    listOfContents,
    listOfRelatedConcepts,
    listOfRelatedCourses,
    relatedEntities
};