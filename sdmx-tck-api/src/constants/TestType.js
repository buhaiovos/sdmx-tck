const TEST_TYPE = {

    //STRUCTURE TEST TYPES
    STRUCTURE_IDENTIFICATION_PARAMETERS: "Structure Identification Parameters",
    STRUCTURE_REFERENCE_PARAMETER: "Structure Reference Parameter Tests",
    STRUCTURE_DETAIL_PARAMETER: "Structure Detail Parameter Tests",
    STRUCTURE_QUERY_REPRESENTATION: "Structure Query Representation",
    STRUCTURE_TARGET_CATEGORY: "Structure Target Category",
    STRUCTURE_REFERENCE_PARTIAL:"Structure Reference Partial",

    //SCHEMA TEST TYPES
    PREPARE_SCHEMA_TESTS:"Prepare Schema Tests",
    SCHEMA_IDENTIFICATION_PARAMETERS_WITH_CONSTRAINTS:"Schema Identification Parameters With Constraints",
    SCHEMA_FURTHER_DESCRIBING_PARAMETERS_WITH_CONSTRAINTS:"Schema Further Describing Parameters With Constraints",
    SCHEMA_IDENTIFICATION_PARAMETERS_WITH_NO_CONSTRAINTS:"Schema Identification Parameters With No Constraints",
    SCHEMA_FURTHER_DESCRIBING_PARAMETERS_WITH_NO_CONSTRAINTS:"Schema Further Describing Parameters With No Constraints",

    //DATA TEST TYPES
    DATA_IDENTIFICATION_PARAMETERS:"Data Identification Parameters",
    DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS:"Data Extended Resource Identification Parameters",
    DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS:"Data Further Describing Results Parameters",
    DATA_REPRESENTATION_SUPPORT_PARAMETERS:"Data Representation Support Parameters",
    DATA_OTHER_FEATURES:"Data Other Features",
    DATA_AVAILABILITY:"Data Availability"
};

module.exports.TEST_TYPE = Object.freeze(TEST_TYPE);