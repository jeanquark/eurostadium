window.onload = (event) => {
    try {
        console.log('page is fully loaded!')

        // document.getElementById("wrapper").innerHTML = `
        //     <div class="col-6" id="svgWrapper">
        //         <object type="image/svg+xml" id="svgObject" style="width: 100%; border: 2px dashed blue;">
        //             <img src="./images/no-image.png" />
        //         </object>
        //         <div id="tooltip" class=""></div>
        //     </div>
        // `;
        svgObject = document.getElementById('svgObject')
        console.log('svgObject: ', svgObject)
        svgObject.data = `./images/svg/europe-with-russia.svg`
        initSVG()
    } catch (error) {
        console.log('error: ', error);
    }
}

const displayMap = (map) => {
    svgObject.data = `./images/svg/${map}.svg`
}

let country
// const initSVG = () => {
    svgObject = document.getElementById('svgObject')
    svgObject.addEventListener(
        'load',
        async () => {
            console.log('initSVG()')
            let svgObject = document.getElementById('svgObject')
            const svgContent = svgObject.contentDocument
            console.log('svgContent: ', svgContent);

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
                        // console.clear()
                        // console.log('e1: ', e)
                        const path = e.target.closest('path')
                        if (path) {
                            country = path.getAttribute('data-country')
                            console.log('country: ', country)
                            if (country) {
                                svgObject.data = `./images/svg/countries/${country}.svg`
                                // let elements = svgContent.getElementsByClassName('country')
                                // for (var i = 0; i < elements.length; i++) {
                                //     elements[i].classList.remove("hover")
                                // }
                                const tooltip = document.getElementById('tooltip')
                                if (tooltip) {
                                    tooltip.style.display = 'none'
                                }
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
            displayCountryTooltip()
            if (country) {
                displayStadiumTooltip(country)
            }

    // svgPanZoom('#svgObject', {
    //     zoomEnabled: true,
    //     controlIconsEnabled: false,
    //     fit: 1,
    //     center: 1,
    //     minZoom: 1,
    //     maxZoom: 8,
    //     beforePan: function (oldPan, newPan) {
    //         var stopHorizontal = false,
    //             stopVertical = false,
    //             gutterWidth = 300,
    //             gutterHeight = 300,
    //             sizes = this.getSizes(),
    //             leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
    //             rightLimit = sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom,
    //             topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
    //             bottomLimit = sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom

    //         customPan = {}
    //         customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
    //         customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))

    //         return customPan
    //     }
    // })
    })
// }

const displayCountryTooltip = () => {
    try {
        svgObject = document.getElementById('svgObject')
        const svgContent = svgObject.contentDocument
        let elements = svgContent.getElementsByClassName('country')

        const handleMouseOver = (e) => {
            // console.log('handleMouseOver')
            const innerWidth = window.innerWidth
            const innerHeight = window.innerHeight
            const pageX = e.pageX
            const pageY = e.pageY
            const scrollTop = document.documentElement.scrollTop

            const tooltip = document.getElementById('tooltip')
            // console.log('tooltip: ', tooltip)
            if (tooltip) {
                tooltip.style.display = 'block'
                if (pageY - scrollTop > innerHeight / 2) {
                    tooltip.style.top = `${pageY - 0}px`
                } else {
                    tooltip.style.top = `${pageY + 100}px`
                }
                if (pageX < innerWidth / 2) {
                    tooltip.style.left = `${pageX + 5}px`
                } else {
                    tooltip.style.left = `${pageX - 400 - 0}px`
                }
            }

            let countryId
            let countryName
            let leagues = []
            let leaguesArray = []
            let population

            countryId = e.target.id
            if (!countryId) {
                countryId = e.target.parentNode.id
            }
            countryName = e.target.getAttribute('data-country')
            if (!countryName) {
                // console.log('no country')
                countryName = e.target.parentNode.getAttribute('data-country')
            }

            leagues = e.target.getAttribute('data-leagues')
            if (!leagues) {
                leagues = e.target.parentNode.getAttribute('data-leagues')
            }
            if (leagues) {
                leaguesArray = leagues.split(',')
            }
            // const countryName = country.charAt(0).toUpperCase() + country.slice(1);
            population = e.target.getAttribute('data-pop')
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
                            <h5 class="text-center">Pop: ${population}</h5>
                        </div>
                    </div>
                    <div class="col-6">
                        <img src="../images/countries/${countryId}.jpg" width="100%" />
                    </div>
                </div>

                <div class="row align-center mt-4">
                    <div class="col-6">
                        <img src="../images/countries/${countryId}_stadium.jpg" width="100%" />
                    </div>
                    <div class="col-6">
                        <div class="row justify-center">
                            <div class="col-6 text-center">
                                <h3>${leaguesArray[0]}</h3>
                                <img src="/images/leagues/${countryId}/${leaguesArray[0]}.png" width="60" />
                            </div>
                            <div class="col-6 text-center">
                                <h3>${leaguesArray[1]}</h3>
                                <img src="/images/leagues/${countryId}/${leaguesArray[1]}.png" width="60" />
                            </div>
                        </div>
                    </div>
                </div>
                `

            const element = svgContent.getElementById(countryId)
            element.classList.add("hover")
        }

        const handleMouseLeave = (e) => {
            // console.log('handleMouseLeave')
            const tooltip = document.getElementById('tooltip')
            if (tooltip) {
                tooltip.style.display = 'none'
            }
            const countryId = e.target.id
            // console.log('countryId: ', countryId);
            const element = svgContent.getElementById(countryId)
            // console.log('element.classList: ', element.classList);
            element.classList.remove("hover")
        }

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mouseover', handleMouseOver, false)
            elements[i].addEventListener('mouseleave', handleMouseLeave, false)
        }
    } catch (error) {
        console.log('error: ', error)
    }
}

const displayStadiumTooltip = async (country) => {
    try {
        console.log('fetchStadiums country: ', country)
        const svgObject = document.getElementById('svgObject')
        // console.log('svgObject: ', svgObject)
        const svgContent = svgObject.contentDocument
        // console.log('svgContent: ', svgContent)
        const stadiumObj = svgContent.getElementById('stadiums')
        // console.log('stadiumObj: ', stadiumObj)
        // return

        if (stadiumObj) {
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
                newElement.setAttribute('r', 5)
                newElement.setAttribute('fill', teams[i]['league']['api_football_id'] == leagues[0] ? '#FF0000' : '#FFFF00')
                newElement.setAttribute('data-city', teams[i]['venue']['city'])
                newElement.setAttribute('data-stadium-id', teams[i]['venue']['api_football_id'])
                newElement.setAttribute('class', 'city')
                stadiumObj.appendChild(newElement)
            }
        }

        let elements = svgContent.getElementsByClassName('city')
        // console.log('elements: ', elements)

        // const handleMouseOver = (e) => {
        //     console.log('handleMouseOver')
        //     const innerWidth = window.innerWidth
        //     const innerHeight = window.innerHeight
        //     const pageX = e.pageX
        //     const pageY = e.pageY
        //     const scrollTop = document.documentElement.scrollTop

        //     const tooltip = document.getElementById('tooltip')
        //     console.log('tooltip: ', tooltip)
        //     if (tooltip) {
        //         tooltip.style.display = 'block'
        //         if (pageY - scrollTop > innerHeight / 2) {
        //             tooltip.style.top = `${pageY - 0}px`
        //         } else {
        //             tooltip.style.top = `${pageY - 0}px`
        //         }
        //         if (pageX < innerWidth / 2) {
        //             tooltip.style.left = `${pageX + 5}px`
        //         } else {
        //             tooltip.style.left = `${pageX - 400 - 0}px`
        //         }
        //     }

        //     const city = e.target.getAttribute('data-city')
        //     const stadiumId = e.target.getAttribute('data-stadium-id')
        //     console.log('city: ', city)
        //     tooltip.innerHTML = `
        //     <h4>${city}</h4>
        //     <img src="./images/stadiums/${country}/${stadiumId}.jpg" width="300" />
        // `
        // }

        // for (var i = 0; i < elements.length; i++) {
        //     elements[i].addEventListener('mouseover', handleMouseOver, false)
        // }
    } catch (error) {
        console.log('error: ', error);
    }
}