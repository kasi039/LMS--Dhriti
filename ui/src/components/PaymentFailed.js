import React from "react";
import { ReactComponent as Errorphoto } from '../assets/error.svg';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
  const navigate = useNavigate();

    return(
        <div className="admin-page-container">
            <h1 className="text-center text-danger success-head">Payment UnSuccessfull</h1>
            <div className="d-flex justify-content-center mt-5">
                <Errorphoto className="success-img" />
            </div>
            
            
            <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" className="bigButton" onClick={() => navigate("/services")} >Go to Services</Button>
            </div>
        </div>
    );

}
