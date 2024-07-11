import React from 'react';
import Navbar from '../components/Navbar.js'
import Searchbar from '../components/Searchbar.js'
import Carousel from '../components/Carousel.js'
import style from '../styles/MediaPage.module.css';
//Function to display our movies page, which has a search bar and displays top rated movies in a carousel.
function Movies() {

    return (
        <div className={style.container}>
            <Navbar>
            </Navbar>
            <Searchbar medium = "movie" className={style.search}/>
            <Carousel medium = "movie" carouselType = "Top Rated Movies" className = {style.stretched}/>
        </div>
    )
}

export default Movies;