import { db } from "../firebase";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MainPage() {

    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();
   
    const handleUpdateAbsence = async (classId, newAbsence) => {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not logged in.");
            return;
        }

        try {
            const classRef = doc(db, "classes", classId);
            await updateDoc(classRef, {
                absence: newAbsence,
            });

            // Update local state without fetching all classes again
            setClasses((prevClasses) => 
                prevClasses.map((item) => 
                    item.id === classId 
                    ? { ...item, absence: newAbsence, percentage: 100 * (item.hours * 14 - newAbsence) / (item.hours * 14) }
                    : item
                )
            );

            console.log(`Absence updated for class ${classId}.`);
        } catch (err) {
            console.error("Error updating absence.", err);
        }
    }; 


    useEffect(() => {
        
        const fetchClasses = async () => {

            const user = auth.currentUser;
            if (!user) {
                console.error("User not logged in.");
                return;
            }

            try {
                const q = query(collection(db, "classes"), where("userID", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const classData = [];
                querySnapshot.forEach((doc) => {
                    classData.push({ 
                        id: doc.id, 
                        name: doc.data().name, 
                        code: doc.data().code, 
                        hours: doc.data().weeklyHours, 
                        userId: doc.data().userID, 
                        absence: doc.data().absence,
                        percentage: 100 * (doc.data().weeklyHours * 14 - doc.data().absence) / (doc.data().weeklyHours * 14)
                    });
                });
                setClasses(classData);

            } catch (err) {
                console.error("Error fetching classes.", err);
            }
        };

        fetchClasses();
    }, []);

    const classCards = classes.map((item) => (
        <div style={{display:"flex", flexDirection:"row"}}>
        <div className="card" style={item.percentage <= 80 ? { backgroundColor: "red" } : {}}>
            <div
                key={item.id} 
                className="card-class-info"
            >
                <h3>{item.name}</h3>
                <p>Code: {item.code}</p>
                <p>Hours in a week: {item.hours}</p>
            </div>
            <div>
                <p>absence: {item.absence}, percentage: {item.percentage.toFixed(2)}%</p>
            </div>
        </div>
        <div className="card-buttons-container">
            <button onClick={() => handleUpdateAbsence(item.id, item.absence + 1)}>Absence+</button>
            <button onClick={() => handleUpdateAbsence(item.id, item.absence - 1)}>Absence-</button>
            <button onClick={() => handleUpdateAbsence(item.id, 0)}>Reset Absence</button>
        </div>
        </div>
    ));

    return (
        <div>
            <h1 >My Classes</h1>
            <div className="card-holder">
                {classCards}
            </div>
        </div>
    );
}
