
var form = document.getElementById('my-form')

async function handleSubmit(event) {
    event.preventDefault()
    var status = document.getElementById('my-form-status')
    var data = new FormData(event.target)
    console.log('data: ', data)
    // return
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            Accept: 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                status.innerHTML = 'Thanks for your submission!'
                form.reset()
            } else {
                response.json().then((data) => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data['errors'].map((error) => error['message']).join(', ')
                    } else {
                        status.innerHTML = 'Oops! There was a problem submitting your form'
                    }
                })
            }
        })
        .catch((error) => {
            status.innerHTML = 'Oops! There was a problem submitting your form'
        })
}
form.addEventListener('submit', handleSubmit)

let svgObject
let map = './countries/germany.svg'
window.onload = (event) => {
    console.log('page is fully loaded')

    svgObject = document.getElementById('svgObject')
    console.log('svgObject: ', svgObject)
    svgObject.data = `./images/svg/europe-with-russia.svg`
}
const toggleMap = () => {
    console.log('toggleMap')
    if (map == 'countries/germany.svg') {
        map = './europe-with-russia.svg'
    } else {
        map = './countries/germany.svg'
    }
    svgObject.data = `./images/svg/${map}`
}
const displayMap = (map) => {
    svgObject.data = `./images/svg/${map}.svg`
}

let country
svgObject = document.getElementById('svgObject')
svgObject.addEventListener(
    'load',
    async () => {
        const svgObject = document.getElementById('svgObject')
        const svgContent = svgObject.contentDocument

        let flag = 0
        svgContent.addEventListener(
            'mousedown',
            (e) => {
                flag = 0
                console.log('mousedown', flag)
            },
            false
        )
        svgContent.addEventListener(
            'mousemove',
            (e) => {
                flag = 1
                // console.log('mousemove', flag)
            },
            false
        )
        svgContent.addEventListener(
            'mouseup',
            (e) => {
                if (flag == 0) {
                    console.log('click')
                    console.clear()
                    // console.log('e1: ', e)
                    const path = e.target.closest('path')
                    if (path) {
                        country = path.getAttribute('data-country')
                        console.log('country: ', country)
                        if (country) {
                            svgObject.data = `./images/svg/countries/${country}Low.svg`
                            // fetchStadiums(country)
                        }
                    }
                } else if (flag == 1) {
                    console.log('drag')
                }
                // console.log('mouseup')
            },
            false
        )
        // console.log('elemEventHandler: ', elemEventHandler);
        displayCountryTooltip()
        if (country) {
            displayStadiumTooltip(country)
        }
        // return
        // let tooltip = document.getElementById('tooltip')

        // const handleMouseLeave = () => {
        //     console.log('handleMouseLeave')
        //     if (tooltip) {
        //         tooltip.style.display = 'none'
        //     }
        // }

        // tooltip.addEventListener('mouseleave', handleMouseLeave, false)

        svgPanZoom('#svgObject', {
            zoomEnabled: true,
            controlIconsEnabled: false,
            fit: 1,
            center: 1,
            minZoom: 1,
            maxZoom: 8,
            beforePan: function (oldPan, newPan) {
                var stopHorizontal = false,
                    stopVertical = false,
                    gutterWidth = 300,
                    gutterHeight = 300,
                    sizes = this.getSizes(),
                    leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
                    rightLimit = sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom,
                    topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
                    bottomLimit = sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom

                customPan = {}
                customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
                customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))

                return customPan
            },
        })
    },
    false
)

const displayStadiums = async (value) => {
    try {
        const svgObject = document.getElementById('svgObject')
        console.log('svgObject: ', svgObject)
        const svgContent = svgObject.contentDocument
        console.log('svgContent: ', svgContent)
        let stadiumObj = svgContent.getElementById('stadiums')
        console.log('stadiumObj: ', stadiumObj)
        const country = stadiumObj.getAttribute('data-country')
        if (country) {
            // stadiumObj.remove()
            // stadiumObj.removeChild()
            stadiumObj.innerHTML = ''
            // console.log('stadiumObj: ', stadiumObj)
            // const path = e.target.closest('path')

            // return
            // const country = 'germany'
            const data = await fetch(`./teams/${country}.json`)
            let teams = await data.json()
            console.log('teams: ', teams)
            const leagues = [...new Set(teams.map((item) => item['league']['api_football_id']))]
            console.log('leagues: ', leagues)

            switch (value) {
                case 'all':
                    break
                case 'first_league':
                    teams = teams.filter((team) => team['league']['api_football_id'] == leagues[0])
                    break
                case 'second_league':
                    teams = teams.filter((team) => team['league']['api_football_id'] == leagues[1])
                    break
                case 'sm':
                    teams = teams.filter((team) => team['venue']['capacity'] <= 20000)
                    break
                case 'md':
                    teams = teams.filter((team) => team['venue']['capacity'] > 20000 && team['venue']['capacity'] <= 40000)
                    break
                case 'lg':
                    teams = teams.filter((team) => team['venue']['capacity'] > 40000 && team['venue']['capacity'] <= 60000)
                    break
                case 'xl':
                    teams = teams.filter((team) => team['venue']['capacity'] > 60000)
                    break
            }
            console.log('teams: ', teams)
            let newElement
            for (let i = 0; i < teams.length; i++) {
                newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                newElement.setAttribute('cx', teams[i]['venue']['x'])
                newElement.setAttribute('cy', teams[i]['venue']['y'] + 10)
                newElement.setAttribute('r', 5)
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

const calculateSVGCoord = async () => {
    console.log('calcultateSVGCoord')
    const country = 'albania'
    const data = await fetch(`./teams/${country}.json`)
    const teams = await data.json()
    const teamId = 531
    const array = []

    const lng_min = -9.301684
    const lng_max = 4.313022
    const lat_min = 31.733447
    const lat_max = 43.792633
    const x_max = 418.24765
    const y_max = 468.5632

    for (let i = 0; i < teams.length; i++) {
        let obj = {}
        obj['venueId'] = teams[i]['venue']['api_football_id']
        obj['x'] = (((teams[i]['venue']['lng'] - lng_min) * x_max) / (lng_max - lng_min)).toFixed(1)
        obj['y'] = (((lat_max - teams[i]['venue']['lat']) * y_max) / (lat_max - lat_min)).toFixed(1)
        array.push(obj)
    }

    console.log('array: ', array)
}