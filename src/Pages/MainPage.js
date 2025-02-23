import { db } from "../firebase";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MainPage() {

    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();

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
        <div className="card">
            <div
                key={item.id} 
                className="card-class-info"
            >
                <h3>{item.name}</h3>
                <p>Code: {item.code}</p>
                <p>Hours in a week: {item.hours}</p>
            </div>
            <div style={item.percentage <= 80 ? { backgroundColor: "red" } : {}}>
                <p>absence: {item.absence}, percentage: {item.percentage.toFixed(2)}%</p>
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
