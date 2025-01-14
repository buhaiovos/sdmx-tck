const SDMX_STRUCTURE_TYPE = require("../SdmxStructureType.js").SDMX_STRUCTURE_TYPE;
var isDefined = require('../../utils/Utils.js').isDefined;

const STRUCTURE_REFERENCE_DETAIL = {
    NONE: "none",
    PARENTS: "parents",
    PARENTS_SIBLINGS: "parentsandsiblings",
    CHILDREN: "children",
    DESCENDANTS: "descendants",
    ALL: "all",

    // Specific reference artefact type
    DSD: "datastructure",
    MSD: "metadatastructure",
    CATEGORY_SCHEME: "categoryscheme",
    CONCEPT_SCHEME: "conceptscheme",
    CODE_LIST: "codelist",
    HIERARCHICAL_CODELIST: "hierarchicalcodelist",
    ORGANISATION_SCHEME: "organisationscheme",
    AGENCY_SCHEME: "agencyscheme",
    DATA_PROVIDER_SCHEME: "dataproviderscheme",
    DATA_CONSUMER_SCHEME: "dataconsumerscheme",
    ORGANISATION_UNIT_SCHEME: "organisationunitscheme",
    DATAFLOW: "dataflow",
    METADATA_FLOW: "metadataflow",
    REPORTING_TAXONOMY: "reportingtaxonomy",
    PROVISION_AGREEMENT: "provisionagreement",
    STRUCTURE_SET: "structureset",
    PROCESS: "process",
    CATEGORISATION: "categorisation",
    CONTENT_CONSTRAINT: "contentconstraint",
    ATTACHMENT_CONSTRAINT: "attachmentconstraint",

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    },
    isSpecificSdmxStructure(structureReferenceDetail) {
        return isDefined(structureReferenceDetail) && STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType(structureReferenceDetail) != null;
    },
    getSdmxStructureTypes: function () {
        return Object.keys(STRUCTURE_REFERENCE_DETAIL).filter((r) => {
            return typeof STRUCTURE_REFERENCE_DETAIL[r] !== 'function' &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.NONE &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.PARENTS &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.PARENTS_SIBLINGS &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.CHILDREN &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.DESCENDANTS &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.ALL;
        });
    },
    getSdmxStructureType: function (structureReferenceDetail) {
        return STRUCTURE_REFERENCE_DETAIL.getSdmxStructureTypes().find(r => {
            return STRUCTURE_REFERENCE_DETAIL[r] === structureReferenceDetail;
        });
    },
    getApplicableReferences: function (structureType) {
        if (structureType === SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORISATION.key ||
            structureType === SDMX_STRUCTURE_TYPE.PROCESS.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.DSD,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.CATEGORY_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.CODE_LIST,
                STRUCTURE_REFERENCE_DETAIL.HIERARCHICAL_CODELIST,
                STRUCTURE_REFERENCE_DETAIL.ORGANISATION_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.AGENCY_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DATA_PROVIDER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DATA_CONSUMER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.ORGANISATION_UNIT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DATAFLOW,
                STRUCTURE_REFERENCE_DETAIL.METADATA_FLOW,
                STRUCTURE_REFERENCE_DETAIL.REPORTING_TAXONOMY,
                STRUCTURE_REFERENCE_DETAIL.PROVISION_AGREEMENT,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ALLOWED_CONTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ACTUAL_CONSTRAINT
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.HIERARCHICAL_CODELIST,
                STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DSD,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CODE_LIST,
                STRUCTURE_REFERENCE_DETAIL.DSD,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key ||
            structureType === SDMX_STRUCTURE_TYPE.ATTACHMENT_CONSTRAINT.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.DATA_PROVIDER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DSD,
                STRUCTURE_REFERENCE_DETAIL.DATAFLOW,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.METADATA_FLOW,
                STRUCTURE_REFERENCE_DETAIL.PROVISION_AGREEMENT
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.DSD,
                STRUCTURE_REFERENCE_DETAIL.PROVISION_AGREEMENT,
                STRUCTURE_REFERENCE_DETAIL.REPORTING_TAXONOMY,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.PROVISION_AGREEMENT,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.DSD.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CODE_LIST,
                STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.DATAFLOW,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.HIERARCHICAL_CODELIST.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CODE_LIST,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.METADATA_FLOW.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.PROVISION_AGREEMENT,
                STRUCTURE_REFERENCE_DETAIL.REPORTING_TAXONOMY,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.MSD.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.CODE_LIST,
                STRUCTURE_REFERENCE_DETAIL.DATA_PROVIDER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DATA_CONSUMER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.AGENCY_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.ORGANISATION_UNIT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.METADATA_FLOW,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.DATA_PROVIDER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DATAFLOW,
                STRUCTURE_REFERENCE_DETAIL.METADATA_FLOW,
                STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT,
                STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.DATAFLOW,
                STRUCTURE_REFERENCE_DETAIL.METADATA_FLOW,
                STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET
            ];
        } else if (structureType === SDMX_STRUCTURE_TYPE.STRUCTURE_SET.key) {
            return [
                STRUCTURE_REFERENCE_DETAIL.CATEGORISATION,
                STRUCTURE_REFERENCE_DETAIL.PROCESS,
                STRUCTURE_REFERENCE_DETAIL.DSD,
                STRUCTURE_REFERENCE_DETAIL.MSD,
                STRUCTURE_REFERENCE_DETAIL.CATEGORY_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DATA_PROVIDER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.DATA_CONSUMER_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.AGENCY_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.ORGANISATION_UNIT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME,
                STRUCTURE_REFERENCE_DETAIL.CODE_LIST,
                STRUCTURE_REFERENCE_DETAIL.REPORTING_TAXONOMY,
                STRUCTURE_REFERENCE_DETAIL.HIERARCHICAL_CODELIST,
                STRUCTURE_REFERENCE_DETAIL.DATAFLOW,
                STRUCTURE_REFERENCE_DETAIL.METADATA_FLOW
            ];
        }
    },
    isApplicableReference: function (structureType, structureReferenceDetail) {
        let applicableReferences = STRUCTURE_REFERENCE_DETAIL.getApplicableReferences(structureType);
        return applicableReferences.some((ref) => {
            return ref === structureReferenceDetail;
        });
    }
};

module.exports.STRUCTURE_REFERENCE_DETAIL = Object.freeze(STRUCTURE_REFERENCE_DETAIL);