import { db } from "../firebase";
import { auth } from "../firebase";
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";


export default function MainPage() {



    const fetchNotes = async() =>{
    
    const user = auth.currentUser;
    if (user) {

        const q = query(collection(db, "classes"), where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
        
    } else {
        console.error("User not logged in.");
        return [];
    }
    };



    return (
        <div>
            <p>hi</p>
        </div>
    );
}