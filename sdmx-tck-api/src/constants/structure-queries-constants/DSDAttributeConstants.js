const ATTRIBUTE_RELATIONSHIP_NAMES = {
    DIMENSION:"Dimension",
    ATTACHMENT_GROUP:"AttachmentGroup",
    GROUP:"Group",
    PRIMARY_MEASURE:"PrimaryMeasure",
    NONE:"None",
}

const ATTRIBUTE_ASSIGNMENT_STATUS = {
    MANDATORY:"Mandatory",
    CONDITIONAL:"Conditional",
}

const RELATIONSHIP_REF_ID = {
    GROUP:"Group"
}

const ATTRIBUTE_NAMES = {
    REPORTING_YEAR_START_DAY:"REPORTING_YEAR_START_DAY"
}

module.exports.ATTRIBUTE_RELATIONSHIP_NAMES = Object.freeze(ATTRIBUTE_RELATIONSHIP_NAMES);
module.exports.ATTRIBUTE_ASSIGNMENT_STATUS = Object.freeze(ATTRIBUTE_ASSIGNMENT_STATUS);
module.exports.RELATIONSHIP_REF_ID = Object.freeze(RELATIONSHIP_REF_ID);
module.exports.ATTRIBUTE_NAMES = Object.freeze(ATTRIBUTE_NAMES);