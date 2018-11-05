// console.log('keys.js is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bandsintown = {
  id: process.env.BANDS_IN_TOWN_ID
};

exports.omdb = {
  key: process.env.OMDB_KEY
}