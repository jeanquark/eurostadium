const fs = require('fs');
const axios = require('axios');

const fetchTeams = async () => {
    console.log('fetchTeams')

    const season = 2023;
    const country = 'austria'
    const file = `./teams/${country}.json`;

    // 1) Get leagues
    const leagues = [
        {
            "name": "Bundesliga",
            "slug": "bundesliga",
            "api_football_id": 218,
            "country": "Austria",
            "api_football_country_id": 0
        },
        {
            "name": "2. Liga",
            "slug": "2_liga",
            "api_football_id": 219,
            "country": "Austria",
            "api_football_country_id": 0
        },
    ]

    // 1) Reset league object for all teams
    const currentFile = fs.readFileSync(file);
    let currentTeams = []
    if (currentFile.length > 0) {
        currentTeams = JSON.parse(currentFile);
    }

    for (let i = 0; i < currentTeams.length; i++) {
        currentTeams[i]['league'] = {}
    }

    // 2) Fetch teams for all leagues
    let apiFootballTeams = [];
    for (let i = 0; i < leagues.length - 0; i++) {
        // 2.1) Request data from API Football
        const { data } = await axios.get(`https://v3.football.api-sports.io/teams?league=${leagues[i]['api_football_id']}&season=${season}`, {
            "headers": {
                "x-rapidapi-key": "",
                "x-rapidapi-host": 'v3.football.api-sports.io'
            }
        })
        for (let j = 0; j < data.response.length; j++) {
            let team = { league: {}, ...data.response[j]}
            team['league']['api_football_id'] = leagues[i]['api_football_id']
            team['league']['name'] = leagues[i]['name']
            team['league']['country'] = leagues[i]['country']
            team['league']['api_football_country_id'] = leagues[i]['api_football_country_id']
            apiFootballTeams.push(team)
        }
    }

    // 3) Add all API Football teams
    let teams = []
    let i
    for (i = 0; i < apiFootballTeams.length; i++) {
        let obj = { team: {}, venue: {}, league: {} }
        const team = currentTeams.find((el) => el.team.api_football_id == apiFootballTeams[i]['team']['id'])

        obj['no'] = i + 1

        obj['team']['api_football_id'] = apiFootballTeams[i]['team']['id']
        obj['team']['name'] = apiFootballTeams[i]['team']['name']
        obj['team']['code'] = apiFootballTeams[i]['team']['code']
        obj['team']['country'] = apiFootballTeams[i]['team']['country']
        obj['team']['founded'] = apiFootballTeams[i]['team']['founded']

        obj['venue']['api_football_id'] = apiFootballTeams[i]['venue']['id']
        obj['venue']['name'] = apiFootballTeams[i]['venue']['name']
        obj['venue']['address'] = apiFootballTeams[i]['venue']['address']
        obj['venue']['city'] = apiFootballTeams[i]['venue']['city']
        obj['venue']['capacity'] = apiFootballTeams[i]['venue']['capacity']
        obj['venue']['surface'] = apiFootballTeams[i]['venue']['surface']
        obj['venue']['lat'] = team && team.venue.lat ? team.venue.lat : 0.0
        obj['venue']['lng'] = team && team.venue.lng ? team.venue.lng : 0.0
        obj['venue']['x'] = team && team.venue.x ? team.venue.x : 0
        obj['venue']['y'] = team && team.venue.y ? team.venue.y : 0
        
        obj['league']['api_football_id'] = apiFootballTeams[i]['league']['api_football_id']
        obj['league']['name'] = apiFootballTeams[i]['league']['name']
        obj['league']['country'] = apiFootballTeams[i]['league']['country']
        obj['league']['api_football_country_id'] = apiFootballTeams[i]['league']['api_football_country_id']

        teams.push(obj)
    }

    // 4) Add teams that are no more part of the leagues
    for (let j = 0; j < currentTeams.length; j++) {
        if (!teams.find((team) => team['team']['api_football_id'] == currentTeams[j]['team']['api_football_id'])) {
            i++
            currentTeams[j]['no'] = i + 1;
            teams.push(currentTeams[j])
        }
    }

    if (teams.length > 0) {
        fs.writeFile(`./teams/${country}.json`, JSON.stringify(teams, null, "\t"), function (err) {
            if (err) throw err;
            console.log('Write complete!');
        });
    }

    console.log(`Successfully fetched teams for ${country}`);
}

fetchTeams()