import React from 'react';
import Navbar from '../components/Navbar.js'
import Searchbar from '../components/Searchbar.js'
import style from '../styles/MediaPage.module.css';
import Carousel from '../components/Carousel.js'

//Function to display our TV shows page, which has a search bar and displays top rated TV shows in a carousel.
function TVShows() {
    
    return(
        <div className={style.container}>
            <Navbar>
            </Navbar>
            <Searchbar medium = "tv"  className={style.search}/>
            <Carousel medium = "tv" carouselType = "Top Rated Shows" className = {style.stretched}/>
            
        </div>
    )
}

export default TVShows;