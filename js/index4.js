window.onload = (event) => {
    try {
        console.log('page is fully loaded!')
        svgObject = document.getElementById('svgObject')
        console.log('svgObject: ', svgObject)
        svgObject.data = `./images/svg/europe-with-russia.svg`
    } catch (error) {
        console.log('error: ', error)
    }
}

let country
svgObject = document.getElementById('svgObject')
svgObject.addEventListener('load', async () => {
    let svgObject = document.getElementById('svgObject')
    const svgContent = svgObject.contentDocument
    // svgContent.addEventListener("touchstart", console.log('touchstart'));
    let flag = 0

    svgContent.addEventListener(
        'touchstart',
        (e) => {
            flag = 0
            console.log('touchstart', flag)
        },
        false
    )
    svgContent.addEventListener(
        'touchmove',
        (e) => {
            flag = 1
            console.log('touchmove', flag)
        },
        false
    )
    svgContent.addEventListener(
        'touchend',
        (e) => {
            if (flag == 0) {
                console.log('click')
                const path = e.target.closest('path')
                country = path.getAttribute('id')
                console.log('country: ', country);
                if (country) {
                    console.log('country2: ', country)
                    document.getElementById('buttonsPanel').classList.remove("hidden")
                    svgObject.data = `./images/svg/countries/${country}.svg`
                    // displayStadiumTooltip(country)
                }
            } else if (flag == 1) {
                console.log('drag')
            }
        },
        false
    )
    console.log('country3: ', country);
    if (country) {
        displayStadiumTooltip(country)
    }

    svgPanZoom('#svgObject', {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: 1,
        center: 1,
        minZoom: 1,
        maxZoom: 8,
        onZoom: (newZoom) => {
            // console.log('onZoom: ', newZoom)
            const stadiumObj = svgContent.getElementById('stadiums')
            if (stadiumObj) {
                // console.log('stadiumObj: ', stadiumObj)
                const circleRadius = stadiumObj.getAttribute('data-circle-radius') || 10
                // console.log('circleRadius: ', circleRadius);
                var cities = stadiumObj.querySelectorAll(".city");
                for (var i = 0; i < cities.length; i++) {
                    // console.log('cities[i]: ', cities[i])
                    const abc = cities[i].getAttribute('r')
                    // console.log('abc: ', abc);
                    cities[i].setAttribute('r', parseInt(circleRadius - newZoom))
                }
            }
        }
    })
})

const displayMap = (map) => {
    document.getElementById('buttonsPanel').classList.add("hidden")
    svgObject.data = `./images/svg/${map}.svg`
}

const displayStadiumTooltip = async (country) => {
    try {
        console.log('displayStadiumTooltip country: ', country)
        const svgObject = document.getElementById('svgObject')
        // console.log('svgObject: ', svgObject)
        const svgContent = svgObject.contentDocument
        // console.log('svgContent: ', svgContent)
        const stadiumObj = svgContent.getElementById('stadiums')
        // console.log('stadiumObj: ', stadiumObj)
        // return

        if (stadiumObj) {
            const circleRadius = stadiumObj.getAttribute('data-circle-radius')
            console.log('circleRadius: ', circleRadius);
            const data = await fetch(`./teams/${country}.json`)
            const teams = await data.json()
            console.log('teams: ', teams)
            let newElement
            const leagues = [...new Set(teams.map((item) => item['league']['api_football_id']))]
            console.log('leagues: ', leagues)
            for (let i = 0; i < teams.length; i++) {
                newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                newElement.setAttribute('cx', teams[i]['venue']['x'])
                newElement.setAttribute('cy', teams[i]['venue']['y'] + 0)
                newElement.setAttribute('r', circleRadius | 5)
                newElement.setAttribute('fill', teams[i]['league']['api_football_id'] == leagues[0] ? '#FF0000' : '#FFFF00')
                newElement.setAttribute('data-city', teams[i]['venue']['city'])
                newElement.setAttribute('data-stadium-id', teams[i]['venue']['api_football_id'])
                newElement.setAttribute('class', 'city')
                stadiumObj.appendChild(newElement)
            }
        }
    } catch (error) {
        console.log('error: ', error)
    }
}

const hasSmallScreen = () => {
    const minWidth = 1024; // Minimum width for desktop devices
    return window.innerWidth < minWidth || screen.width < minWidth;
}
const hasTouchSupport = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
if (hasTouchSupport() && hasSmallScreen()) {
    console.log('Mobile device detected')
} else {
    console.log('Desktop device detected')
}