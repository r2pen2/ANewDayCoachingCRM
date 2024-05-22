// Library Imports
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import { Button } from '@mantine/core';

// API Imports
import { auth } from '../api/firebase';

// Component Imports
import logo from '../assets/images/logo.png';


// const GoogleIcon = () => <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" style={{ width: 30, aspectRatio: "1/1", marginRight: 10, userSelect: "none" }} />

export default function Login() {
  
  /** Handle sign in with Google auth provider */
  async function signIn() {
    // Sign in with Google
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, new GoogleAuthProvider()).then((result) => { resolve(result); }).catch((error) => { console.error(error); })
    })
  }

  return (
    <div className='d-flex flex-column align-items-center justify-content-center vh-100'>
        <img src={logo}  alt="a-new-day-coaching-logo" style={{maxWidth: 300}}/>
        <Button color="#647659" onClick={signIn}>
            Sign In With Google
        </Button>
    </div>
  )
}
