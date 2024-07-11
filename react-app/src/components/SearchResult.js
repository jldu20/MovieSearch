import React from 'react';
import style from '../styles/Result.module.css';
import { cuteToast } from 'cute-alert'

//Function to render a search result, taking in a name, year, genre, rating, description, and image, URL, and medium.
//If there is no image, a default image is used. If the user is logged in, they can add the show/movie to their favorites list.
function SearchResult(props){
    let baseImgUrl = "https://image.tmdb.org/t/p/w154/" + props.img;
    if(props.img == null || props.img.length === 1) {
        baseImgUrl = "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
    }

    //Add a show/movie to the user's list of favorites.
    async function addToFavorite() {
        const response = await fetch(`http://localhost:3001/auth/addFavorite`, {
            method: 'POST',
            body: JSON.stringify({email: localStorage.getItem("userName"), contentId: props.id, contentType: props.medium}),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json()).then(alt => {
                    alt.type == "success"? 
                    cuteToast({
                    type: 'success',
                    title: `${props.name} Added!`,
                    description: `Added ${props.name} to favorites`,
                    timer: 2000
                    }) : 
                    cuteToast({
                        type: 'error',
                        title: `${props.name} already clicked`,
                        description: `${props.name} is already on your favorites`,
                        timer: 2000
                    })
            }
        ) 
    }

    return(

        <div className = {style.container}>
            <div className = {style.coverArt}>
                <a href = {props.url}>
                    <img className = {style.pic} src= {baseImgUrl} alt = "pretty pic :)"></img>
                </a>
            </div>

            <div className = {style.info}> 
                <div className = {style.name}><h1>{props.name}</h1></div>
                <div className = {style.date}><h2>{props.year}</h2></div>
                <div className = {style.genre}><h2>{props.genre}</h2></div>
                <div className = {style.rating}><h2>{props.rating}</h2></div>
            </div>

            <div className = {style.misc}>
                { localStorage.getItem("token") && (<p onClick = {addToFavorite} className = {style.favorite}> Add to favorite</p>)}
                <div className={style.description}><p>{props.description}</p></div>

            </div>
            
        </div>
    )
}

export default SearchResult
