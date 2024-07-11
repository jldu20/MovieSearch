import React from 'react';
import { Button, AppBar, Toolbar, Typography, ThemeProvider, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import theme from '.././hooks/useTheme.js'
import style from '../styles/Navbar.module.css';
import { useNavigate } from "react-router-dom";
import { cuteToast } from 'cute-alert'

//Function to render the navbar, with logic to switch between login and profile pages based on whether the user is logged in.
function Navbar() {
  const navigate = useNavigate();
  const profileMargin = localStorage.getItem("token") ? '300px' : '800px';
  const profilePage = localStorage.getItem("token") ? "Profile": "Login/Signup"
  function onClick() {
    localStorage.clear()
    cuteToast({
      type: 'success',
      title: `Logged out`,
      description: `Successfully logged out!`,
      timer: 2000
      })
    navigate("/")
  }
  return (
    <div>
    <ThemeProvider theme={theme}>
    <AppBar position="static" color = "primary" >
      <Toolbar>
        <Link className = {style.links} to="/">
        <Typography variant="h5">MovieSearch</Typography>
        </Link>
        <Link className = {style.links} to="/tv-shows">
        <Button color="inherit" style={{ marginLeft: '40px' }}>TV Shows </Button>
        </Link>
        <Link className = {style.links} to="/movies">
        <Button color="inherit" style={{ marginLeft: '40px' }}>Movies </Button>
        </Link>
        <Button color="inherit" style={{ marginLeft: profileMargin }}> </Button>
        {localStorage.getItem("token")? 
          (
          <div className = {style.accs}>
          <Link className = {style.login} to="/profile">
            <Button color="inherit" style={{marginLeft: '20px'}}>{profilePage} </Button>
          </Link>
            <Link className = {style.login} to="/">
              <Button onClick = {onClick} color="inherit" style={{marginLeft: '20px'}}>Logout </Button>
          </Link>
          </div>
          ) :
          (<Link className = {style.login} to="/login">
            <Button color="inherit" style={{marginLeft: '20px'}}>{"Login/Signup"} </Button>
          </Link>) 
        }
      </Toolbar>
    </AppBar>
    </ThemeProvider>
  </div>
  );
}

export default Navbar;
