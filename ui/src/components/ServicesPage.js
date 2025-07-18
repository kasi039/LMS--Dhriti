import { useNavigate } from 'react-router-dom';
import { ReactComponent as Applynow } from '../assets/Apply_Now.svg';
import { ReactComponent as Status } from '../assets/Status.svg';
import { ReactComponent as Payment} from '../assets/Payment.svg';
import { ReactComponent as Profile } from '../assets/Profileservice.svg';
import { useState, useEffect } from "react";

function ServicesPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
    useEffect(() => {
      const fetchSessionUser = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/users/session-user', {
            credentials: 'include',
          });
          if (!res.ok) throw new Error('Not logged in');
          const data = await res.json();
          console.log("Fetched session user:", data);
          setUser(data.user);
        } catch (err) {
          console.log("Fetched session user error:", err);
          setUser(null);
        }
      };
      fetchSessionUser();
    }, []);


  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {user? (<h2>Welcome {user.name}</h2>) : (<h2>Welcome user</h2>)}
      <p>🎉 You have successfully logged in!</p>

      <div className="container mt-5">
        <div className="row g-5 justify-content-around align-items-center services-div">
          <div className="col-12 col-md-2" onClick={() => navigate('/applyloan')}>
            <Applynow className="img-fluid mb-2" style={{height: '250px'}}/>
            <p>Apply Now</p>
          </div>
          <div className="col-12 col-md-2" onClick={() => navigate('/userapplications')}>
            <Status className="img-fluid mb-2" style={{height: '250px'}}/>
            <p>Track Loan Status</p>
          </div>
          <div className="col-12 col-md-2">
            <Payment className="img-fluid mb-2" style={{height: '250px'}}/>
            <p>Payment history</p>
          </div>
          <div className="col-12 col-md-2">
            <Profile className="img-fluid mb-2" style={{height: '250px'}}/>
            <p>View Profile</p>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default ServicesPage;
