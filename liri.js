//#region NPM
const ENV = require("dotenv").config();
console.log({ ENV });

let request = require("request");
//#endregion

//#region LOCAL Modules
const keys = require("./keys");
console.log({ keys });
//#endregion

const LIRI_COMMANDS = {
  "concert-this": (function() {
    console.log("CONCERT");
    // node liri.js concert-this <artist/band name here>

    // This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:

    // Name of the venue

    // Venue location

    // Date of the Event (use moment to format this as "MM/DD/YYYY")
  })(),
  "spotify-this-song": {},
  "movie-this": {},
  "do-what-it-says": {}
};
// Aliases
LIRI_COMMANDS["concert-that"] = LIRI_COMMANDS["concert-this"];

const command = process.argv[2];
if (command === undefined) {
  console.log(
    "Please provide LIRI a command from,",
    Object.keys(LIRI_COMMANDS)
  );
  return;
}
if (!Object.hasOwnProperty.call(LIRI_COMMANDS, command)) {
  console.log(`LIRI doesn't know how to '${command}'`);
  console.log("LIRI knows how to", Object.keys(LIRI_COMMANDS));
}

LIRI_COMMANDS[command];
