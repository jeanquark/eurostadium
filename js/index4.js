window.onload = (event) => {
    try {
        // console.log('page is fully loaded!')
        svgObject = document.getElementById('svgObject')
        // console.log('svgObject: ', svgObject)
        if (svgObject) {
            // svgObject.data = `./images/svg/europe-with-russia.svg`
            svgObject.setAttribute('data', './images/svg/europe-with-russia.svg')
        }
    } catch (error) {
        console.log('error: ', error)
    }
}

let country
let countryTeams = []
let svgObject = document.getElementById('svgObject')
svgObject.addEventListener('load', async () => {
    let svgObject = document.getElementById('svgObject')
    const svgContent = svgObject.contentDocument

    if (hasTouchSupport() && hasSmallScreen()) {
        console.log('Mobile device detected')
        eventListenerMobile()
    } else {
        console.log('Desktop device detected')
        eventListenerDesktop()
        displayCountryTooltip()
    }

    console.log('country3: ', country);
    if (country) {
        displayStadiums(country)
    }

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
        onZoom: (newZoom) => {
            console.log('onZoom: ', newZoom)
            const stadiumObj = svgContent.getElementById('stadiums')
            if (stadiumObj) {
                // console.log('stadiumObj: ', stadiumObj)
                const circleRadius = stadiumObj.getAttribute('data-circle-radius')
                // console.log('circleRadius: ', circleRadius);
                var cities = stadiumObj.querySelectorAll(".city");
                for (var i = 0; i < cities.length; i++) {
                    // console.log('cities[i]: ', cities[i])
                    const abc = cities[i].getAttribute('r')
                    // console.log('abc: ', abc);
                    cities[i].setAttribute('r', parseInt(circleRadius - (newZoom * 2)))
                }
            }
        }
    })
})

const eventListenerDesktop = () => {
    // console.log('eventListenerDesktop')
    let svgObject = document.getElementById('svgObject')
    const svgContent = svgObject.contentDocument
    let flag = 0

    svgContent.addEventListener(
        'mousedown',
        (e) => {
            flag = 0
            // console.log('mousedown', flag)
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
                // console.log('click')
                const path = e.target.closest('path')
                if (path) {
                    country = path.getAttribute('id')
                    if (country) {
                        document.getElementById('buttonsPanel').classList.remove("hidden")
                        svgObject.data = `./images/svg/countries/${country}.svg`
                        const tooltip = document.getElementById('tooltip')
                        if (tooltip) {
                            tooltip.style.display = 'none'
                        }
                    }
                } else {
                    displayMap('europe-with-russia')
                }
            } else if (flag == 1) {
                console.log('drag')
            }
        },
        false
    )
}

const eventListenerMobile = () => {
    let svgObject = document.getElementById('svgObject')
    const svgContent = svgObject.contentDocument
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
                // console.log('country: ', country);
                if (country) {
                    // console.log('country2: ', country)
                    document.getElementById('buttonsPanel').classList.remove("hidden")
                    svgObject.data = `./images/svg/countries/${country}.svg`
                }
            } else if (flag == 1) {
                console.log('drag')
            }
        },
        false
    )
}

const displayMap = (map) => {
    document.getElementById('buttonsPanel').classList.add("hidden")
    svgObject.data = `./images/svg/${map}.svg`
}

const displayCountryTooltip = () => {
    try {
        svgObject = document.getElementById('svgObject')
        const svgContent = svgObject.contentDocument
        let elements = svgContent.getElementsByClassName('country')
        // const tooltip = document.getElementById('tooltip')

        const handleMouseOverCountry = (e) => {
            // console.log('handleMouseOver')
            const innerWidth = window.innerWidth
            const innerHeight = window.innerHeight
            const pageX = e.pageX
            const pageY = e.pageY
            const scrollTop = document.documentElement.scrollTop
            const clientX = e.clientX
            const clientY = e.clientY
            console.clear()
            // console.log('e: ', e)
            // console.log('innerWidth: ', innerWidth);
            // console.log('innerHeight: ', innerHeight);
            const SvgWidth = document.getElementById('svgWrapper').offsetWidth
            // console.log('innerHeight: ', innerHeight);
            // console.log('scrollTop: ', scrollTop);
            // console.log('pageX: ', pageX);
            // console.log('pageY: ', pageY);
            // const rect = e.target.getBoundingClientRect()
            // console.log('rect: ', rect);
            // const width = rect.left + rect.right
            // console.log('clientX: ', clientX);
            // console.log('clientY: ', clientY)
            // console.log('pageY: ', pageY);
            const offsetLeft = document.getElementById('svgWrapper').offsetLeft
            const offsetWidth = document.getElementById('svgWrapper').offsetWidth
            const offsetHeight = document.getElementById('svgWrapper').offsetHeight
            const offsetTop = document.getElementById('svgWrapper').offsetTop
            // console.log('offsetHeight: ', offsetHeight)
            // console.log('offsetLeft: ', offsetLeft);
            // console.log('offsetWidth: ', offsetWidth);
            // console.log('offsetTop: ', offsetTop);

            let countryId
            let countryName
            let leagues = ""
            let leaguesId = ""
            let leaguesArray = []
            let leaguesIdArray = []
            let population

            countryId = e.target.id
            if (!countryId) {
                countryId = e.target.parentNode.id
            }
            const element = svgContent.getElementById(countryId)
            // console.log('element: ', element);
            // const tooltipRect2 = tooltip.getBoundingClientRect()
            // console.log('tooltipRect2: ', tooltipRect2);
            element.classList.add('hover')

            countryName = e.target.getAttribute('data-country')
            if (!countryName) {
                countryName = e.target.parentNode.getAttribute('data-country')
            }

            leagues = e.target.getAttribute('data-leagues')
            if (!leagues) {
                leagues = e.target.parentNode.getAttribute('data-leagues')
            }
            if (leagues) {
                leaguesArray = leagues.split(',')
            }

            leaguesId = e.target.getAttribute('data-leagues-id')
            // console.log('leaguesId: ', leaguesId);
            if (leaguesId) {
                leaguesIdArray = leaguesId.split(',')
            }

            population = e.target.getAttribute('data-pop')

            const tooltip = document.getElementById('tooltip')
            // console.log('tooltip: ', tooltip)
            if (tooltip) {
                tooltip.innerHTML = `
                <div class="row">
                    <div class="col-2" style="display: flex;
                    align-items: center;">
                        <img src="../images/flags/${countryId}.png" width="60" />
                    </div>
                    <div class="col-4" style="display: flex; justify-content: center;
                    align-items: center;">
                        <div style="display: flex-column;">
                            <h2 class="text-center">${countryName}</h2>
                            <h4 class="text-center">Pop: ${population}</h4>
                        </div>
                    </div>
                    <div class="col-6">
                        <img src="../images/countries/${countryId}.jpg" width="100%" />
                    </div>
                </div>

                <div class="row align-center mt-4">
                    <div class="col-6">
                        <img src="../images/countries/switzerland_stadium.jpg" width="100%" />
                    </div>
                    <div class="col-6">
                        <div class="row justify-center">
                            <div class="col-6 text-center">
                                <h3>${leaguesArray[0]}</h3>
                                <img src="/images/leagues/${countryId}/${leaguesIdArray[0]}.png" width="60" />
                            </div>
                            <div class="col-6 text-center">
                                <h3>${leaguesArray[1]}</h3>
                                <img src="/images/leagues/${countryId}/${leaguesIdArray[1]}.png" width="60" />
                            </div>
                        </div>
                    </div>
                </div>
                `

                // tooltip.style.width = '400px'
                tooltip.style.display = 'block'
                const diff = innerHeight - clientY
                // console.log('diff: ', diff)
                const tooltipRect = tooltip.getBoundingClientRect()
                if (clientY < tooltipRect.height / 2) {
                    tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + parseInt((tooltipRect.height / 2) - clientY) + 'px'
                } else if (diff < tooltipRect.height / 2) {
                    tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) - parseInt((tooltipRect.height / 2) - diff) + 'px'
                } else {
                    tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + 'px'
                }
                if (clientX > offsetWidth / 2) {
                    tooltip.style.left = offsetLeft + (clientX - parseInt(tooltipRect.width)) - 20 + 'px'
                } else {
                    tooltip.style.left = offsetLeft + clientX + 20 + 'px'
                }
                // if (pageY - scrollTop > innerHeight / 2) {
                //     tooltip.style.top = `${pageY - 0}px`
                // } else {
                //     tooltip.style.top = `${pageY + 0}px`
                // }
                // if (pageX < innerWidth / 2) {
                //     tooltip.style.left = `${pageX + 000}px`
                // } else {
                //     tooltip.style.left = `${pageX - 000 - 0}px`
                // }
            }
        }

        const handleMouseLeaveCountry = (e) => {
            // console.log('handleMouseLeave')
            const tooltip = document.getElementById('tooltip')
            if (tooltip) {
                tooltip.style.display = 'none'
            }
            const countryId = e.target.id
            // console.log('countryId: ', countryId);
            const element = svgContent.getElementById(countryId)
            // console.log('element.classList: ', element.classList);
            element.classList.remove('hover')
        }

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mouseover', handleMouseOverCountry, false)
            elements[i].addEventListener('mouseleave', handleMouseLeaveCountry, false)
        }
    } catch (error) {
        console.log('error: ', error)
    }
}

const displayStadiumTooltip = () => {
    try {
        console.log('displayStadiumTooltip')
        svgObject = document.getElementById('svgObject')
        const svgContent = svgObject.contentDocument
        let elements = svgContent.getElementsByClassName('city')

        const handleMouseOverStadium = (e) => {
            console.log('handleMouseOverStadium: ', e)
            // console.log('e.target: ', e.target)
            const stadiumId = e.target.getAttribute('data-stadium-id')
            console.log('country: ', country);
            console.log('stadiumId: ', stadiumId)
            console.log('countryTeams: ', countryTeams);
            let stadiumTeams = []
            stadiumTeams = countryTeams.filter((t) => t.venue.api_football_id == stadiumId)
            console.log('stadiumTeams: ', stadiumTeams);
            if (!stadiumTeams.length) {
                alert('No stadium found!')
                return
            }
            const team1 = stadiumTeams[0]
            const team2 = stadiumTeams[1]

            const tooltip = document.getElementById('tooltip')
            console.log('tooltip: ', tooltip)
            if (tooltip) {
                tooltip.innerHTML = `
                    <div class="row">
                        <div class="col-12 text-center">
                            <h2 class="">${stadiumTeams[0]['venue']['name']}</h2>
                            <h3 class="">${stadiumTeams[0]['venue']['capacity']}</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 text-center">
                            <img src="/images/stadiums/${country}/${stadiumTeams[0]['venue']['api_football_id']}.jpg" width="200" alt="Stadium" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <h3 class="text-center">${team1.team?.name}</h3>
                        </div>
                        <div class="col-6">
                            <h3 class="text-center">${team2?.team?.name}</h3>
                        </div>
                    </div>
                `
                const innerHeight = window.innerHeight
                const clientX = e.clientX
                const clientY = e.clientY
                const diff = innerHeight - clientY
                const offsetLeft = document.getElementById('svgWrapper').offsetLeft
                const offsetWidth = document.getElementById('svgWrapper').offsetWidth

                tooltip.style.display = 'block'
                const tooltipRect = tooltip.getBoundingClientRect()
                if (clientY < tooltipRect.height / 2) {
                    tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + parseInt((tooltipRect.height / 2) - clientY) + 'px'
                } else if (diff < tooltipRect.height / 2) {
                    tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) - parseInt((tooltipRect.height / 2) - diff) + 'px'
                } else {
                    tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + 'px'
                }
                if (clientX > offsetWidth / 2) {
                    tooltip.style.left = offsetLeft + (clientX - parseInt(tooltipRect.width)) - 20 + 'px'
                } else {
                    tooltip.style.left = offsetLeft + clientX + 20 + 'px'
                }
            }
        }

        const handleMouseLeaveStadium = (e) => {
            console.log('handleMouseLeaveStadium')
            const tooltip = document.getElementById('tooltip')
            if (tooltip) {
                tooltip.style.display = 'none'
            }
        }

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mouseover', handleMouseOverStadium, false)
            elements[i].addEventListener('mouseleave', handleMouseLeaveStadium, false)
        }
    } catch (error) {
        console.log('error: ', error);
    }
}

const displayStadiums = async (country) => {
    try {
        // console.log('displayStadiums country: ', country)
        // return
        const svgObject = document.getElementById('svgObject')
        // console.log('svgObject: ', svgObject)
        const svgContent = svgObject.contentDocument
        // console.log('svgContent: ', svgContent)
        const stadiumObj = svgContent.getElementById('stadiums')
        // console.log('stadiumObj: ', stadiumObj)
        // return

        if (stadiumObj) {
            const circleRadius = stadiumObj.getAttribute('data-circle-radius')
            // console.log('circleRadius: ', circleRadius);
            const data = await fetch(`./teams/${country}.json`)
            countryTeams = await data.json()
            // console.log('teams: ', teams)
            let newElement
            const leagues = [...new Set(countryTeams.map((item) => item['league']['api_football_id']))]
            // console.log('leagues: ', leagues)
            for (let i = 0; i < countryTeams.length; i++) {
                newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                newElement.setAttribute('cx', countryTeams[i]['venue']['x'])
                newElement.setAttribute('cy', countryTeams[i]['venue']['y'] + 0)
                newElement.setAttribute('r', circleRadius)
                newElement.setAttribute('fill', countryTeams[i]['league']['api_football_id'] == leagues[0] ? '#FF0000' : '#FFFF00')
                newElement.setAttribute('data-city', countryTeams[i]['venue']['city'])
                newElement.setAttribute('data-stadium-id', countryTeams[i]['venue']['api_football_id'])
                newElement.setAttribute('class', 'city')
                newElement.setAttribute('api-football-league-id', countryTeams[i]['league']['api_football_id'])
                newElement.setAttribute('capacity', countryTeams[i]['venue']['capacity'])
                stadiumObj.appendChild(newElement)

                // newElement.addEventListener('mouseover', handleMouseOverStadium, false)
                // newElement.addEventListener('mouseleave', handleMouseLeaveStadium, false)
            }
            displayStadiumTooltip()
        }
    } catch (error) {
        console.log('error: ', error)
    }
}

const filterStadiums = async (filter) => {
    try {
        // console.log('filterStadiums filter: ', filter)
        const svgObject = document.getElementById('svgObject')
        if (!svgObject) {
            return
        }
        const svgContent = svgObject.contentDocument
        const stadiumObj = svgContent.getElementById('stadiums')
        if (!stadiumObj) {
            return
        }
        // console.log('teams: ', teams);
        stadiumObj.innerHTML = ''

        const circleRadius = stadiumObj.getAttribute('data-circle-radius')
        const leagues = [...new Set(countryTeams.map((item) => item['league']['api_football_id']))]
        // console.log('leagues: ', leagues)
        // console.log('leagues[1]: ', leagues[0])
        // console.log('leagues[2]: ', leagues[1])
        let teams = JSON.parse(JSON.stringify(countryTeams))
        let newTeams = []

        switch (filter) {
            case 'all':
                newTeams = teams
                break;
            case 'top_league':
                // console.log('top_league')
                newTeams = teams.filter((team) => parseInt(team.league.api_football_id) == parseInt(113))
                break;
            case 'second_league':
                // console.log('second_league')
                newTeams = teams.filter((team) => parseInt(team.league.api_football_id) == parseInt(114))
                break;
            case 'stadium_sm':
                newTeams = teams.filter((team) => team.venue.capacity < 20000)
                break;
            case 'stadium_md':
                newTeams = teams.filter((team) => team.venue.capacity >= 20000 && team.venue.capacity < 40000)
                break;
            case 'stadium_lg':
                newTeams = teams.filter((team) => team.venue.capacity >= 40000 && team.venue.capacity < 60000)
                break;
            case 'stadium_xl':
                newTeams = teams.filter((team) => team.venue.capacity >= 60000)
                break;
        }

        // console.log('newTeams2: ', newTeams);
        for (let i = 0; i < newTeams.length; i++) {
            newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            newElement.setAttribute('cx', newTeams[i]['venue']['x'])
            newElement.setAttribute('cy', newTeams[i]['venue']['y'] + 0)
            newElement.setAttribute('r', circleRadius)
            newElement.setAttribute('fill', newTeams[i]['league']['api_football_id'] == leagues[0] ? '#FF0000' : '#FFFF00')
            newElement.setAttribute('data-city', newTeams[i]['venue']['city'])
            newElement.setAttribute('data-stadium-id', newTeams[i]['venue']['api_football_id'])
            newElement.setAttribute('class', 'city')
            newElement.setAttribute('api-football-league-id', newTeams[i]['league']['api_football_id'])
            newElement.setAttribute('capacity', newTeams[i]['venue']['capacity'])
            stadiumObj.appendChild(newElement)
        }
    } catch (error) {
        console.log('error: ', error);
    }
}

const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
    return str;
}

const hasSmallScreen = () => {
    const minWidth = 1024; // Minimum width for desktop devices
    return window.innerWidth < minWidth || screen.width < minWidth;
}
const hasTouchSupport = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}