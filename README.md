# LIRI-Node-App
[__L__]anguage [__I__]nterpretation and [__R__]ecognition [__I__]nterface in Node

## To use LIRI App
You will need API Keys/Secrets for the following:  
- [Spotify](https://developer.spotify.com/documentation/web-api/quick-start/)
- [Bands in Town](https://manager.bandsintown.com/support/bandsintown-api)
- [OMDB](http://www.omdbapi.com/)  

Refer to the included `key.js` file and the [dotenv](https://www.npmjs.com/package/dotenv) npm documentation, to place the above in a `.env` file. 

## LIRI Commands
### 1. `CONCERT-THIS`  
This will search the *Bands in Town Artist's Events API* for an **ARTIST/BAND** and show information about their upcoming events.  
> `node liri.js concert-this <artist/band name here>`  

Example usage:  
> `node liri.js twenty-one pilots`   

Example results:  
> ``  

### 2. `SPOTIFY-THIS-SONG`  
This will search *Spotify API* (via node-spotify-api package) for a **SONG** and show information about it.  
> `node liri.js spotify-this-song <song name here>`  

Example usage:  
> `node liri.js spotify-this-song The Sign Ace of Base`  

Example results:  
> ``  

### 3. `MOVIE-THIS`  
This will search *OMDB API* for a **MOVIE** and show information about it.  
> `node liri.js movie-this <movie name here>`  

Example usage:  
> `node liri.js movie-this Mr. Unknown`  

Example results:  
> ``  

### 4. `DO-WHAT-IT-SAYS`  
This will execute other LIRI commands, as read from a text file.  
> `node liri.js do-what-it-says <file name here>`  

Example usage:  
> `node liri.js do-what-it-says random.txt`  

*Where `random.txt` contains:*  
> `spotify-this-song,"I Want it That Way"`  
