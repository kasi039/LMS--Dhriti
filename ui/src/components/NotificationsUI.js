import React from "react";
import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';

function Notificationsforme() {
    const [notifications, setNotifications] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const getNotifications = async() => {
            try{
                const res = await fetch("http://localhost:5000/api/notifications/getnotifications", {credentials:"include"});
                const data = await res.json();
                setNotifications(data);
            }
            catch(error){
                alert("Error occured fetching Notifications", error);
            }
        }
        getNotifications();
    },[]);

    const handleCheckBox = (id) => {
        setSelected((prev) => 
            prev.includes(id)? prev.filter((p) => p !== id) : [...prev,id]
        );
    };

    const markAsRead = async() => {
        try{
            await fetch("http://localhost:5000/api/notifications/markread",
                {
                    method: 'POST',
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({ids: selected}),
                    credentials: 'include',
                }
            );

            setNotifications((prev) => 
                prev.filter((n)=> !selected.includes(n._id))
            );
            setSelected([]);
        }
        catch(error){
            alert("Failed to mark them as read", error);
        }
    }

    return(
        <>
        <h2 className="text-center headings">Notifications</h2>
        {notifications.length===0? <h4 className="text-center fw-bold text-muted mb-5">No Notifications</h4>
        :
        <>
        {notifications.map((n) => (
            <div className="row w-75 my-5 px-2 py-2 rounded bg-light shadow mx-auto"  key={n._id}>
                <div className="col-6 ps-3 fs-6 text-success fw-bold">
                    <p>From Dhriti</p>
                </div>
                <div className="col-6 pe-3 text-end fs-6 fw-bold text-muted">
                    <p>{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div className="col-10">
                    <p>{n.message}</p>
                </div>
                <div className="col-2 d-flex justify-content-center">
                    <input type="checkbox" checked={selected.includes(n._id)} onChange={() => handleCheckBox(n._id)}/>
                </div>
            </div>
        ))}
        {selected.length !== 0 && (
        <Button className="d-block mx-auto mb-5" variant="danger" onClick={markAsRead}>Mark Selected as Read</Button>)}
        </>
        }
        </>
    )
}

export default Notificationsforme;




