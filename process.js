const csv = require('csvtojson')
const fs = require('fs')


const csvFilePath = './data/2017_Gaz_zcta_national.txt'

const toLookupJson = (zipcodes) => {
    lookupJson = {};
    zipcodes.forEach(zipcode => {
        lookupJson[zipcode.GEOID] = {
            lon: Number(zipcode.INTPTLONG),
            lat: Number(zipcode.INTPTLAT)
        }
    })
    return lookupJson;
}

csv({
    delimiter: '\t'
})
.fromFile(csvFilePath)
.then((zipcodes) => {
    return toLookupJson(zipcodes)
})
.then(data => {
    fs.writeFile('./data/zipcodeLookups.json', JSON.stringify(data), (err) => {
        if (err) console.error(err);
    })
})


const toGeojson = (zipcodes, writeFilePath) => {
    const lookupZipcodes = require('./data/zipcodeLookups.json');

    const geojson = {
        "type": "FeatureCollection",
        "features": []
    };
  
    zipcodes.forEach(zipcode => {
   
        const foundZipcode = lookupZipcodes[zipcode.zipcode];
    
        if (foundZipcode) {
            const point = {
                type: 'Feature',
                properties: {
                    zipcode: zipcode.zipcode,
                    count: zipcode.count
                },
                geometry: {
                    type: 'Point',
                    coordinates: [foundZipcode.lon, foundZipcode.lat],
                }
            }
            geojson.features.push(point);
        }
    })
    fs.writeFile( writeFilePath, JSON.stringify(geojson), (err) => {
        if (err) console.error(err);
    });
}

const zipcodes = [
    {
        zipcode: '94618',
        count: 15
    },
    {
        zipcode: '94609',
        count: 8
    },
    {
        zipcode: '94610',
        count: 5
    },
    {
        zipcode: '94102',
        count: 5
    },
    {
        zipcode: '94954',
        count: 2
    },
    {
        zipcode: '85205',
        count: 50
    },
    {
        zipcode: '85743',
        count: 55
    },
    {
        zipcode: '85746',
        count: 45
    },
    {
        zipcode: '85634',
        count: 40
    },
    {
        zipcode: '79935',
        count: 100
    },
    {
        zipcode: '79906',
        count: 75
    },
    {
        zipcode: '79930',
        count: 45
    },
    {
        zipcode: '90042',
        count: 20
    },
    {
        zipcode: '90270',
        count: 20
    }, 
    {
        zipcode: '92841',
        count: 15
    },
    {
        zipcode: '92065',
        count: 10
    },
    {
        zipcode: '95111',
        count: 8
    },
    {
        zipcode: '95037',
        count: 5
    },
    {
        zipcode: '95120',
        count: 3
    }

]

const geojson = toGeojson(zipcodes, './data/zipcodes.geojson')

module.exports = {
    toLookupJson,
    toGeojson
}