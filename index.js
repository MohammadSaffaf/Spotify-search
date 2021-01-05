require('dotenv').config()
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5521;
app.use(express.static('public'))

const path = require('path');
app.set('view engine', 'ejs')
const SpotifyWebApi = require('spotify-web-api-node');
// console.log(process.env.CLIENT_ID);

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  


app.get('/', (req, res) => {
    res.render('index', { title: "Homepage" })
})

app.get("/artist-search", (req, res) => {
  spotifyApi
      .searchArtists(req.query.SearchArtist)
      .then(data => {
          const spotifysearch = data.body.artists.items;
          console.log('The received data from the API: ', spotifysearch);

          res.render("artist", { spotifysearch , title: "Artistpage" });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums-search", (req, res,next) => {
spotifyApi.getArtistAlbums('fe45bf78c6114c3687683b4aeffe7187').then(
  function(data) {
    console.log('Artist albums', data.body);
  },
  function(err) {
    console.error(err);
  }
);
})

// app.get("/albums-search", (req, res) => {
//   spotifyApi
//       .searchAlbums(req.query.SearchAlbums)
//       .then(data => {
//           const spotifyAlbums = data.body.albums.items;
//           console.log('The received data from the API: ', spotifyAlbums);

//           res.render("albums", { spotifysearch , title: "Albumspage" });
//       })
//       .catch(err => console.log('The error while searching albums occurred: ', err));
// })



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));