// Import Express
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser')
// Create an Express application
const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const authRouter = require("./routes/auth");
// 3. adding the routes
// app.use("/", indexRouter);
app.use("/auth", authRouter);

const genres = 
{
  "Action": 28,
  "Adventure": 12,
  "Animation": 16,//also applies to TV
  "Comedy":35,//also applies to TV
  "Crime":80,//also applies to TV
  "Documentary":99,//also applies to TV
  "Drama":18,//also applies to TV
  "Family":10751,//also applies to TV
  "Fantasy":14,
  "History":36,
  "Horror":27,
  "Music": 10402,
  "Mystery":9648,
  "Romance":10749,
  "Science Fiction":878, //End of Movies
  "Action & Adventure": 10759,
  "Kids": 10762,
  "Mystery": 9648,
  "News": 10763,
  "Reality":10764,
  "Sci-Fi & Fantasy": 10765,
  "Soap":10766,
  "Talk":10767,
  "War & Politics":10768,
  "Western":37
};
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTMxZDhlZDNlN2VlNDIzYTIxMmExM2JjMDk3ZGE1ZiIsInN1YiI6IjY2MGRhZDA0MzNhMzc2MDE2NDgxYmY5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BVSEvm-DQuLopub5JIYvTl9l5pcy_a-Ys_vX7BbhEpw'
    }
  };

app.get('/getLandingPageTv',async (req,res) => {
  const link = "https://api.themoviedb.org/3/discover/tv?"
  let showLink = "https://www.themoviedb.org/tv/"
  response = await fetch(link,options);
  if (response.ok)
  {
    const json = await response.json().then(arr => arr.results).then(results => results.map(tvShow=>({'name': tvShow.name,'link': showLink + tvShow.id,'posterImage': tvShow.poster_path})));
    res.send(json);
  }
  else
  {
    console.error("ERROR: " + response.status);
  }
  
}
);
function parseGenres(genres)
{
  pGenre = "";
  for(i = 0; i < genres.length; i++)
  {
    pGenre += genres[i] + "%2C";
  }
  pGenre = pGenre.slice(0,-3);
  return pGenre;
}
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.post('/sendGenres',async(req,res) => 
{
  const data = req.body;
  let genres = [];
  genres = req.body.genres;
  const link = "https://api.themoviedb.org/3/discover/"+req.body.medium+"?&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=";
  const tmdbTVQuery = link + parseGenres(genres);
  response = await fetch(tmdbTVQuery,options);
  
  if (response.ok)
  {
    if(req.body.medium == "tv")

    {
      const json = await response.json().then(arr => arr.results).then(results => results.map(tvShow=>({'name': tvShow.name,'year': tvShow.first_air_date,'description':tvShow.overview,'rating': tvShow.vote_average, 'posterImage': tvShow.poster_path})));
      res.send(json);
    }
    else if(req.body.medium == "movie")
    {
      const json = await response.json().then(arr => arr.results).then(results => results.map(movie=>({'name': movie.title,'year': movie.release_date,'description':movie.overview,'rating': movie.vote_average, 'posterImage': movie.poster_path})));
      res.send(json);
    }
    else
    {
      console.error("ERROR: " + "IDK how tf u got this error, it shoulda died way earlier");
      process.exit();
    }
  
  }
  else
  {
    console.error("ERROR: " + response.status);
    process.exit();
  }
  
})
app.get('/getLandingPageMovie',async(req,res) => {
  const link = "https://api.themoviedb.org/3/discover/movie?"
  const tmdbTVQuery = link;
  response = await fetch(tmdbTVQuery,options);
  let showLink = "https://www.themoviedb.org/movie/"
  if (response.ok)
  {
    const json = await response.json().then(arr => arr.results).then(results => results.map(tvShow=>({'name': tvShow.title,'link': showLink + tvShow.id,'posterImage': tvShow.poster_path})));
    res.send(json);
  }
  else
  {
    console.error("ERROR: " + response.status);
  }
  
})

tvID = 0; 
results = [];
currentPage = 1;

function splitCinema (string){
  string = string.replaceAll("%", "%25");
  string = string.replaceAll(" ", "%20");
  special_characters = ["!", "@", "#", "$", "^", "&", "*", "(", ")", "=", "+", "{", "}", "|", "[", "]", ",", "?", "'", "\"", "/", "<", ">", "`"];
  replacement = ["%21", "%40", "%23", "%24", "%5E", "%26", "%2A", "%28", "%29", "%3D", "%2B", "%7B", "%7D", "%7C", "%5B", "%5C", "%2C", "%3F", "%27", "%22", "%2F", "%3C", "%3E", "%60"];
  for (let i = 0; i < special_characters.length; i++) {
    string = string.replaceAll(special_characters[i], replacement[i]);
  }
  return string;
}
async function TMDBConnectionMovie(name) {
  if(name.length === 0) {
    return [];
  }
  link = "https://api.themoviedb.org/3/search/movie?query=";
  translatedMovie = splitCinema(name);
  const tmdbMovieQuery = link + translatedMovie + "&include_adult=false&language=en-US&page=1" 
  response = await fetch(tmdbMovieQuery, options);
  if(response.ok){
      const json = await response.json();
      const resultsLength = json.results.length; 
      if(resultsLength > 0){
        results = json.results.map(movie =>({'name': movie.title, 'year': movie.release_date, 'genre_ids': movie.genre_ids, 'description': movie.overview, 'rating': movie.vote_average, 'id': movie.id ,'posterImage': movie.poster_path}));
        return results;
      }
      else {
        return [];
      }
  }
  else{
      console.error("ERROR: " + response.status);
  }

}
async function TMDBConnectionTV(name) {
    if(name.length === 0) {
      return [];
    }
    link = "https://api.themoviedb.org/3/search/tv?query=";
    translatedTVShow = splitCinema(name);
    const tmdbTVQuery = link + translatedTVShow + "&include_adult=false&language=en-US&page=1" 
    response = await fetch(tmdbTVQuery, options);
    if(response.ok){
        const json = await response.json();
        const resultsLength = json.results.length; 
        if(resultsLength > 0){
          results = json.results.map(tvShow =>({'name': tvShow.name, 'year': tvShow.first_air_date, 'genre_ids': tvShow.genre_ids, 'description': tvShow.overview, 'rating': tvShow.vote_average, 'id': tvShow.id ,'posterImage': tvShow.poster_path}));
          return results;
        }
        else {
          return [];
        }
    }
    else{
        console.error("ERROR: " + response.status);
    }

}
// Define a route
app.get('/getMovieById/:movieId', async (req, res) => { 
  
  await fetch(`https://api.themoviedb.org/3/movie/${req.params.movieId}`, options).then(res => res.json()).then(movie=> {
      let genres = ' ';
      let movieLink = `https://www.themoviedb.org/movie/${req.params.movieId}`
       movie.genres.forEach(genre => {
        genres+= genre.name + " "
       });
      res.json(({name: movie.original_title, rating: movie.vote_average, genre: genres, description: movie.overview, link: movieLink}))
    })
});
app.get('/getTvById/:tvId', async (req, res) => { 
  
    await fetch(`https://api.themoviedb.org/3/tv/${req.params.tvId}`, options).then(res => res.json()).then(tv=> {
        let genres = ' '
        let tvLink = `https://www.themoviedb.org/tv/${req.params.tvId}`
        tv.genres.forEach(genre => {
            genres+= genre.name + " "
        })
        res.json({name: tv.name, rating: tv.vote_average, genre: genres, description: tv.overview, link: tvLink})
    })
}
);
app.get('/getMovies/:movieName', async (req, res) => { 
    response = await TMDBConnectionMovie(req.params.movieName);
    res.send(response);
});
app.get('/getTVShows/:tvName', async (req, res) => { 
  response = await TMDBConnectionTV(req.params.tvName);
  res.send(response);
});
app.get('/getMovieProvider/:movieID', async(req,res)=>{//movieID is a num //TODO PUT THE ID IN THE OTHER JSONS
  const movieQuery = "https://api.themoviedb.org/3/movie/"+req.params.movieID+"/watch/providers";
  response = await fetch(movieQuery,options);
  if (response.ok)
  {
    const json = await response.json().then(arr => arr.results).then(results => results.US).then(movie=> ({'buy': movie.buy.map(ob => ob.provider_name),'flatrate': movie.buy.map(ob => ob.provider_name),'rent':movie.buy.map(ob => ob.provider_name)}));
    res.send(json);
  }
  else
  {
    console.error("ERROR: " + response.status);
  }
});
// Start the server
const start = async () => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

const mongoose = require("mongoose");
// connecting to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection is established successfully! 🎉");
  });

//testing for MongoDB-------------------------------------------------------
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("test");
const coll = db.collection("users");

async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("test");
    const names = db.listCollections();

    const coll = db.collection("users");
    // find code goes here
    const cursor = coll.find();
    // iterate code goes here
  
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
//-------------------------------------------------------------------------------------

start();

module.exports = {
  app: app,
  sC: splitCinema,
  connectTV: TMDBConnectionTV,
  connectMovie: TMDBConnectionMovie
};
 