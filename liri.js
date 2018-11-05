//#region NPM
const ENV           = require('dotenv').config();
const request       = require('request');
const moment        = require('moment');
const SpotifyModule = require('node-spotify-api');
const fs = require('fs');
//#endregion

//#region LOCAL Modules
const keys = require("./keys");
// console.log({ keys });
//#endregion

const spotify = new SpotifyModule({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});


const LIRI_COMMANDS = {


  //* node liri.js concert-this <artist/band name here>
  "concert-this": function(params) {
    //* Validate
    let searchTerm = params.join(" ").trim();
    if (!searchTerm) {
      console.log("LIRI CONCERT needs an artist or band name for which to search.");
      console.log("Usage:\n\tliri concert-this <artist/band>");
      return;
    }
    console.log(`Concert events for ${searchTerm}:`);

    //* This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events") for an artist and render information about each event to the terminal:

    const queryURL = `https://rest.bandsintown.com/artists/${encodeURIComponent(searchTerm)}/events?app_id=${keys.bandsintown.id}`;
    //? console.log(queryURL);

    request(queryURL, function(error, response, body) {
      // If the request is successful
      if (!error && response.statusCode === 200) {
        let events = JSON.parse(body);
        //? console.log(events);
        if (events.length === 0) {
          console.log(`Sorry, no upcoming events were found for ${searchTerm}`);
          return;
        }
        //TODO: pagination?
        events.forEach( (event, index) => {
          // Date of the Event (use moment to format this as "MM/DD/YYYY")
          console.log(`\n#${index+1}\t${moment(event.datetime).format("MM/DD/YYYY")}`);
          // Name of the venue
          console.log(`\t@ ${event.venue.name}`);
          // Venue location
          console.log(`\t\tin ${event.venue.city}, ${event.venue.country}`);
        });
      }

      else { // unsuccessful request
        console.log("There was a problem with trying the search.\n", error);
        return;
      }
    });    
  },


  //* node liri.js spotify-this-song '<song name here>'
  "spotify-this-song": function(params) {
    //* Validate
    let searchTerm = params.join(" ").trim();
    if (!searchTerm) {
      // If no song is provided then your program will default to "The Sign" by Ace of Base.
      console.log("LIRI SPOTIFY needs a song for which to search.");
      console.log("Usage:\n\tliri spotify-this-song <song name>\n");
      console.log("Showing example results using 'The Sign' by Ace of Base\n");
      searchTerm = "The Sign Ace of Base";
    }

    console.log(`Up to 5 Spotify search results for song '${searchTerm}':`);

    spotify
      .search({
        type: 'track',
        query: searchTerm,
        limit: 5 })

      .then(function (response) {
        response.tracks.items.forEach( (track, index) => {
          // Artist(s)
          console.log(`\n#${index+1}\t'${track.name}'`);
          // The song's name
          // The album that the song is from
          console.log(`\tby '${track.artists[0].name}' on '${track.album.name}'`);
          // A preview link of the song from Spotify
          console.log(`\t30s preview: ${(track.preview_url || 'not available')}`);
        });
      })
      .catch(function (error) {
        console.log("There was a problem with trying the search.\n", error);
        return;
      });      
  },


  //* node liri.js movie-this '<movie name here>'
  "movie-this": function (params) {
    //* Validate
    let searchTerm = params.join(" ").trim();
    if (!searchTerm) {
      console.log("LIRI MOVIES needs a movie for which to search.");
      console.log("Usage:\n\tliri movie-this <movie name>\n");

      //* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
      console.log("Showing example using 'Mr. Nobody'\n");
      searchTerm = "Mr. Nobody";
    }

    console.log(`OMDB search result for movie '${searchTerm}':`);

    const queryURL = `http://www.omdbapi.com/?t=${encodeURIComponent(searchTerm)}&plot=short&apikey=${keys.omdb.key}`;

    request(queryURL, function (error, response, body) {
      // If the request is successful
      if (!error && response.statusCode === 200) {
        let movieObj = JSON.parse(body);
        if (movieObj.Response === 'False') {
            console.log(`Sorry, OMDB had a problem searching for '${searchTerm}':\n`, movieObj.Error);
            return;
        }
        //? console.log(movieObj);
        
        let RTRating = "";
        const RTindex = movieObj.Ratings.map(rating => rating.Source).indexOf('Rotten Tomatoes');
        if (RTindex >= 0) {
          RTRating = movieObj.Ratings[RTindex].Value;
        }

        //! 'Pre-formatted' output
        console.log(
`
    ${movieObj.Title}
    ${'-'.repeat(movieObj.Title.length)}
    Year              : ${movieObj.Year           || 'unknown'}
    Production Country: ${movieObj.Country        || 'unknown'}

    Language(s): ${movieObj.Language              || 'unknown'}
       Actor(s): ${movieObj.Actors                || 'unknown'}
       
    ${movieObj.Plot                               || '(No plot)'}

    IMDB            Rating: ${movieObj.imdbRating || 'unknown'}
    Rotten Tomatoes Rating: ${RTRating            || 'unknown'}
`);
      }

      else { // unsuccessful request
        console.log("There was a problem with trying the search.\n", error);
        return;
      }
    });
  },

  //* node liri.js do-what-it-says
  "do-what-it-says": function (params) {
    //* Validate
    let fileName = params.join(" ").trimLeft(); // trimLeft only, filenames can (unfortunately?) include trailing white space
    if (!fileName) {
      fileName = "random.txt";
    }
    // append .txt as file type, if no file type was included
    if (!fileName.includes('.')) { fileName += '.txt'; }

    console.log(`Using file '${fileName}' to execute LIRI commands.`);
    // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    fs.readFile(fileName, "utf8", function (error, data) {
      // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
      // Edit the text in random.txt to test out the feature for movie-this and concert-this.
      // If the code experiences any errors it will log the error to the console.
      if (error) {
        console.log(`There was a problem trying to read file '${fileName}'.\n`, error);
        return error;
      }

      // Split instructions by comma
      const instructions = data.split(",");
      //? console.log(instructions);

      let fileCommand = instructions[0];
      let fileParameters = instructions.slice(1);
      //? console.log(fileCommand, fileParameters);

      if (!Object.hasOwnProperty.call(LIRI_COMMANDS, fileCommand)) {
        console.log(`LIRI doesn't know how to '${fileCommand}'`);
        return; //? continue? with for loop over multiple instructions
      }
      LIRI_COMMANDS[fileCommand](fileParameters);
      // dataArr.forEach(function (movie) { console.log(movie) });
    });

  }
};
// Aliases
// LIRI_COMMANDS["concert-that"] = LIRI_COMMANDS["concert-this"];

const command = process.argv[2].toLowerCase();
if (command === undefined) {
  console.log(
    "Please provide LIRI a command from\n",
    Object.keys(LIRI_COMMANDS)
  );
  return;
}
if (!Object.hasOwnProperty.call(LIRI_COMMANDS, command)) {
  console.log(`LIRI doesn't know how to '${command}'`);
  console.log("LIRI knows how to\n", Object.keys(LIRI_COMMANDS));
  return;
}

const parameters = process.argv.slice(3);
LIRI_COMMANDS[command](parameters);