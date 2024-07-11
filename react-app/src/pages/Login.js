import React, { useState } from 'react';
import Navbar from '../components/Navbar.js'
import LoginPage, { Username, Password, Submit, Title, Logo } from '@react-login-page/base';
import style from '../styles/Login.module.css';
import { useNavigate } from "react-router-dom";

//Function to display the user login page, with logic to handle user login and token storage.
function UserLoginPage() {
    document.body.style = 'background: #2c3338;';
    const [userName, setUserName] = useState(' ');
    const [password, setPassword] = useState(' ');
    const navigate = useNavigate();
    if(localStorage.getItem("token")) {
        navigate("/profile")
    }
    function saveStateUsername(event) {
        setUserName(event.target.value)
    }
    function saveStatePassword(event) {
        setPassword(event.target.value)
    }
    async function submitLogin() {
        const response = await fetch(`http://localhost:3001/auth/signin`, {
            method: 'POST',
            body: JSON.stringify({email: userName, password: password}),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json())
        if(response.type == "success") {
            localStorage.setItem("userName", userName)
            localStorage.setItem("token", response.accesstoken);
            navigate("/")
        }
    }
    return (
        <div>
            <Navbar></Navbar>
            <LoginPage>
                <Username onChange={saveStateUsername} name="userUserName" />
                <Password onChange={saveStatePassword} placeholder="Password" name="userPassword" />
                <Submit onClick={submitLogin}> Submit</Submit>
                <Title />
                <Logo>
                </Logo>
            </LoginPage>
            <p className = {style.register}><a className = {style.register} href="/register">Not registered? Register here</a></p>
        </div>
      );
    };
export default UserLoginPage;
