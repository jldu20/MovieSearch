import React, { useState } from 'react';
import { Search } from '@mui/icons-material';
import { TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import style from '../styles/Searchbar.module.css';
import { useNavigate } from "react-router-dom";
import GenreFilter from './GenreFilter.js';
import {movieGenres, tvGenres} from '../utils/genres.js';

//Function to render a searchbar, taking in a medium (TV or movie) to filter searches by.
function Searchbar(props) {
    const [multimediaTerm, setMultimediaTerm] = useState(' ');
    const [movieList, setMovieList] = useState(' ');
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();
    let pageName = "";
    let medium = "movie";
    switch(props.medium) {
      case "movie":
        pageName = "Movie Search";
        break;
      case "tv":
        pageName = "TV Search";
        break;
      default:
        pageName = "Search";
        break;
    }

    if(props.medium == "tv") {
      medium = "TV"
    }
    async function getMovies(movieName) {
      let url = ""
      if(props.medium == "movie") {
        url = `http://localhost:3001/getMovies/${movieName}`
      }
      else {
        url = `http://localhost:3001/getTVShows/${movieName}`
      }
      const response = await fetch(url);
      const json = await response.json().then(results => results.filter(media => {
        let check = true;
        if(genres.length > 0) {
          if(props.medium == "movie") {
            genres.forEach(genre => {
              if(!(media.genre_ids.includes(movieGenres[genre.value]))) {
                check = false
              }
            })
          }
          else {
            genres.forEach(genre => {
              if(!(media.genre_ids.includes(tvGenres[genre.value]))) {
                check = false
              }
            })
          }
        }
        return check
      }
    )).then(results => results.map(movie => {
      return {'name': movie.name, 'year': movie.year, 'description': movie.description, 'rating': movie.rating, 'genres': movie.genre_ids, 'img': movie.posterImage, 'url': `https://www.themoviedb.org/${props.medium}/${movie.id}`, 'id': movie.id, "medium":medium }; 
    }));

      return json;
    }

    async function keyPress(event) {
        if(event.key === "Enter") {
          event.preventDefault();
          let movies = await getMovies(multimediaTerm);
          setMovieList(movieList);
          navigate("/results", { state: { "movies": movies } });
        }
    }
    function saveState(event) {
        setMultimediaTerm(event.target.value)
    }
    async function onClick() {
      let movies = await getMovies(multimediaTerm);
      setMovieList(movieList);
      navigate("/results", { state: { "movies": movies } });
    }

    function genreOnChange(genreList) {
      setGenres(genreList)
    }
    return (
        <div className = {style.searchbar}>
          <h1 className={style.pagetitle}> {pageName} </h1>
          <TextField className={style.textField}
            placeholder="Search"
            variant="outlined"
            onChange={saveState}
            onKeyDown={keyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={onClick}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <GenreFilter onChange = {genreOnChange} medium = {props.medium}/>
        </div>
      );
}
export default Searchbar