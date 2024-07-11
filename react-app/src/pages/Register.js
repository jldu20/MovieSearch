import React, { useState, useEffect, useRef  } from 'react';
import Navbar from '../components/Navbar.js'
import LoginPage, { Username, Password, Submit, Title, Logo } from '@react-login-page/base';
import style from '../styles/Login.module.css';
import { useNavigate } from "react-router-dom";
import { cuteToast } from 'cute-alert'

//Function to display the registration page, with logic to handle user login and token storage.
function Register() {
    const headerRef = useRef(null);
    document.body.style = 'background: #2c3338;';
    useEffect(() => {
        const delay = 100; // Adjust delay as needed
        setTimeout(() => {
            const xpath = '//*[@id="root"]/div/div/div[2]/div/header/div[2]';
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (result) {
                result.textContent = "Register"; // Change the text content here
            } else {
                console.log('Element not found');
            }
        }, delay);
    }, []); 
    const [userName, setUserName] = useState(' ');
    const [password, setPassword] = useState(' ');
    const navigate = useNavigate();
 
    function saveStateUsername(event) {
        setUserName(event.target.value)
    }
    function saveStatePassword(event) {
        setPassword(event.target.value)
    }
    async function submitLogin() {
        const response = await fetch(`http://localhost:3001/auth/signup`, {
            method: 'POST',
            body: JSON.stringify({email: userName, password: password}),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json())
        if(response.type == "success") {
            cuteToast({
                type: 'success',
                title: `Registered!`,
                description: `Please login with your new account.`,
                timer: 2000
            }) 
            navigate("/login")
        }
    }
    // var xpath = '//*[@id="root"]/div/div/div[2]/div/header/div[2]';
    // var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).singleNodeValue;
    // console.log(result.textContent);
    return (
        <div>
            <Navbar></Navbar>
            <LoginPage>
                <Username onChange={saveStateUsername} name="userUserName" />
                <Password onChange={saveStatePassword} placeholder="Password" name="userPassword" />
                <Submit onClick = {submitLogin}>Register</Submit>
                <Title />
                <Logo>
                </Logo>
            </LoginPage>
            <p className = {style.register}><a className = {style.register} href="/login">Already registered? Login here</a></p>
        </div>
      );
    };
export default Register;
