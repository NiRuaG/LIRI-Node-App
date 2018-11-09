# LIRI-Node-App
[__L__]anguage [__I__]nterpretation and [__R__]ecognition [__I__]nterface in Node

## To use LIRI App
You will need API Keys/Secrets for the following:  
- [Spotify](https://developer.spotify.com/documentation/web-api/quick-start/)
- [Bands in Town](https://manager.bandsintown.com/support/bandsintown-api)
- [OMDB](http://www.omdbapi.com/)  

Refer to the included `key.js` file and the [dotenv](https://www.npmjs.com/package/dotenv) npm documentation, to place the above in a `.env` file. 


## Demo Videos
* [DEMO Video 1 of 2](https://drive.google.com/open?id=1r1ySxxurHJ3MIHqnx8JxVikLiMSkTj_W)  
* [DEMO Video 2 of 2](https://drive.google.com/open?id=1MxrscEutHIL7SUCdmLITeRqiNj4lGz05)

## LIRI Commands
### 1. `CONCERT-THIS`  
This will search the *Bands in Town Artist's Events API* for an **ARTIST/BAND** and show information about their upcoming events.  
> `node liri.js concert-this <artist/band name here>`  

Example usage:  
> `node liri.js twenty one pilots`   

Example results:  
>  #1&nbsp;&nbsp;&nbsp;&nbsp;11/07/2018  
>  &nbsp;&nbsp;&nbsp;&nbsp;@ American Airlines Center  
>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in Dallas, United States  

### 2. `SPOTIFY-THIS-SONG`  
This will search *Spotify API* (via node-spotify-api package) for a **SONG** and show information about it.  
> `node liri.js spotify-this-song <song name here>`  

Example usage:  
> `node liri.js spotify-this-song The Sign Ace of Base`  

Example results:  
>  #1&nbsp;&nbsp;&nbsp;&nbsp;'The Sign'  
>  &nbsp;&nbsp;&nbsp;&nbsp;by 'Ace of Base' on 'The Sign (US Album) [Remastered]'  
>  &nbsp;&nbsp;&nbsp;&nbsp;30s preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=28e56df475a144cb91ff990b81c3bef8  

### 3. `MOVIE-THIS`  
This will search *OMDB API* for a **MOVIE** and show information about it.  
> `node liri.js movie-this <movie name here>`  

Example usage:  
> `node liri.js movie-this Mr. Nobody`  

Example results:  
> Mr. Nobody  
`----------`  
Year              : 2009  
Production Country: Belgium, Germany, Canada, France, USA, UK  
>  
>  Language(s): English, Mohawk  
   Actor(s): Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham  
>
>  A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.  
> 
> IMDB            Rating: 7.9  
> Rotten Tomatoes Rating: 67%`  

### 4. `DO-WHAT-IT-SAYS`  
This will execute other LIRI commands, as read from a text file.  
> `node liri.js do-what-it-says <file name here>`  

Example usage:  
> `node liri.js do-what-it-says random.txt`  

*Where `random.txt` contains:*  
> `spotify-this-song,"I Want it That Way"`  
