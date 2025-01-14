const DataKeySetObject = require('sdmx-tck-api/src/model/structure-queries-models/DataKeySetObject');
var SdmxV21DatasetComponentsAttributesParser = require('./SdmxV21DatasetComponentsAttributesParser.js')
var SdmxV21DataGroup = require('./SdmxV21DataGroup.js')
var SeriesObject = require('sdmx-tck-api').model.SeriesObject;
var GroupObject = require('sdmx-tck-api').model.GroupObject;
var ObservationObject = require('sdmx-tck-api').model.ObservationObject;
var DatasetObject = require('sdmx-tck-api').model.DatasetObject;

class SdmxV21DatasetParser {
    static getDataset(dataset){
        let datasetId;
        let attributes = {};
        let seriesArray = [];
        let groupsArray = [];
        let obsArray = [];
        if(dataset.$){
            datasetId = dataset.$[Object.keys(dataset.$).find(key=>key.indexOf("structureRef")!==-1)]
            for (const [key, value] of Object.entries(dataset.$)) {
                if(key.indexOf("structureRef")===-1){
                    attributes[key]=value;
                 }
             }
        }

        if(dataset.Series){
            let series = dataset.Series;
            for (let s in series){
                seriesArray.push(new SeriesObject (
                    SdmxV21DatasetComponentsAttributesParser.getComponentAttributes(series[s]),
                    SdmxV21DatasetComponentsAttributesParser.getNestedObservationsAttributes(series[s]))
                    );
            }
        }
        if(dataset.Group){
            let groups = dataset.Group;
            for(let g in groups){
                groupsArray.push(new GroupObject (
                    SdmxV21DataGroup.getGroupId(groups[g]),
                    SdmxV21DataGroup.getGroupComponents(groups[g]))
                    );
            }
        }

        if(dataset.Obs){
            let obs = dataset.Obs;
            for(let o in obs){
                obsArray.push(new ObservationObject (
                    SdmxV21DatasetComponentsAttributesParser.getComponentAttributes(obs[o]))
                    );
            }
        }

        return new DatasetObject(datasetId,attributes,seriesArray,groupsArray,obsArray)
    }
   
}

module.exports = SdmxV21DatasetParser;