const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var TestObjectBuilder = require("../TestObjectBuilder.js");
var STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS = require('../../constants/TestConstants.js').STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS;

class StructureFurtherDescribingResultsParamTestsBuilder{

    static getFurtherDescribingResultsParamTests(index,x,apiVersion,currentRestResource,requestMode){
        let furtherDescribingResultsParamTests = []
        let testObjParams = {};
                
                //Exclude organisationscheme, actualconstraint, allowedconstraint, structure resources from detail tests.
                if (currentRestResource !== STRUCTURES_REST_RESOURCE.organisationscheme &&
                    currentRestResource !== STRUCTURES_REST_RESOURCE.allowedconstraint &&
                    currentRestResource !== STRUCTURES_REST_RESOURCE.actualconstraint &&
                    currentRestResource !== STRUCTURES_REST_RESOURCE.structure) {

                        let furtherDescribingTests = STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion,currentRestResource,requestMode);
                        for (let i in furtherDescribingTests) {
                            let test = furtherDescribingTests[i];
                            
                            testObjParams = {}
                            
                            //Reference Partial Testing is only for content constraint resource
                            if(test.url === "Reference Partial Test for Content Constraint"){
                                if(currentRestResource === STRUCTURES_REST_RESOURCE.contentconstraint){
                                    x.numOfTests = x.numOfTests + 1;
                                    testObjParams = {
                                        testId: test.url,
                                        index: index,
                                        apiVersion: apiVersion,
                                        resource: currentRestResource,
                                        reqTemplate: test.reqTemplate,
                                        requireRandomSdmxObject : true,
                                        testType: TEST_TYPE.STRUCTURE_REFERENCE_PARTIAL
                                    }

                                    furtherDescribingResultsParamTests.push(TestObjectBuilder.getTestObject(testObjParams))
                                }
                            }else{
                                x.numOfTests = x.numOfTests + 1;
                                testObjParams = {
                                    testId: "/" + currentRestResource + test.url,
                                    index: index,
                                    apiVersion: apiVersion,
                                    resource: currentRestResource,
                                    reqTemplate: test.reqTemplate,
                                    requireRandomSdmxObject : true,
                                    testType: TEST_TYPE.STRUCTURE_DETAIL_PARAMETER
                                }
                                furtherDescribingResultsParamTests.push(TestObjectBuilder.getTestObject(testObjParams))
                            }
                            
                        };

                    }
        return furtherDescribingResultsParamTests;
    }
}

module.exports = StructureFurtherDescribingResultsParamTestsBuilder;