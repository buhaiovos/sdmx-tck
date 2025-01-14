var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;

var SemanticError = require('sdmx-tck-api').errors.SemanticError;
var TckError = require('sdmx-tck-api').errors.TckError;

const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const STRUCTURE_QUERY_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_QUERY_DETAIL;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

var SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;
var StructureReference = require('sdmx-tck-api').model.StructureReference;

var Utils = require('sdmx-tck-api').utils.Utils;

const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;

class StructuresSemanticChecker {
    static checkWorkspace(test, preparedRequest, workspace) {
        return new Promise((resolve, reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS) {
                    validation = StructuresSemanticChecker.checkIdentification(query, workspace)
                } else if (test.testType === TEST_TYPE.STRUCTURE_REFERENCE_PARAMETER) {
                    validation = StructuresSemanticChecker.checkReferences(query, workspace);
                } else if (test.testType === TEST_TYPE.STRUCTURE_DETAIL_PARAMETER) {
                    validation = StructuresSemanticChecker.checkDetails(query, workspace);
                } else if(test.testType === TEST_TYPE.STRUCTURE_TARGET_CATEGORY){
                    validation = StructuresSemanticChecker.checkTargetCategory(query, workspace);
                }
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    };

    static checkTargetCategory(query,sdmxObjects) {
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }

        let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(query.resource);
        let agency = query.agency;
        let id = query.id;
        let version = query.version && query.version === 'latest' ? null : query.version;

        let reqItemValidation = StructuresSemanticChecker.exactlyOneArtefactWithCorrectNumOfItems(sdmxObjects, structureType, agency, id, version, query.item);
        if(reqItemValidation.status === 0){
            return { status: FAILURE_CODE, error: "Requested item not found in requested artefact "+structureType};
        }

        let targetCategoryValidation = StructuresSemanticChecker._checkCategorisationIds(sdmxObjects,query.item)
        if(targetCategoryValidation.status === 0){
            return { status: FAILURE_CODE, error: "Requested item not found in categorisation artefact."};
        }
       return StructuresSemanticChecker.checkReferences(query,sdmxObjects)
        
    }
    static checkIdentification(query, sdmxObjects) {
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }

        let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(query.resource);
        let agency = query.agency;
        let id = query.id;
        // WORKAROUND - Until a better solution is found.
        // Because the version is extracted from the request it can contain values such as 'latest', 'all'. 
        // In case of 'latest' we check if the workspace contains exactly one structure 
        // but the problem here is that the version of the returned structure is not known beforehand 
        // and the workspace cannot be filtered using the 'latest' for the structure version.
        let version = query.version && query.version === 'latest' ? null : query.version;

        if (!Utils.isSpecificAgency(query) && !Utils.isSpecificId(query) && !Utils.isSpecificVersion(query)) {
            return { status: SUCCESS_CODE };
        }
        else if (Utils.isSpecificAgency(query) && Utils.isSpecificId(query) && Utils.isSpecificVersion(query) && !Utils.isSpecificItem(query)) {
            return StructuresSemanticChecker.exactlyOneArtefact(sdmxObjects, structureType, agency, id, version);
        }
        else if (Utils.isSpecificAgency(query) && Utils.isSpecificId(query) && Utils.isSpecificVersion(query) && Utils.isSpecificItem(query)) {
            return StructuresSemanticChecker.exactlyOneArtefactWithCorrectNumOfItems(sdmxObjects, structureType, agency, id, version, query.item)
        }
        else if (!Utils.isSpecificAgency(query) && Utils.isSpecificId(query) && Utils.isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, undefined, id, version);
        }
        else if (Utils.isSpecificAgency(query) && !Utils.isSpecificId(query) && Utils.isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, agency, undefined, version);
        }
        else if (Utils.isSpecificAgency(query) && Utils.isSpecificId(query) && !Utils.isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, agency, id, undefined);
        }
        else if (Utils.isSpecificAgency(query) && !Utils.isSpecificId(query) && !Utils.isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, agency, undefined, undefined);
        }
    };

    static checkReferences(query, sdmxObjects) {

        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
       
        var itemArray;
        if(query.item!=="all"){
            itemArray = query.item.split('+');
        }
        let structureRef = new StructureReference(SDMX_STRUCTURE_TYPE.fromRestResource(query.resource), query.agency, query.id, query.version,itemArray);
        let result;
        // get the requested structure from workspace
        let structureObject = sdmxObjects.getSdmxObject(structureRef);
        if (!Utils.isDefined(structureObject)) {
            throw new Error("Structure " + structureRef + " not found in workspace.");
        }
        if (query.references === STRUCTURE_REFERENCE_DETAIL.NONE) {
            result = [];
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.PARENTS) {
            result = StructuresSemanticChecker._getParents(sdmxObjects, structureObject, structureRef);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.PARENTS_SIBLINGS) {
            result = StructuresSemanticChecker._getParentsSiblings(sdmxObjects, structureObject, structureRef);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.CHILDREN) {
            result = StructuresSemanticChecker._getChildren(sdmxObjects, structureObject);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.DESCENDANTS) {
            result = StructuresSemanticChecker._getDescendants(sdmxObjects, structureObject);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.ALL) {
            result = StructuresSemanticChecker._getAll(sdmxObjects, structureObject, structureRef);
        } else if (STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references)) {
            result = StructuresSemanticChecker._getParentsChildren(sdmxObjects, structureObject, structureRef);
        } else {
            throw new Error("Not supported structure reference detail '" + query.references + "'");
        }
        // ADDITIONAL CHECKS //
        // 1. Check if all references are found in workspace and return missing structures if such exist.
        let missingStructures = [];

        result.forEach((r) => {
            if (r.isReferenced === false && !STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references)) {
                missingStructures.push(r.ref);
            } else if (STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references) &&
                r.ref.getStructureType() === STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType(query.references) && r.isReferenced === false) {
                missingStructures.push(r.ref)
            }
        });
        if (missingStructures.length > 0) {
            return { status: FAILURE_CODE, error: "Not all structures found in workspace: " + JSON.stringify(missingStructures) };
        }

        // 2. Check if the workspace contains non-referenced structures.
        let extraStructures = [];
        sdmxObjects.getSdmxObjectsList().forEach((structure) => {
            // Check if the workspace object is referenced by the requested structure.
            let isReference = result.some(r => {
                return r.ref.equals(structure.asReference())
            });
            
            if (!structureRef.equals(structure.asReference()) && !isReference) {
                // Exclude Agency Scheme from this check because it can be considered as valid referenced artefact.
                if (structure.getStructureType() !== SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key) {
                    extraStructures.push(structure.asReference());
                }
            } else if (!structureRef.equals(structure.asReference()) && isReference) {
                if (STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references) &&
                    structure.getStructureType() !== STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType(query.references)) {
                    extraStructures.push(structure.asReference());
                }
            }
        });
        if (extraStructures.length > 0) {
            return { status: FAILURE_CODE, error: "Non-referenced structures found in workspace: " + JSON.stringify(extraStructures) };
        }
        // 3. 
        return { status: SUCCESS_CODE }
    };

    static checkDetails(query, sdmxObjects) {
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }

        let errors = [];
        if (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCED_STUBS ||
            query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_COMPLETE_STUBS ||
            query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL ){

            let structureRef = new StructureReference(SDMX_STRUCTURE_TYPE.fromRestResource(query.resource), query.agency, query.id, query.version);

            let structureObject = sdmxObjects.getSdmxObject(structureRef);
            structureObject.getChildren().forEach((childRef) => {
                var childObject = sdmxObjects.getSdmxObject(childRef)
                if (!Utils.isDefined(childObject)
                || (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCED_STUBS && childObject.isStub() === false)
                || (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_COMPLETE_STUBS && childObject.isCompleteStub() === false)
                || (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL &&
                    (structureObject.getStructureType() === SDMX_STRUCTURE_TYPE.DSD.key || structureObject.getStructureType() === SDMX_STRUCTURE_TYPE.MSD.key) &&
                    childObject.getStructureType() === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key && !StructuresSemanticChecker._checkIfPartial(childRef, childObject))) {
                    errors.push(childRef);
                }
            });
        } else {
            sdmxObjects.getSdmxObjects().forEach((structuresList) => {
                if (Utils.isDefined(structuresList) && structuresList instanceof Array) {
                    structuresList.forEach((structure) => {
                        if ((query.detail === STRUCTURE_QUERY_DETAIL.FULL && structure.isFull() === false) ||
                            (query.detail === STRUCTURE_QUERY_DETAIL.ALL_STUBS && structure.isStub() === false) ||
                            (query.detail === STRUCTURE_QUERY_DETAIL.ALL_COMPLETE_STUBS && structure.isCompleteStub() === false)) {
                            errors.push(structure.asReference()); // use this array to gather information about the structures that didn't pass this check.
                        }
                    });
                }
            });
        }
        if (errors.length === 0) {
            return { status: SUCCESS_CODE };
        }
        return { status: FAILURE_CODE, error: "The following structures didn't pass the check: " + JSON.stringify(errors) };
    };
    //Special workspace validation function for target category queries
    static _checkCategorisationIds(sdmxObjects,item){
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        let matchingStructures = sdmxObjects.getSdmxObjectsWithCriteria(SDMX_STRUCTURE_TYPE.fromRestResource("categorisation"));
        var identifialbleIdsToCheck = [];
        for(var i=0;i<matchingStructures.length;i++){
            for(var j=0;j<matchingStructures[i].getChildren().length;j++){
                identifialbleIdsToCheck=identifialbleIdsToCheck.concat(matchingStructures[i].getChildren()[j].identifiableIds)
            }
        }
        var index = identifialbleIdsToCheck.indexOf(item);
        var indexesArr = [];
       
        while (index != -1) {
            indexesArr.push(index);
            index = identifialbleIdsToCheck.indexOf(item, index + 1);
        }
        if(matchingStructures.length === indexesArr.length){
            return{status:SUCCESS_CODE};
        }
        
        return{status:FAILURE_CODE};

    }

    static _checkIfPartial(structureRef, itemSchemeObject) {
        let items = itemSchemeObject.getItems();
        let identifiableIds = structureRef.getIdentifiableIds();
        
        if (items.length === 0 && identifiableIds.length === 0) {
            return true;
        } else if (items.length === 0 && identifiableIds.length !== 0) {
            return false;
        } else if (items.length !== 0 && identifiableIds.length === 0) {
            return false;
        }
        for (let i in items) {
            if (!identifiableIds.includes(items[i].id)) {
                return false;
            }
        }
        return true;
    };

    static _getChildren(sdmxObjects, structureObject) {
        let result = [];
        if (!structureObject.isFull()) {
            throw new Error("Children cannot be checked for SDMX structure " + structureObject.asReference() + ". Only stub returned.");
        }
        // check if all children of the requested artefact exist in workspace.
        structureObject.getChildren().forEach((childRef) => {
            result.push({ ref: childRef, isReferenced: sdmxObjects.exists(childRef) });
        });
        return result;
    };

    /**
     * Checks if the requested structure and all of its descendants exist in workspace.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureRef the structure reference
     */
    static _getDescendants(sdmxObjects, structureObject) {
        let result = [];
        StructuresSemanticChecker._getDescendantsInternal(sdmxObjects, structureObject, result);
        return result;
    };

    static _getDescendantsInternal(sdmxObjects, structureObject, result) {
        if (!structureObject.isFull()) {
            throw new Error("Descendants cannot be checked for SDMX structure " + structureObject.asReference() + ". Only stub returned.");
        }
        structureObject.getChildren().forEach((childRef) => {
            let childObject = sdmxObjects.getSdmxObject(childRef);
            let childObjectFound = Utils.isDefined(childObject);
            result.push({ ref: childRef, isReferenced: childObjectFound });

            if (childObjectFound) {
                StructuresSemanticChecker._getDescendantsInternal(sdmxObjects, childObject, result);
            }
        });
    };

    /**
     * Returns an array containing the parents of the requested structure.
     * @param {*} sdmxObjects 
     * @param {*} structureObject 
     */
    static _getParents(sdmxObjects, structureObject,structureRef) {
        //console.log(structureObject.asReference())
        let result = [];
        sdmxObjects.getSdmxObjects().forEach((structuresList) => {
            if (Utils.isDefined(structuresList) && structuresList instanceof Array) {
                structuresList.forEach((structure) => {
                    if (!structureObject.asReference().equals(structure.asReference())) {
                        if (!structure.isFull()) {
                            throw new Error("Parents cannot be checked for SDMX structure " + structureObject.asReference() + ". Only stub returned for structure " + structure.asReference());
                        }
                        // check if the requested structure is child of the current structure.
                        if (structure.getChildren().some((element) => {
                            return structureRef.exists(element);
                        }
                        )) {
                            result.push({ ref: structure.asReference(), isReferenced: true });
                        }
                    }
                });
            }
        });
        return result;
    };

    /**
     * Returns an array containing parents and siblings of the requested structure and an indication whether they are found in workspace or not.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureObject the requested structure
     */
    static _getParentsSiblings(sdmxObjects, structureObject,structureRef) {
        let result = [];
        let parents = StructuresSemanticChecker._getParents(sdmxObjects, structureObject,structureRef);
        if (parents) result = result.concat(parents);
        parents.forEach((parent) => {
            let parentObject = sdmxObjects.getSdmxObject(parent.ref);
            if (!Utils.isDefined(parentObject)) {
                throw new Error("Structure " + parent.ref + " not found in workspace.");
            }
            parentObject.getChildren().forEach((childRef) => {
                result.push({ ref: childRef, isReferenced: sdmxObjects.exists(childRef) });
            });
        });
        return result;
    };

    /**
     * Returns an array containing parents and children of the requested structure and an indication whether they are found in workspace or not.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureObject the requested structure
     */
    static _getParentsChildren(sdmxObjects, structureObject, structureRef) {
        let result = [];

        let parents = StructuresSemanticChecker._getParents(sdmxObjects, structureObject, structureRef);
        if (parents) result = result.concat(parents);

        let children = StructuresSemanticChecker._getChildren(sdmxObjects, structureObject);
        if (children) result = result.concat(children);

        return result;
    };

    /**
     * Returns an array containing all artefacts that are referenced by the requested artefact and an indication whether they are found in workspace or not.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureObject the requested structure
     */
    static _getAll(sdmxObjects, structureObject, structureRef) {
        let result = [];

        let descendants = StructuresSemanticChecker._getDescendants(sdmxObjects, structureObject);
        if (descendants) result = result.concat(descendants);

        let parentsSiblings = StructuresSemanticChecker._getParentsSiblings(sdmxObjects, structureObject, structureRef);
        if (parentsSiblings) result = result.concat(parentsSiblings);

        return result;
    };

    //============================================================================================//

    static exactlyOneArtefact(sdmxObjects, structureType, agencyId, id, version) {
        if (!sdmxObjects) {
            throw new Error("Error in response validation. No workspace provided");
        }
        let matchingStructures = sdmxObjects.getSdmxObjectsWithCriteria(structureType, agencyId, id, version);
        return { status: (matchingStructures.length === 1) ? SUCCESS_CODE : FAILURE_CODE };
    };

    static exactlyOneArtefactWithCorrectNumOfItems(sdmxObjects, structureType, agencyId, id, version, item) {
        if (!sdmxObjects) {
            throw new Error("Error in response validation. No workspace provided");
        }

        let matchingStructures = sdmxObjects.getSdmxObjectsWithCriteria(structureType, agencyId, id, version);
        if (matchingStructures.length > 1) {
            return { status: FAILURE_CODE, error: "More artefacts than requested." };
        }
        let items = matchingStructures[0].getItems();

        var countItemsFromResponse = items.length;
        var countItemsTestRequest = item.split("+").length;

        var itemsStr = "";
        for (let i = 0; i < items.length; i++) {
            if (i + 1 === items.length) {
                itemsStr = itemsStr.concat(items[i].id)
            } else {
                itemsStr = itemsStr.concat(items[i].id + "+")
            }
        }
        return { status: (matchingStructures.length === 1 && countItemsFromResponse === countItemsTestRequest && itemsStr === item) ? SUCCESS_CODE : FAILURE_CODE };
    };

    static atLeastOneArtefact(sdmxObjects, structureType, agencyId, id, version) {
        if (!sdmxObjects) {
            throw new Error("Error in response validation. No workspace provided");
        }
        let matchingStructures = sdmxObjects.getSdmxObjectsWithCriteria(structureType, agencyId, id, version);
        return { status: (matchingStructures.length >= 1) ? SUCCESS_CODE : FAILURE_CODE };
    }
};

module.exports = StructuresSemanticChecker;