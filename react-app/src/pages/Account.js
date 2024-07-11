import React from 'react';
import Navbar from '../components/Navbar.js'
import style from '../styles/Profile.module.css';
import MediaTable from '../components/MediaTable.js'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

//Function to display the user's profile page, showing the user's favorite movies and TV shows in a table.
function Account(props) {
    const navigate = useNavigate();
    let list = []
    const [movies, addMovies] = useState([])
    const [tvs, addTvs] = useState([])

    async function getFavorites() {
        const response = await fetch(`http://localhost:3001/auth/favorites/?email=${localStorage.getItem("userName")}`).then(res => res.json())
            let movieIds = response.data.favorite_movies 
            let tvIds = response.data.favorite_TVs;
    
            const moviePromises = movieIds.map(async id => {
                return await fetch(`http://localhost:3001/getMovieById/${id}`).then(res => res.json())
            })
            const tvPromises = tvIds.map(async id => {
                return await fetch(`http://localhost:3001/getTvById/${id}`).then(res => res.json())
            })
            const movieData = await Promise.all(moviePromises)
            const tvData = await Promise.all(tvPromises)
            setTimeout(() => {
                console.log(tvData);
            }, 5000); 
            addTvs([...tvs, ...tvData]);
            addMovies([...movies, ...movieData])
        // });
    }
        useEffect(() => {
            if(localStorage.getItem("token")) {
                getFavorites();
            }
            else {
                navigate("/")
            }
        }, []) 
    return (
        <div className = {style.background}>
            <Navbar>
            </Navbar>
            <h1 className = {style.banner}> {localStorage.getItem("userName")}'s Profile Page</h1>
            <div className = {style.tables}>
                <MediaTable media = "Movie" imgLeft = "true" tableTitle="Your Favorited Movies:" list = {movies} className = {style.table}></MediaTable>
                <MediaTable media = "TV Show" tableTitle="Your Favorited TV Shows:" list = {tvs}> className = {style.table}</MediaTable>
            </div>
        </div>
    )
}

export default Account;