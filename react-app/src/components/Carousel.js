import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel'
import { Button } from '@mui/material'

import style from '../styles/Carousel.module.css'

//Function to get a list of movies/TV shows from the API
async function getList(url) {
    const response = await fetch(url);
    const json = await response.json()
    return json;
}

//Function to display the created carousel, taking in a medium (TV or movie) and a carousel type.
function ShowCarousel(props) {
    const [items, setItems] = useState([])
    let url = props.medium == "tv"? "http://localhost:3001/getLandingPageTv": "http://localhost:3001/getLandingPageMovie";
    useEffect( ()=> {
        async function getItems() {
            let response = await getList(url);
            setItems(response)
        }
        getItems();
    }, [])
    let pages = [];
    for (let i = 0; i < 18; i++) {
        let pg = items.slice(i, Math.min(18, i+10));
        if (pg.length < 10) {
            pg = pg.concat(items.slice(0, 10 - pg.length));
        }
        pages.push(pg);
    };

    return (
        <div className={style.carouselContainer}>
        <Carousel sx={{ overflowY: 'hidden', overflowX: 'visible', height: '355px'}} swipe = {true} animation = {"fade"} autoPlay={true} >
            {
                pages.map((page, i) => <Page item={page} carouselType={props.carouselType} />)
            }
        </Carousel>
        </div>
    )
}

//Function to render a page of items in the carousel.
function Page(props) {
    return (
        <div className={style.page}>
            <h1>{props.carouselType}</h1>
            {
                props.item.map((item, i) => <Item key={i} item={item} />)
            }
        </div>
    )

}

//Function to render an item in the carousel.
function Item(props) {
    return (
            <Button className={style.page}>
                <a href = {props.item.link}> 
                    <img style = {{style: "285px"}} src={"https://image.tmdb.org/t/p/w154/" + props.item.posterImage} alt="Image" className={style.button}/>
                </a>
            </Button>
    )
}

export default ShowCarousel;


