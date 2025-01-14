var express = require('express');
const app = express();

var TestObjectBuilder = require('./src/builders/TestObjectBuilder.js');
var TestsModelBuilder = require('./src/builders/TestsModelBuilder.js');
var TestExecutionManagerFactory = require('./src/manager/TestExecutionManagerFactory.js')
var HelperManager = require('./src/manager/HelperManager.js')
var TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
const MetadataReferences = require('sdmx-rest').metadata.MetadataReferences
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var XSDTestsDataBuilder = require('./src/builders/schema-queries-builders/XSDTestsDataBuilder.js')
var DataQueriesDataBuilder = require('./src/builders/data-queries-builders/DataQueriesDataBuilder.js')
var SdmxReporter = require('sdmx-tck-reporter').reporter.SdmxReporter
var TestInfo = require('../sdmx-tck-reporter/src/TestInfo.js')
var Report = require('../sdmx-tck-reporter/src/Report.js')
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;

const server = app.listen(5000, () => {
    console.log("Server is listening on port: 5000");
});

var configuredTimeout = 120 * 60 * 1000; // 2 hours

server.setTimeout(configuredTimeout);

app.use(express.json({ limit: '50mb' }))

app.post("/tck-api/prepare-tests", (req, res) => {
    let payload = req.body;
    
    let apiVersion = payload.apiVersion;
    let testIndices = payload.testIndices;
    let requestMode = payload.requestMode;

    let tests = TestsModelBuilder.createTestsModel(apiVersion, testIndices, requestMode);
    res.send(JSON.stringify(tests));
});

app.post("/tck-api/configure-schema-tests", async(req, res) => {

    let configData = {constraintData:undefined,
                      randomData:{
                          datastructure:undefined,
                          dataflow:undefined,
                          provisionagreement:undefined}
                        }
    let payload = req.body;
    let endpoint = payload.endpoint;
    let apiVersion = payload.apiVersion;
    
    //PREPARE SCHEMA TESTS THAT RELY ON DSDs,DFs,PRAs FOUND AS CONTRAINT CONSTRAINABLES
    configData.constraintData =  await XSDTestsDataBuilder.buildXSDDataFromConstraint(endpoint,apiVersion)
    
    //PREPARE SCHEMA TESTS THAT RELY ON RANDOM DSDs,DFs,PRAs

    //DSD DATA
    configData.randomData.datastructure =  await XSDTestsDataBuilder.buildXSDDataWithoutConstraint(STRUCTURES_REST_RESOURCE.datastructure,endpoint,apiVersion)

    //DF DATA
    configData.randomData.dataflow =  await XSDTestsDataBuilder.buildXSDDataWithoutConstraint(STRUCTURES_REST_RESOURCE.dataflow,endpoint,apiVersion)

    //PRA DATA
    configData.randomData.provisionagreement =  await XSDTestsDataBuilder.buildXSDDataWithoutConstraint(STRUCTURES_REST_RESOURCE.provisionagreement,endpoint,apiVersion)

    res.send(JSON.stringify(configData))
});

app.post("/tck-api/configure-data-tests", async(req, res) => {

    let payload = req.body;
    let endpoint = payload.endpoint;
    let apiVersion = payload.apiVersion;
    
    let configData =  await DataQueriesDataBuilder.buildDataQueriesData(endpoint,apiVersion)
    res.send(JSON.stringify(configData))
});

app.post("/tck-api/execute-test", (req, res) => {
        let payload = req.body;
        let test = payload.test;
        let apiVersion = test.apiVersion;
        //let apiVersion = payload.apiVersion;
        let endpoint = payload.endpoint;

        TestExecutionManagerFactory.getTestsManager(test.index).executeTest(test, apiVersion, endpoint).then(
            (result) => { 
                console.log("Test: " + test.testId + " completed.");
                res.send(JSON.stringify(result)) 
            },
            (error) => { 
                console.log("Test: " + test.testId + " failed. Cause: " + error);
                res.send(error) 
            });
});

app.post("/tck-api/export-report", async (req, res) => {
    try{
        let payload = req.body;
        let tests = payload.tests;
        let swVersion  = payload.swVersion;
        let apiVersion = payload.apiVersion;
        let wsInfo = payload.wsInfo;
        let format =  payload.format;
        let scores = payload.scores;

        let contenType ="";
        let filename = ""

        if(EXPORT_FORMATS.XML === format){
            filename = "SDMX-TCK-Report.xml"
            contenType = 'application/xml'
        }else if(EXPORT_FORMATS.EXCEL === format){
            filename = "SDMX-TCK-Report.xlsx"
            contenType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }else if(EXPORT_FORMATS.JSON === format){
            filename = "SDMX-TCK-Report.json"
            contenType = 'application/json'
        }
        res.set('Content-Disposition', 'attachment; filename='+filename);
        res.set('Content-Type', contenType);

        
        //Init Reporter
        SdmxReporter.init(wsInfo,apiVersion,swVersion,scores)
        
        //Record tests
        tests.forEach(t => SdmxReporter.record(TestInfo.fromJSON(t)));
        
        //Write buffer to res
        res.write(await SdmxReporter.publishReport(format))
        res.end()
    }catch(error){
        res.status(500).send(error);
    }
 
});