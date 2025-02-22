
import {auth} from "../firebase"
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = (e) => {

        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(true)
            });

    }

    return ( 
        <div className="login-page-container">
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <div className="login-button">
                <button type="submit"> Login </button>
                </div>
                {error && <span>Wrong</span>}
            </form>
        </div>

    )
}