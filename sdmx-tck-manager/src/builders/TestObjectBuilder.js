const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;


class TestObjectBuilder{

    //Gets test parameters and returns the test object
    static getTestObject(testParams){

        let testObj = {
            testId: (testParams.hasOwnProperty("testId")) ? testParams.testId : "",
            index: (testParams.hasOwnProperty("index")) ? testParams.index : "",
            run: false,
            apiVersion: (testParams.hasOwnProperty("apiVersion")) ? testParams.apiVersion : "",
            resource: (testParams.hasOwnProperty("resource")) ? testParams.resource : "",
            //requireRandomSdmxObject: true,
            reqTemplate: (testParams.hasOwnProperty("reqTemplate")) ? testParams.reqTemplate : {},
            identifiers: (testParams.hasOwnProperty("identifiers")) ? testParams.identifiers : { structureType: "", agency: "", id: "", version: "" },
            state: TEST_STATE.WAITING,
            failReason: "",
            testType: (testParams.hasOwnProperty("testType")) ? testParams.testType : "",
            subTests: (testParams.hasOwnProperty("subTests")) ? testParams.subTests : []
        }
        if(testParams.hasOwnProperty('needsItem') && testParams.needsItem === true){
            testObj.items = [];
            testObj.requireItems = true;
        }
        if(testParams.hasOwnProperty('requireRandomSdmxObject') && testParams.requireRandomSdmxObject === true){
            testObj.requireRandomSdmxObject = true;
        }
        if(testParams.hasOwnProperty('requireRandomKey') && testParams.requireRandomKey === true){
            testObj.requireRandomKey = true;
        }
        if(testParams.hasOwnProperty('randomKey') && testParams.randomKey){
            testObj.randomKey = testParams.randomKey;
        }

        return testObj;
    }
}

module.exports = TestObjectBuilder;