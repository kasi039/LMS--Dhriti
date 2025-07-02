import { ReactComponent as Successphoto } from '../assets/success.svg';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';


function Success() {
    const navigate = useNavigate();
    return(
        <div className="admin-page-container">
            <h1 className="text-center success-head">Application Submitted Successfully</h1>
            <div className="d-flex justify-content-center mt-5">
                <Successphoto className="success-img" />
            </div>
            <p className="text-center mt-3 success-subhead">Your application has been submitted successfully. We will review it and get back to you soon.</p>
            <p className="text-center mt-3 success-subhead">Your application Id:<b className="app-id">{sessionStorage.getItem('applicationId')}</b></p>
            <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" className="bigButton" onClick={() => navigate("/")} >Go to Dashboard</Button>
            </div>
        </div>
    )
}

export default Success;