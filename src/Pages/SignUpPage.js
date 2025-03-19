import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";

export default function SignUpPage() {

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = (e) => {

        e.preventDefault();

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User created succesfully.")
            navigate("/")

            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            setError("Error creating user.");
            

            
        });

    }

    return ( 
        <div className="login-page-container">

            <h1>Sign Up Page</h1>

            <form onSubmit={handleSignUp}>
                <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div style={{width:"10rem", height:"2rem"}} className="sign-button">
                <button style={{width:"90%", height:"80%"}}type="submit"> Sign up </button>
                </div>
                {(error != null) && <span style={{color:"red"}}>{error}</span>}
                <p>Click the link to return to login page. <Link to="/">Click</Link></p>
            </form>
        </div>

    )
}