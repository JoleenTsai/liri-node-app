const request = require('request')
require('dotenv').config()

const keys = require('./keys.js')
const fs = require('fs')
const inq = require('inquirer')
const moment = require('moment')

// BandsinTown
const concertThis = artist => {
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${keys.bit.id}`, (e, r, d) => {
        if (e) {console.log(e)} 
        const info = JSON.parse(d)
        const data = `
                
        CONCERT-THIS
        -------------------
        ${info[0].lineup}

        Venue Location:      ${info[0].venue.name}
                             ${info[0].venue.city}, ${info[0].venue.region}, ${info[0].venue.country}
        Date of Event:       ${moment(info[0].datetime).format(`ddd MM/DD/YYYY`)}
        Ticket Availability: ${info[0].offers[0].status}
        Buy Ticket URL:
          ${info[0].offers[0].url}
        --------------------
        `

                console.log(data)
            fs.appendFile('log.txt', data, e =>
            { if (e) {console.log(e)}
                })      
            })
        }
        
// Spotify
const spotifyThis = song => {
    const spotifyReq = require('node-spotify-api')
    let spotify = new spotifyReq ({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    })
    spotify.search({ type: 'track', query: song }, function(e, d) {
        if (e) {console.log(e)}
        const data = `

        SPOTIFY-THIS
        --------------------
        Song Name: ${d.tracks.items[0].name}
        Artist Name: ${d.tracks.items[0].artists[0].name}
        Album Name: ${d.tracks.items[0].album.name}
        URL: ${d.tracks.items[0].preview_url}
        --------------------
        `
        console.log(data)
        fs.appendFile('log.txt', data, e => {
            if (e) { console.log(e) }
                 })      
            })
        }

// OMDb
const movieThis = movie => {
    request(`http://www.omdbapi.com/?t=${movie}&apikey=${keys.omdb.id}`, (e, r, d) => {
        if (e) {console.log(e)}
        const movie = JSON.parse(d)
        const data =
        `

        MOVIE-THIS
        --------------------
        ${movie.Title}
        Year: ${movie.Year}
        IMDB Rating: ${movie.imdbRating}
        Rotten Tomatoes: ${movie.Ratings[1].Value}
        Country: ${movie.Country}
        Language: ${movie.Language}
        Plot: ${movie.Plot}
        Actors: ${movie.Actors}
        --------------------
        `
        console.log(data)
        fs.appendFile('log.txt', data, e => {
            if (e) {console.log(e)}
        })
    })
}
const command = choice => {
    switch (choice) {
        case "concert-this":
        // concertThis(process.argv[3])
            inq.prompt([
                {
                    type: 'input',
                    message: 'Which artist would you like to see?',
                    name: 'artistChoice'
                }
            ])
                .then(answers => concertThis(answers.artistChoice))
            break

        case 'spotify-this-song':
            // spotifyThis(process.argv[3])
            inq.prompt([
                {
                    type: 'input',
                    message: 'What song would you like to search?',
                    name: 'songChoice'
                }
            ])
                .then(answers => spotifyThis(answers.songChoice))
            break

        case 'movie-this':
            // movieThis(process.argv[3])
            inq.prompt([
                {
                    type: 'input',
                    message: 'What movie would you like to search?',
                    name: 'movieChoice'
                }
            ])
                .then(answers => movieThis(answers.movieChoice))
            break

    }

}

const begin = () => {
    if (process.argv[2] === 'init') {
        inq.prompt([
            {
                type: 'list',
                name: 'userChoice',
                message: 'Welcome to Liri! Please select a search function:',
                choices: ['concert-this','spotify-this-song', 'movie-this']
            }
        ])
            .then(answers => command(answers.userChoice))
             .catch(e => {
                if (e) { console.log(e) }
        })
    }
}
begin()