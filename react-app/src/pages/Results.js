import React from 'react';
import Navbar from '../components/Navbar.js'
import SearchResult from '../components/SearchResult.js'
import { useLocation } from "react-router-dom";
import {genreIDs} from '../utils/genres.js';
import style from '../styles/Result.module.css';
import { useNavigate } from "react-router-dom";

//Function to display all search results, giving an image, some tags, and a description for each show/movie.
function Results() {
    let location = useLocation();
    let movies = []
    let navigate = useNavigate();
    if(location.state) {
        movies = location.state.movies;
    }
    else {
        navigate(0)
    }
    if(movies.length === 0) {
        movies = [{name: "No TV shows were found", year: " ", description: " ", rating: " ", genres: [], img: " "}]
    }
    return (
        <div className={style.resultsPage}>
            <Navbar/>
            {
            movies.map(movie => {
                let genres = "";
                movie.genres.forEach(genreId => {
                    genres += genreIDs[genreId] + " ";
                })
                return <SearchResult key = {movie.id} id = {movie.id} name = {movie.name} year = {movie.year} description = {movie.description} rating = {movie.rating} genre = {genres} img = {movie.img} url = {movie.url} medium = {movie.medium}/>
            })}
        </div>
    )
}

export default Results;