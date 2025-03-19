import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AddClassPage() {

    const [classCode, setClassCode] = useState("");
    const [className, setClassName] = useState("");
    const [classHours, setClassHours] = useState(null);
    const [classAbsence, setClassAbsence] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [numberOfClasses, setNumberOfClasses] = useState(0);
    const classLimit = 10;

    useEffect(() => {
        const fetchClassCount = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const q = query(collection(db, "classes"), where("userID", "==", user.uid));
                const querySnapshot = await getDocs(q);
                setNumberOfClasses(querySnapshot.size); 
            } catch (error) {
                console.error("Error fetching class count:", error);
                setError("Failed to fetch class data.");
            }
        };

        fetchClassCount();
    }, []);

    const handleAdd = async (e) => {

        e.preventDefault();

        if (numberOfClasses >= classLimit) {
            setError(`You have reached the class limit of ${classLimit}.`);
            return;
        }

        if (!classCode || !className || !classHours) {
            setError("Please fill out all fields.");
            return;
        }
        if(classHours == 0 || classHours > 10) {
            setError("Please select a valid hour.")
            return;
        }

        const user = auth.currentUser;

        if (user) {

            try {
                const classId = uuidv4();

                await setDoc(doc(db, "classes", classId), {
                    code: classCode,
                    name: className,
                    weeklyHours: Number(classHours), 
                    userID: user.uid, 
                });

                console.log("Class added.");
                setError(""); 

                setClassCode("");
                setClassName("");
                setClassHours(null);
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
                <input
                    type="number"
                    placeholder="Absence"
                    value={classAbsence}
                    onChange={(e) => setClassAbsence(e.target.value)}
                />
                <div className="add-class-button-container">
                    <button className="add-class-button" type="submit">Add</button>
                </div>
                {error && <span style={{ color: "red" }}>{error}</span>}
            </form>

            <div className="go-to-main-button-container">
                <button onClick={() => navigate("/main")}>Class List</button>
            </div>


        </div>
    );
}