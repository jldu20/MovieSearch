import React from 'react';
import style from '../styles/Searchbar.module.css';

//Function to display the landing page "Welcome" component.
function Landing() {
    return (
        <div className = {style.welcome}>
            <h1 className={style.pagetitle}> Welcome! </h1>
        </div>
      );
}
export default Landing;