const fs = require('fs');

const calculateSVGCoord = async () => {
    const country = 'norway'
    const data1 = fs.readFileSync(`./js/countriesSvgMapCoord.json`)
    // console.log('data1: ', data1);
    const coordData = JSON.parse(data1);
    // console.log('coordData: ', coordData)
    // return
    // for (let i = 0; i < coordData.length; i++) {
    for (const country in coordData) {
        // const country = coordData[i]
        console.log('country: ', country)
        // continue;
        const data2 = fs.readFileSync(`./teams/${country}.json`)
        const teams = JSON.parse(data2);
        // console.log('teams: ', teams);
        const array = []
    
        const lng_min = coordData[country]['leftLongitude']
        const lng_max = coordData[country]['rightLongitude']
        const lat_min = coordData[country]['bottomLatitude']
        const lat_max = coordData[country]['topLatitude']
        const x_max = coordData[country]['xMax']
        const y_max = coordData[country]['yMax']
    
        for (let i = 0; i < teams.length; i++) {
            let obj = {}
            obj = teams[i]
            obj['venue']['x'] = parseFloat((((teams[i]['venue']['lng'] - lng_min) * x_max) / (lng_max - lng_min)).toFixed(1))
            obj['venue']['y'] = parseFloat((((lat_max - teams[i]['venue']['lat']) * y_max) / (lat_max - lat_min)).toFixed(1))
            array.push(obj)
        }
    
        // console.log('array: ', array)
    
        fs.writeFile(`./teams/${country}.json`, JSON.stringify(array, null, "\t"), function (err) {
            if (err) throw err;
            console.log('write complete!');
        });
    }
}

calculateSVGCoord()