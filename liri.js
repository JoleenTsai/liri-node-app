require('dotenv').config()
const request = require('request')

const keys = require("./keys")
const fs = require('fs')
const inq = require('inquirer')
const moment = require('moment')

// BandsinTown
const concertThis = artist => {
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${keys.bit.id}`, (e, r, d) => {
        if (e) {console.log(e)} 
        const info = JSON.parse(d)
        const data = `
                
        Movie-This
        -------------------
        Venue Location: ${info[0].venue.name}
                        ${info[0].venue.city}, ${info[0].venue.region}
        Date of Event: ${moment(info[0].datetime).format(`MM/DD/YYYY`)}
        --------------------
        
        `
                console.log(data)
            fs.appendFile('log.txt', data, e => e ? console.log(e) : console.log('Success!'))
                })      
            }
        
// Spotify
const spotifyThis = song => {
    const spotifyApi = require('node-spotify-api')
    let spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    })
    spotify.search({ type: 'track', query: song }, function(e, d) {
        if (e) {console.log(e)}
        const data = `

        Spotify-This
        --------------------
        Song Name: ${d.tracks.items[0].name}
        Artist Name: ${d.tracks.items[0].artists[0].name}
        Album Name: ${d.tracks.items[0].album.name}
        URL: ${d.tracks.items[0].preview_url}
        --------------------
        
        `
        console.log(data)
        fs.appendFile('log.txt', data, e => e ? console.log(e) : console.log('Success!'))
            })
        }

// OMDb
const movieThis = movie => {
    request(`http://www.omdbapi.com/?t=${movie}&apikey=${keys.omdb.id}`, (e, r, d) => {
        if (e) {console.log(e)}
        console.log(r)
        const movie = JSON.parse(d)
        const data = `

        Movie-This
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
            if (e) { console.log(e) }
        })
    })
}
const command = choice => {
    switch (choice) {
        case "concert-this":
        concertThis(process.argv[3])
            // inq.prompt([
            //     {
            //         type: 'input',
            //         message: 'Which artist would you like to see?',
            //         name: 'artistChoice'
            //     }
            // ])
            //     .then(answers => concertThis(answers.artistChoice))
            break

        case 'spotify-this-song':
            spotifyThis(process.argv[3])
            // inq.prompt([
            //     {
            //         type: 'input',
            //         message: 'What song would you like to search?',
            //         name: 'songChoice'
            //     }
            // ])
            //     .then(answers => spotifyThis(answers.songChoice))
            break

        case 'movie-this':
            movieThis(process.argv[3])
            // inq.prompt([
            //     {
            //         type: 'input',
            //         message: 'What movie would you like to search?',
            //         name: 'movieChoice'
            //     }
            // ])
            //     .then(answers => movieThis(answers.movieChoice))
            break

    }

}

// const runApp = () => {
//     if (process.argv[2] === 'init') {
//         inq.prompt([
//             {
//                 type: 'list',
//                 message: 'Welcome to Liri! Please select a search function:',
//                 choices: ['Search for a concert','Search for a song', 'Search for a movie', ]
//             }
//         ])
//             .then(answers => command(answers.userChoice))
//     }
// }

// runApp()