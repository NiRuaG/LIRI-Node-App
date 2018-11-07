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

const logThis = (content, alsoToConsole=true) => {
  if (alsoToConsole) {
    console.log(content);
  }

  fs.appendFile("log.txt", content+'\n', function(err) {
    if (err) {
      console.log("Error writing to log.txt file:\n", err);
    }
  });
}

const LIRI_COMMANDS = {


  //% node liri.js concert-this <artist/band name here>
  //* This will search the Bands in Town Artist Events API for an ARTIST/BAND and show information about their upcoming events
  "concert-this": function(params) {

    //* params - Validate / Manipulate
    let searchTerm = params.join(" ").trim();
    if (!searchTerm) {
      logThis("LIRI CONCERT needs an artist or band name for which to search.");
      console.log("Usage:\n\tliri concert-this <artist/band>");

      //! no default search, return from call
      return;
    }

    console.log(`\nConcert events for '${searchTerm}':`);

    const queryURL = `https://rest.bandsintown.com/artists/${encodeURIComponent(searchTerm)}/events?app_id=${keys.bandsintown.id}`;
    // console.log(queryURL);

    request(queryURL, function(error, response, body) {

      //* Successful Request
      if (!error && response.statusCode === 200) {
        //* body - Catch API return warnings
        if (body.startsWith("{warn=")) {
          logThis(`Bands In Town returned with warning:\n\t${body.slice(6, -2)}`);
          return;
        }

        let events;
        //* events - Try/Catch JSON
        try {
          events = JSON.parse(body);
        }
        catch(error) {
          logThis(`Sorry, LIRI could not understand what Band In Town returned:\n\t${body}\n\t${error}`);
          return;
        }
        // console.log(events);

        //* events - Edge Cases
        if (events.length === 0) {
          logThis(`Sorry, no upcoming events were found for '${searchTerm}'.`);
          return;
        }

        //* Typical Case
        //TODO: pagination?
        events.forEach( (event, index) => {
          const outputFormat = 
            `\n#${index+1}`
          // Date of the Event (use moment to format this as "MM/DD/YYYY")
          + `\t${moment(event.datetime).format("MM/DD/YYYY")}\n`
          // Name of the venue
          + `\t@ ${event.venue.name}\n`
          // Venue location
          + `\t\tin ${event.venue.city}, ${event.venue.country}`;

           logThis(outputFormat);
        });
      }

      //* Unsucessful Request
      else {
        logThis("There was a problem with trying the search.\n", error);
        return;
      }

    });    
  },


  //% node liri.js spotify-this-song '<song name here>'
  //* This will search Spotify API (via node-spotify-api package) for a SONG and show information about it
  "spotify-this-song": function(params) {

    //* params - Validate / Manipulate
    let searchTerm = params.join(" ").trim();
    if (!searchTerm) {
      console.log("LIRI SPOTIFY needs a song for which to search.");
      console.log("Usage:\n\tliri spotify-this-song <song name>\n");

      //! If no song is provided, then program will default to "The Sign" by Ace of Base.
      console.log("Using example song 'The Sign' by Ace of Base\n");
      searchTerm = "The Sign Ace of Base";
    }

    console.log(`\nUp to 5 Spotify search results for song '${searchTerm}':`);

    spotify
      .search({
        type: 'track',
        query: searchTerm,
        limit: 5 })

      .then(function (response) {
        //* response - Edge Cases
        if (response.tracks.items.length === 0){
          logThis(`Sorry, no results were found for '${searchTerm}'.`);
          return;
        }

        //* Typical Case
        response.tracks.items.forEach( (track, index) => {
          const outputFormat = 
            `\n#${index+1}`
          // The song's name
          + `\t'${track.name}'`
          // Artist(s) & The album that the song is from
          + `\tby '${track.artists[0].name}' on '${track.album.name}'`
          // A preview link of the song from Spotify
          + `\t30s preview: ${(track.preview_url || 'not available')}`;
          
          logThis(outputFormat);
        });
      })
      .catch(function (error) {
        logThis("There was a problem with trying the search.\n", error);
        return;
      });      
  },


  //% node liri.js movie-this '<movie name here>'
  //* This will search OMDB API for a MOVIE and show information about it
  "movie-this": function (params) {

    //* params - Validate / Manipulate
    let searchTerm = params.join(" ").trim();
    if (!searchTerm) {
      console.log("LIRI MOVIES needs a movie for which to search.");
      console.log("Usage:\n\tliri movie-this <movie name>\n");

      //! If no movie is provided, the program will output data for the movie 'Mr. Nobody.'
      console.log("Using example movie 'Mr. Nobody'\n");
      searchTerm = "Mr. Nobody";
    }

    console.log(`\nOMDB search result for movie '${searchTerm}':`);

    const queryURL = `http://www.omdbapi.com/?t=${encodeURIComponent(searchTerm)}&plot=short&apikey=${keys.omdb.key}`;
    //console.log(queryURL);

    request(queryURL, function (error, response, body) {

      //* Successful Request
      if (!error && response.statusCode === 200) {
        let movieObj
        //* movieObj - Try/Catch JSON
        try {
          movieObj = JSON.parse(body);
        }
        catch(error) {
          logThis("Sorry, LIRI could not understand what OMDB returned:\n", body, error);
          return
        }

        //* movieObj - Edge Cases
        if (movieObj.Response === 'False') {
            logThis(`Sorry, OMDB had a problem searching for '${searchTerm}':\n`, movieObj.Error);
            return;
        }
        // console.log(movieObj);
        
        //* Typical Case
        let RTRating = "";
        const RTindex = movieObj.Ratings.map(rating => rating.Source).indexOf('Rotten Tomatoes');
        if (RTindex >= 0) {
          RTRating = movieObj.Ratings[RTindex].Value;
        }

        const outputFormat =
          `\n${movieObj.Title}`
        + `\n${'-'.repeat(movieObj.Title.length)}`

        + `\nYear              : ${movieObj.Year           || 'unknown'}`
        + `\nProduction Country: ${movieObj.Country        || 'unknown'}`

        + `\nLanguage(s): ${movieObj.Language              || 'unknown'}`
        + `\n   Actor(s): ${movieObj.Actors                || 'unknown'}`

        + `\n${movieObj.Plot                               || '(No plot)'}`

        + `\nIMDB            Rating: ${movieObj.imdbRating || 'unknown'}`
        + `\nRotten Tomatoes Rating: ${RTRating            || 'unknown'}`;

        logThis(outputFormat);
      }

      //* Unsuccessful Request
      else { 
        logThis("There was a problem with trying the search.\n", error);
        return;
      }

    });
  },

  //% node liri.js do-what-it-says
  //* This will execute the other commands as read from a text file.
  "do-what-it-says": function (params) {

    //* params - Validate / Manipulate
    let fileName = params.join(" ").trimLeft(); // trimLeft only, filenames can (unfortunately?) include trailing white space
    if (!fileName) {
      console.log(
         "\nLIRI FROM-FILE can take an optional file name."
        +"\nUsage:\n\tliri do-what-it-says <file name>\n");
      //! default to random.txt as file
      console.log("Using default file 'random.txt'\n");
      fileName = "random.txt";
    }

    //* fileName - Manipulate
    // append .txt as file type, if no file type was included
    if (!fileName.includes('.')) { fileName += '.txt'; }

    console.log(`Using file '${fileName}' to execute LIRI commands.`);

    fs.readFile(fileName, "utf8", function (error, data) {
      if (error) {
        logThis(`There was a problem trying to read file '${fileName}'.\n`, error);
        return error;
      }

      // Split instructions by comma
      const instructions = data.split(",");
      // console.log(instructions);
      let fileCommand = instructions[0];
      if (!fileCommand || !fileCommand.trim()) {
        logThis("Could not find a command in file.\n", data);
        return;
      }

      fileCommand = fileCommand.trim().toLowerCase();
      if (!Object.hasOwnProperty.call(LIRI_COMMANDS, fileCommand)) {
        logThis(`LIRI doesn't know how to '${fileCommand}'`);
        return; //? continue? with for loop over multiple instructions
      }
      //* fileCommand - Edge Cases
      if (fileCommand === "do-what-it-says") {
        logThis(`Sorry, LIRI can't (or won't) chain 'do-what-it-says' commands from file.`);
        return;
      }

      let fileParameters = instructions.slice(1);
      // console.log(fileCommand, fileParameters);
      const logMessage = `${fileCommand},${fileParameters.join(" ")}`;
      logThis(logMessage + `\n${'-'.repeat(logMessage.length)}`, false);

      LIRI_COMMANDS[fileCommand](fileParameters);
    });
  }
};
//// Aliases
//// LIRI_COMMANDS["concert-that"] = LIRI_COMMANDS["concert-this"];

// #region START OF EXECUTION
let command = process.argv[2];
if (command === undefined) {
  console.log(
    "Please provide LIRI a command from\n",
    Object.keys(LIRI_COMMANDS)
  );
  return;
}

command = command.toLowerCase();
if (!Object.hasOwnProperty.call(LIRI_COMMANDS, command)) {
  console.log(`LIRI doesn't know how to '${command}'`);
  console.log("LIRI knows how to\n", Object.keys(LIRI_COMMANDS));
  return;
}

const parameters = process.argv.slice(3);
const logMessage = `${command},${parameters.join(" ")}`;
logThis(logMessage + `\n${'-'.repeat(logMessage.length)}`, false);


LIRI_COMMANDS[command](parameters);
// #endregion START OF EXECUTION