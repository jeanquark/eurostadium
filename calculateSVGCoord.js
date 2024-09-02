const fs = require('fs');

const calculateSVGCoord = async () => {
    const country = 'germany'
    const data1 = fs.readFileSync(`./js/countriesSvgMapCoord.json`)
    const coordData = JSON.parse(data1);
    // for (const country in coordData) {
        console.log('country: ', country)
        const data2 = fs.readFileSync(`./teams/${country}.json`)
        const teams = JSON.parse(data2);
        const array = []
    
        const lng_min = coordData[country]['leftLongitude']
        const lng_max = coordData[country]['rightLongitude']
        const lat_min = coordData[country]['bottomLatitude']
        const lat_max = coordData[country]['topLatitude']
        const x_max = coordData[country]['xMax']
        const y_max = coordData[country]['yMax']
        const x_translate = coordData[country]['xTranslate']
        const y_translate = coordData[country]['yTranslate']
    
        for (let i = 0; i < teams.length; i++) {
            let obj = {}
            obj = teams[i]
            obj['venue']['x'] = x_translate + parseFloat((((teams[i]['venue']['lng'] - lng_min) * x_max) / (lng_max - lng_min)).toFixed(1))
            obj['venue']['y'] = y_translate + parseFloat((((lat_max - teams[i]['venue']['lat']) * y_max) / (lat_max - lat_min)).toFixed(1))
            array.push(obj)
        }
    
        // console.log('array: ', array)
    
        fs.writeFile(`./teams/${country}.json`, JSON.stringify(array, null, "\t"), function (err) {
            if (err) throw err;
            console.log('write complete!');
        });
    // }
}

calculateSVGCoord()