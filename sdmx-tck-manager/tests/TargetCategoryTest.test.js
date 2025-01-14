var SdmxXmlParser = require('../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');
const StructuresSemanticChecker = require('../../sdmx-tck-manager/src/checker/StructuresSemanticChecker.js');

const fs = require('fs');
describe('Tests Target Category query workspace validation', function () {
    it('It should assert workspace validation', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/TargetCatParentsandsiblings.xml', 'utf8');
        var test = {testType:"Structure Target Category",preparedRequest:{request:{resource:"categoryscheme",agency:"SDMX",id:"STAT_SUBJECT_MATTER",version:"1.0",detail:"full",references:"parentsandsiblings",item:"DEMO_SOCIAL_STAT"}}}
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            var validation = StructuresSemanticChecker.checkTargetCategory(test.preparedRequest.request,sdmxObjects)
            console.assert(validation.status === 1)
        })
    });
});