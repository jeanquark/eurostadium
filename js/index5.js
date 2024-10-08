window.onload = (event) => {
    try {
        // console.log('page is fully loaded!')
        svgObject = document.getElementById('svgObject')
        // console.log('svgObject: ', svgObject)
        if (svgObject) {
            // svgObject.data = `./images/svg/europe-with-russia.svg`
            svgObject.setAttribute('data', './images/svg/europe-with-russia.svg')
        }
        // document.getElementById('mouseOverStadium').innerHTML = mouseOverStadium
        // document.getElementById('mouseOverTooltip').innerHTML = mouseOverTooltip
    } catch (error) {
        console.log('error: ', error)
    }
}

let country
let countryTeams = []
let stadium
// let cities
let filter = 'all'
let leaguesIdArray = []
let leagueColors = ['#FF0000', '#FFFF00']
let svgObject = document.getElementById('svgObject')
let mouseOverStadium = false
let mouseOverTooltip = false

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

    console.log('country3: ', country)
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
            // console.log('onZoom newZoom: ', newZoom)
            const stadiumObj = svgContent.getElementById('stadiums')
            if (stadiumObj) {
                // console.log('stadiumObj: ', stadiumObj)
                const circleRadius = stadiumObj.getAttribute('data-circle-radius')
                // console.log('circleRadius: ', circleRadius);
                var stadiums = stadiumObj.querySelectorAll('.stadium')
                if (stadiums) {
                    for (var i = 0; i < stadiums.length; i++) {
                        // console.log('cities[i]: ', cities[i])
                        stadiums[i].setAttribute('r', parseInt(circleRadius - newZoom) + 1)
                    }
                }
            }
        },
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
                console.log('click')
                const path = e.target.closest('path')
                if (path) {
                    if (path.getAttribute('data-country')) {
                        // console.log('svgObject: ', svgObject);
                        country = path.getAttribute('id')
                        console.log('country: ', country)
                        if (country && path.getAttribute('data-country')) {
                            const infoPanel = document.getElementById('infoPanel')
                            if (infoPanel) {
                                infoPanel.classList.remove('hidden')
                                const countryInfo = document.getElementById('countryInfo')
                                if (countryInfo) {
                                    countryInfo.innerHTML = `<h3 class="text-center text-uppercase">${country}</h3><img src="/images/flags/${country}.png" width="30%" />            
                                `
                                }
                            }
                            document.getElementById('filterPanel').classList.remove('hidden')

                            svgObject.data = `./images/svg/countries/${country}.svg`

                            const tooltip = document.getElementById('tooltip')
                            if (tooltip) {
                                tooltip.style.display = 'none'
                            }
                        }
                    } else {
                        tooltip.style.display = 'none'
                        console.log('clicked empty space inside country')
                    }
                } else {
                    tooltip.style.display = 'none'
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
                    document.getElementById('filterPanel').classList.remove('hidden')
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
    console.log('displayMap map: ', map)
    const infoPanel = document.getElementById('infoPanel')
    if (infoPanel) {
        infoPanel.classList.add('hidden')
    }
    const filterPanel = document.getElementById('filterPanel')
    if (filterPanel) {
        filterPanel.classList.add('hidden')
    }
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
            const offsetHeight = document.getElementById('svgWrapper').offsetHeight
            const offsetTop = document.getElementById('svgWrapper').offsetTop
            // console.log('offsetHeight: ', offsetHeight)
            // console.log('offsetLeft: ', offsetLeft);
            // console.log('offsetWidth: ', offsetWidth);
            // console.log('offsetTop: ', offsetTop);

            let countryId
            let countryName
            let leagues = ''
            let leaguesId = ''
            let leaguesArray = []
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

                <div class="row mt-4 border-0" style="display: flex-row;
                justify-content: center;
                align-items: center;">
                    <div class="col-6">
                        <img src="../images/countries/${countryId}_stadium.jpg" width="100%" />
                    </div>
                    <div class="col-6 border-0">
                        <div class="row align-center">
                            <div class="col-6 text-center border-0" style="">
                                <h3 class="border-0">${leaguesArray[0]}</h3>
                            </div>
                            <div class="col-6 text-center border-0" style="">
                                <h3 class="border-0">${leaguesArray[1]}</h3>
                            </div>
                        </div>
                        <div class="row align-center">
                            <div class="col-6 text-center border-0">
                                <img src="/images/leagues/${countryId}/${leaguesIdArray[0]}.png" width="60" class="border-0" />
                            </div>
                            <div class="col-6 text-center border-0">
                                <img src="/images/leagues/${countryId}/${leaguesIdArray[1]}.png" width="60" class="border-0" />
                            </div>
                        </div>
                    </div>
                </div>
                `

                // <div class="col-6 border-2">
                //         <div class="row">
                //             <div class="col-6 text-center border-3" style="display: flex-row;
                //             justify-content: center; align-items: center;">
                //                 <h3 class="border-5">${leaguesArray[0]}</h3>
                //                 <img src="/images/leagues/${countryId}/${leaguesIdArray[0]}.png" width="60" class="border-5" />
                //             </div>
                //             <div class="col-6 text-center border-4" style="display: flex-row;
                //             justify-content: center; align-items: center;">
                //                 <h3 class="border-5">${leaguesArray[1]}</h3>
                //                 <img src="/images/leagues/${countryId}/${leaguesIdArray[1]}.png" width="60" class="border-5" />
                //             </div>
                //         </div>
                //     </div>

                // tooltip.style.width = '400px'
                tooltip.style.display = 'block'
                const clientX = e.clientX
                const offsetWidth = document.getElementById('svgWrapper').offsetWidth
                const rect = e.target.getBoundingClientRect()

                const diff = innerHeight - clientY
                // console.log('diff: ', diff)
                const tooltipRect = tooltip.getBoundingClientRect()
                if (clientX > offsetWidth / 2) {
                    // tooltip.style.left = `${rect.x - 410 - rect.width}px`
                    // tooltip.style.left = `${rect.x - rect.width - parseInt(tooltipRect.width)}px`
                    tooltip.style.left = `${rect.x - parseInt(tooltipRect.width)}px`
                    // tooltip.style.left = offsetLeft + (clientX - parseInt(tooltipRect.width)) - 20 + 'px'
                } else {
                    tooltip.style.left = `${rect.x + rect.width}px`
                }
                tooltip.style.top = '50%'
                tooltip.style.transform = 'translateY(-50%)'

                // tooltip.style.left = '100px'
                // tooltip.style.top = '0px'

                // if (clientY < tooltipRect.height / 2) {
                //     tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + parseInt(tooltipRect.height / 2 - clientY) + 'px'
                // } else if (diff < tooltipRect.height / 2) {
                //     tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) - parseInt(tooltipRect.height / 2 - diff) + 'px'
                // } else {
                //     tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + 'px'
                // }
                // if (clientX > offsetWidth / 2) {
                //     tooltip.style.left = offsetLeft + (clientX - parseInt(tooltipRect.width)) - 20 + 'px'
                // } else {
                //     tooltip.style.left = offsetLeft + clientX + 20 + 'px'
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
        // console.clear()
        // console.log('displayStadiumTooltip')
        svgObject = document.getElementById('svgObject')
        const svgContent = svgObject.contentDocument
        let elements = svgContent.getElementsByClassName('stadium')

        const handleMouseOverTooltip = () => {
            // console.log('mouseOverTooltip')
            mouseOverTooltip = true
            tooltip.style.display = 'block'
            stadium.classList.add('hover')
        }

        const handleMouseLeaveTooltip = () => {
            // console.log('mouseLeaveTooltip')
            mouseOverTooltip = false
            const tooltip = document.getElementById('tooltip')
            // console.log('stadium2: ', stadium)
            if (!mouseOverStadium) {
                stadium.classList.remove('hover')
            }
            tooltip.style.display = 'none'
        }

        const handleMouseOverStadium = (e) => {
            // console.clear()
            // console.log('handleMouseOverStadium: ', e)
            // console.log('mouseOverTooltip: ', mouseOverTooltip)
            mouseOverStadium = true
            const tooltip = document.getElementById('tooltip')
            // console.log('tooltip.style.display: ', tooltip.style.display)
            // tooltip.style.display = 'none'
            if (tooltip.style.display == 'block') {
                // tooltip.style.display = 'none'
                // return
            }
            // mouseOverTooltip = true
            // console.log('e.target: ', e.target)
            stadium = e.target
            stadium.classList.add('hover')
            const stadiumId = e.target.getAttribute('data-stadium-id')
            const radius = e.target.getAttribute('r')
            // console.log('radius: ', radius);
            // stadium.classList.add('ghi')
            // console.log('country: ', country)
            // console.log('stadiumId: ', stadiumId)
            // console.log('countryTeams: ', countryTeams)
            let stadiumTeams = []
            stadiumTeams = countryTeams.filter((t) => t.venue.api_football_id == stadiumId)
            // console.log('stadiumTeams: ', stadiumTeams)
            if (!stadiumTeams.length) {
                alert('No stadium found!')
                return
            }
            const team1 = stadiumTeams[0]
            const team2 = stadiumTeams[1]

            if (tooltip) {
                // tooltip.classList.add("ghi")
                tooltip.innerHTML = `
                    <div class="row align-center">
                        <div class="col-12 text-center relative">
                            <h2>
                                <span class="text-primary"><b>${stadiumTeams[0]['venue']['name']}</b></span>, <span class="text-muted">${stadiumTeams[0]['venue']['city']}</span>
                            </h2>
                            <h3 class="">
                                ${formatNumber(stadiumTeams[0]['venue']['capacity'])}
                            </h3>
                            <img src="/images/icons/close.svg" width="20" class="text-right" id="closeTooltipBtn" style="position: absolute; top: 0; right: 0;" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 text-center">
                            <img src="/images/stadiums/${country}/${stadiumTeams[0]['venue']['api_football_id']}.jpg" width="100%" alt="Stadium" />
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col-4 text-center border-1" style="">
                            <h3 class="text-center">${team1.team?.name}</h3>
                            <img src="/images/clubs/${country}/${stadiumTeams[0]['team']['api_football_id']}.png" width="40%" alt="Team logo" />
                        </div>
                        ${team2 ? `<div class="col-4 text-center border-1" style="">
                            <h3 class="text-center">${team2.team?.name}</h3>
                            <img src="/images/clubs/${country}/${stadiumTeams[1]['team']['api_football_id']}.png" width="50%" alt="Team logo" />
                        </div>` : ''}
                        <div class="col-4 text-center border-1" style="">
                            <a href="${stadiumTeams[0]['venue']['url']}" target="_blank">
                                Wiki
                                <img src="/images/icons/external-link.svg" width="10" />
                            </a>
                        </div>
                    </div>
                `

                tooltip.style.position = 'absolute'
                const innerHeight = window.innerHeight
                const rect = e.target.getBoundingClientRect()
                // console.log('rect: ', rect)
                // console.log('radius: ', radius);
                // const def = e.target.clientX
                // console.log('def: ', def)
                // console.log('rect.y: ', rect.y);
                const clientX = e.clientX
                // console.log('clientX: ', clientX);
                const clientY = e.clientY
                // console.log('clientY: ', clientY);
                const offsetY = innerHeight - clientY
                // console.log('offsetY: ', offsetY);
                // console.log('tooltipRect.height: ', tooltipRect.height);
                const diff = innerHeight - clientY
                const offsetWidth = document.getElementById('svgWrapper').offsetWidth
                // console.log('offsetWidth: ', offsetWidth);
                const offsetTop = document.getElementById('svgWrapper').offsetTop
                // console.log('offsetTop: ', offsetTop);
                const svgObjectRect = svgObject.getBoundingClientRect()
                // console.log('svgObjectRect: ', svgObjectRect);

                if (clientY < svgObjectRect.height / 2) {
                    // console.log('top')
                } else {
                    // console.log('bottom')
                }

                tooltip.style.display = 'block'
                const tooltipRect = tooltip.getBoundingClientRect()

                if (clientX > offsetWidth / 2) {
                    // tooltip.style.left = `${rect.x - 410 - rect.width}px`
                    tooltip.style.left = `${rect.x - tooltipRect.width + 5}px`
                } else {
                    tooltip.style.left = `${rect.x + rect.width}px`
                }
                // tooltip.style.left = `${rect.x + (rect.width)}px`
                if (clientY < tooltipRect.height / 2) {
                    // tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + parseInt(tooltipRect.height / 2 - clientY) + 'px'
                    tooltip.style.top = '50%'
                    tooltip.style.transform = 'translateY(-50%)'
                } else if (diff < tooltipRect.height / 2) {
                    // tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) - parseInt(tooltipRect.height / 2 - diff) + 'px'
                    tooltip.style.top = '50%'
                    tooltip.style.transform = 'translateY(-50%)'
                } else {
                    // tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + 'px'
                    tooltip.style.top = '50%'
                    tooltip.style.transform = 'translateY(-50%)'
                }
                // tooltip.style.top = `${rect.y}px`
                // tooltip.style.left = `${rect.x + (15)}px` // radius 12
                // tooltip.style.left = `${rect.x + (33)}px` // radius 9
                // tooltip.style.left = `${rect.x + (45)}px` // radius 5
                // tooltip.style.left = `125px`
                tooltip.style.display = 'block'
                // mouseOverTooltip = true
                // tooltip.style.margin = '0px 20px'
                mouseOverTooltip = true

                // tooltip.style.visibility = 'hidden'

                // const innerHeight = window.innerHeight
                // console.log('innerHeight: ', innerHeight);
                // const clientX = e.clientX
                // const clientY = e.clientY
                // console.log('clientY: ', clientY);
                // const diff = innerHeight - clientY
                // console.log('diff: ', diff);
                // const offsetLeft = document.getElementById('svgWrapper').offsetLeft
                // const offsetWidth = document.getElementById('svgWrapper').offsetWidth

                // tooltip.addEventListener('mouseover', handleMouseOverTooltip, false)
                // tooltip.addEventListener('mouseleave', handleMouseLeaveTooltip, false)
                // const tooltipRect = tooltip.getBoundingClientRect()
                // console.log('tooltipRect: ', tooltipRect);
                // if (clientY < tooltipRect.height / 2) {
                //     tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + parseInt(tooltipRect.height / 2 - clientY) + 'px'
                // } else if (diff < tooltipRect.height / 2) {
                //     tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) - parseInt(tooltipRect.height / 2 - diff) + 'px'
                // } else {
                //     tooltip.style.top = clientY - parseInt(tooltipRect.height / 2) + 'px'
                // }
                // if (clientX > offsetWidth / 2) {
                //     tooltip.style.left = offsetLeft + (clientX - parseInt(tooltipRect.width)) - 0 + 'px'
                // } else {
                //     tooltip.style.left = offsetLeft + clientX + 0 + 'px'
                // }
                tooltip.addEventListener('mouseover', handleMouseOverTooltip, false)
                tooltip.addEventListener('mouseleave', handleMouseLeaveTooltip, false)

                // for (let i = 0; i < ghi.length; i++) {
                //     ghi[i].addEventListener('mouseleave', () => {
                //         console.log('ghi')
                //     }, false);
                // }
            }
            // else {
            //     tooltip.style.display = 'none'
            // }
            svgObject = document.getElementById('svgObject')
            const svgContent = svgObject.contentDocument
            const svgWrapper = document.getElementById('svgWrapper')
            const svgContent2 = svgWrapper.contentDocument
            let elements = document.getElementsByClassName('stadium')

            // console.log('elements: ', elements);
            for (let i = 0; i < elements.length; i++) {
                // elements[i].classList.add('ghi')
            }
            // let ghi = svgContent2.getElementsByClassName('city')
            // console.log('ghi: ', ghi);
            // console.log('ghi.length: ', ghi.length);
        }

        const handleMouseLeaveStadium = (e) => {
            // console.log('handleMouseLeaveStadium')
            const tooltip = document.getElementById('tooltip')
            // if (!mouseOverTooltip) {
            stadium.classList.remove('hover')
            // }
            // console.log('e.target.parentNode: ', e.target.parentNode)
            // mouseOverTooltip = false
            mouseOverStadium = false
            // console.log('mouseOverTooltip: ', mouseOverTooltip);
            if (tooltip) {
                // if (!mouseOverTooltip) {
                // stadium.classList.remove('hover')
                tooltip.style.display = 'none'
                // }
            }
        }

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mouseover', handleMouseOverStadium, false)
            elements[i].addEventListener('mouseleave', handleMouseLeaveStadium, false)
        }
    } catch (error) {
        console.log('error: ', error)
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
        // const buttons = document.getElementsByClassName('btn-filter')
        // for (let i = 0; i < buttons.length; i++) {
        //     buttons[i]['disabled'] = false
        //     buttons[i].classList.remove('active')
        // }
        removeFilterBtnActiveClass()
        removeFilterBtnDisableAttribute()
        const btnAll = document.getElementById('btnAll')
        if (btnAll) {
            btnAll.classList.add('active')
        }
        // filterStadiums('all')


        if (stadiumObj) {
            const circleRadius = stadiumObj.getAttribute('data-circle-radius')
            // console.log('circleRadius: ', circleRadius);
            const data = await fetch(`./teams/${country}.json`)
            countryTeams = await data.json()
            // console.log('teams: ', teams)
            let newElement
            const leagues = [...new Set(countryTeams.map((item) => item['league']['api_football_id']))]
            // setLeagueColors()
            const circleColors = stadiumObj.getAttribute('data-circle-colors').split(',')
            if (circleColors && circleColors.length == 2) {
                leagueColors[0] = circleColors[0]
                leagueColors[1] = circleColors[1]
            }
            // let colors = ['#FF0000', '#FFFF00']
            // const circleColors = stadiumObj.getAttribute('data-circle-colors').split(',')
            // if (circleColors.length == 2) {
            //     colors[0] = circleColors[0]
            //     colors[1] = circleColors[1]
            // }
            // console.log('colors: ', colors);

            // console.log('leagues: ', leagues)
            for (let i = 0; i < countryTeams.length; i++) {
                newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                newElement.setAttribute('cx', countryTeams[i]['venue']['x'])
                newElement.setAttribute('cy', countryTeams[i]['venue']['y'] + 0)
                newElement.setAttribute('r', circleRadius)
                newElement.setAttribute('fill', countryTeams[i]['league']['api_football_id'] == leagues[0] ? leagueColors[0] : leagueColors[1])
                newElement.setAttribute('data-city', countryTeams[i]['venue']['city'])
                newElement.setAttribute('data-stadium-id', countryTeams[i]['venue']['api_football_id'])
                newElement.setAttribute('class', 'stadium')
                newElement.setAttribute('api-football-league-id', countryTeams[i]['league']['api_football_id'])
                newElement.setAttribute('capacity', countryTeams[i]['venue']['capacity'])
                stadiumObj.appendChild(newElement)

                // newElement.addEventListener('mouseover', handleMouseOverStadium, false)
                // newElement.addEventListener('mouseleave', handleMouseLeaveStadium, false)
            }
            displayStadiumTooltip()
            const allTeamsTotal = document.getElementById('allTeamsTotal')
            if (allTeamsTotal) {
                allTeamsTotal.innerHTML = countryTeams.length
            }
            const topLeagueTeamsTotal = document.getElementById('topLeagueTeamsTotal')
            if (topLeagueTeamsTotal) {
                topLeagueTeamsTotal.innerHTML = countryTeams.filter((team) => team.league.api_football_id == leagues[0]).length
            }
            const secondLeagueTeamsTotal = document.getElementById('secondLeagueTeamsTotal')
            if (secondLeagueTeamsTotal) {
                secondLeagueTeamsTotal.innerHTML = countryTeams.filter((team) => team.league.api_football_id == leagues[1]).length
            }
            const countrySmallStadiumsTotal = document.getElementById('countrySmallStadiumsTotal')
            if (countrySmallStadiumsTotal) {
                const length = [...new Set(countryTeams.filter((team) => team.venue.capacity < 20000).map((team) => team.venue.api_football_id))].length
                countrySmallStadiumsTotal.innerHTML = length
                if (length == 0) {
                    const btnSm = document.getElementById('btnSm')
                    if (btnSm) {
                        btnSm.setAttribute('disabled', true)
                    }
                }
            }
            const countryMediumStadiumsTotal = document.getElementById('countryMediumStadiumsTotal')
            if (countryMediumStadiumsTotal) {
                const length = [...new Set(countryTeams.filter((team) => team.venue.capacity >= 20000 && team.venue.capacity < 40000).map((team) => team.venue.api_football_id))].length
                countryMediumStadiumsTotal.innerHTML = length
                if (length == 0) {
                    const btnMd = document.getElementById('btnMd')
                    if (btnMd) {
                        btnMd.setAttribute('disabled', true)
                    }
                }
            }
            const countryLargeStadiumsTotal = document.getElementById('countryLargeStadiumsTotal')
            if (countryLargeStadiumsTotal) {
                const length = [...new Set(countryTeams.filter((team) => team.venue.capacity >= 40000 && team.venue.capacity < 60000).map((team) => team.venue.api_football_id))].length
                countryLargeStadiumsTotal.innerHTML = length
                if (length == 0) {
                    const btnLg = document.getElementById('btnLg')
                    if (btnLg) {
                        btnLg.setAttribute('disabled', true)
                    }
                }
            }
            const countryExtraLargeStadiumsTotal = document.getElementById('countryExtraLargeStadiumsTotal')
            if (countryExtraLargeStadiumsTotal) {
                const length = [...new Set(countryTeams.filter((team) => team.venue.capacity >= 60000).map((team) => team.venue.api_football_id))].length
                countryExtraLargeStadiumsTotal.innerHTML = length
                if (length == 0) {
                    const btnXl = document.getElementById('btnXl')
                    if (btnXl) {
                        btnXl.setAttribute('disabled', true)
                    }
                }
            }
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
                removeFilterBtnActiveClass()
                const btnAll = document.getElementById('btnAll')
                if (btnAll) {
                    btnAll.classList.add('active')
                }
                break
            case 'top_league':
                console.log('top_league')
                newTeams = teams.filter((team) => parseInt(team.league.api_football_id) == parseInt(leaguesIdArray[0]))
                removeFilterBtnActiveClass()
                const btnTop = document.getElementById('btnTop')
                if (btnTop) {
                    btnTop.classList.add('active')
                }
                break
            case 'second_league':
                console.log('second_league')
                newTeams = teams.filter((team) => parseInt(team.league.api_football_id) == parseInt(leaguesIdArray[1]))
                removeFilterBtnActiveClass()
                const btnSecond = document.getElementById('btnSecond')
                if (btnSecond) {
                    btnSecond.classList.add('active')
                }
                break
            case 'stadium_sm':
                newTeams = teams.filter((team) => team.venue.capacity < 20000)
                removeFilterBtnActiveClass
                const btnSm = document.getElementById('btnSm')
                if (btnSm) {
                    btnSm.classList.add('active')
                }
                break
            case 'stadium_md':
                newTeams = teams.filter((team) => team.venue.capacity >= 20000 && team.venue.capacity < 40000)
                removeFilterBtnActiveClass()
                const btnMd = document.getElementById('btnMd')
                if (btnMd) {
                    btnMd.classList.add('active')
                }
                break
            case 'stadium_lg':
                newTeams = teams.filter((team) => team.venue.capacity >= 40000 && team.venue.capacity < 60000)
                removeFilterBtnActiveClass()
                const btnLg = document.getElementById('btnLg')
                if (btnLg) {
                    btnLg.classList.add('active')
                }
                break
            case 'stadium_xl':
                newTeams = teams.filter((team) => team.venue.capacity >= 60000)
                removeFilterBtnActiveClass()
                const btnXl = document.getElementById('btnXl')
                if (btnXl) {
                    btnXl.classList.add('active')
                }
                break
        }

        // console.log('newTeams2: ', newTeams);
        for (let i = 0; i < newTeams.length; i++) {
            newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            newElement.setAttribute('cx', newTeams[i]['venue']['x'])
            newElement.setAttribute('cy', newTeams[i]['venue']['y'] + 0)
            newElement.setAttribute('r', circleRadius)
            newElement.setAttribute('fill', newTeams[i]['league']['api_football_id'] == leagues[0] ? leagueColors[0] : leagueColors[1])
            newElement.setAttribute('data-city', newTeams[i]['venue']['city'])
            newElement.setAttribute('data-stadium-id', newTeams[i]['venue']['api_football_id'])
            newElement.setAttribute('class', 'stadium')
            newElement.setAttribute('api-football-league-id', newTeams[i]['league']['api_football_id'])
            newElement.setAttribute('capacity', newTeams[i]['venue']['capacity'])
            stadiumObj.appendChild(newElement)
        }
        displayStadiumTooltip()
    } catch (error) {
        console.log('error: ', error)
    }
}

const setLeagueColors = () => {
    const svgObject = document.getElementById('svgObject')
    const svgContent = svgObject.contentDocument
    const stadiumObj = svgContent.getElementById('stadiums')
    const circleColors = stadiumObj.getAttribute('data-circle-colors').split(',')
    if (circleColors && circleColors.length == 2) {
        leagueColors[0] = circleColors[0]
        leagueColors[1] = circleColors[1]
    }
}

const removeFilterBtnActiveClass = () => {
    const buttons = document.getElementsByClassName('btn-filter')
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active')
    }
}

const removeFilterBtnDisableAttribute = () => {
    const buttons = document.getElementsByClassName('btn-filter')
    for (let i = 0; i < buttons.length; i++) {
        buttons[i]['disabled'] = false
    }
}

const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
    str = str.toLowerCase() // convert string to lowercase
    str = str
        .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // remove consecutive hyphens
    return str
}

const formatNumber = (number) => {
    return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

const hasSmallScreen = () => {
    const minWidth = 1024 // Minimum width for desktop devices
    return window.innerWidth < minWidth || screen.width < minWidth
}
const hasTouchSupport = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
