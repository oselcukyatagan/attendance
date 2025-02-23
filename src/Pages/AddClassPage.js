import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { useNavigate } from "react-router-dom";

export default function AddClassPage() {

    const [classCode, setClassCode] = useState("");
    const [className, setClassName] = useState("");
    const [classHours, setClassHours] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAdd = async (e) => {

        e.preventDefault();

        if (!classCode || !className || !classHours) {
            setError("Please fill out all fields.");
            return;
        }

        const user = auth.currentUser;

        if (user) {
            try {
                const classId = uuidv4();

                await setDoc(doc(db, "classes", classId), {
                    code: classCode,
                    name: className,
                    hours: Number(classHours), 
                    userID: user.uid, 
                });

                console.log("Class added.");
                setError(""); 

                setClassCode("");
                setClassName("");
                setClassHours("");
            } catch (err) {
                console.error("Error adding class:", err);
                setError("Failed to add class.");
            }
        } else {
            setError("You must be logged in to add a class.");
        }
    };

    return (
        <div className="add-class-page-container">

            <h1>Add your classes.</h1>

            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Class Code"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Hours in a week"
                    value={classHours}
                    onChange={(e) => setClassHours(e.target.value)}
                />
                <div className="add-class-button-container">
                    <button className="add-class-button" type="submit">Add</button>
                </div>
                {error && <span style={{ color: "red" }}>{error}</span>}
            </form>

            <div className="go-to-main-button-container">
                <button className="go-to-main-button" onClick={() => navigate("/main")}></button>
            </div>


        </div>
    );
}