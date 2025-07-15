import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const navigate = useNavigate();
  return (
    <div className="admin-page-container text-center">
        <h1 className="big-text">Welcome Admin!</h1>
        <p className="medium-text">Manage user accounts and applications</p>
        <div className="buttons-admin mb-5">
          <Button variant="primary" className="bigButton" onClick={() => navigate('/useraccounts')}>View User Accounts</Button>
          <Button variant="warning" className="bigButton" onClick={() => navigate('/allapplications')}>View User Applications</Button>
        </div>
    </div>
  );
}

export default AdminPage;