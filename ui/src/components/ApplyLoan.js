import { ReactComponent as Carloan } from '../assets/car.svg';
import { ReactComponent as Homeloan } from '../assets/home.svg';
import { ReactComponent as Studentloan } from '../assets/student.svg';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function ApplyLoan() {
  const navigate = useNavigate();
  const [step, setstep] = useState(1);
  const [user, setUser] = useState(null);
  const [loanType, setLoanType] = useState('car');

  const [amount, setAmount] = useState('');

  const [carmake, setCarmake] = useState('');
  const [carModel, setCarmodel] = useState('');
  const [carYear, setCaryear] = useState('');

  const[propertyvalue, setPropertyvalue] = useState('');
  const [downPayment, setDownpayment] = useState('');
  const[address, setAddress] = useState('');

  const[institution, setInstitution] = useState('');
  const[courseDurattion, setCourseDuration] = useState('');
  

  const [governmentId, setGovernmentId] = useState(null);
  const [studyCertificate, setStudyCertificate] = useState(null);
  const [collegeAcceptanceLetter, setCollegeAcceptanceLetter] = useState(null);
  const [carCertificate, setCarCertificate] = useState(null);
  const [drivingLicense, setDrivingLicense] = useState(null);
  const [homeCertificate, setHomeCertificate] = useState(null);
  const [permissionLetter, setPermissionLetter] = useState(null);

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

  const handleLoanType = (type) => {
    setLoanType(type);
    setstep(2);
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();

    const loaninfo = {
      loantype: loanType,
      amount: amount,
      carMake: carmake,
      carModel: carModel,
      carYear: carYear,
      propertyValue: propertyvalue,
      downPayment: downPayment,
      address: address,
      institutionName: institution,
      courseDurattion: courseDurattion,
    };

    const res = await fetch('http://localhost:5000/api/applications/applyLoan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loaninfo),
      credentials: 'include',
    });

    const data = await res.json();
    if (res.ok) {
      sessionStorage.setItem('applicationId', data.applicationId);
      alert('Details Saved Please Upload Required Documents');

      const formData = new FormData();
      formData.append('applicationId', data.applicationId);
      formData.append('governmentId', governmentId);

      if (loanType === 'student' && studyCertificate) {
        if (studyCertificate) formData.append('studyCertificate', studyCertificate);
        if (collegeAcceptanceLetter) formData.append('collegeAcceptanceLetter', collegeAcceptanceLetter);
      } else if (loanType === 'car' && carCertificate) {
        if (carCertificate) formData.append('carCertificate', carCertificate);
        if (drivingLicense) formData.append('drivingLicense', drivingLicense);
      } else if (loanType === 'home' && homeCertificate) {
        if (homeCertificate) formData.append('homeCertificate', homeCertificate);
        if (permissionLetter) formData.append('permissionLetter', permissionLetter);
      }

      const res2 = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data2 = await res2.json();

      if (res2.ok) {
        alert(data2.message);
        navigate('/success');
      } else {
        console.error('Error uploading documents:', data2);
      }
    }
  };

  return (
    <div className='mb-5'>
      <h1 className="text-center apply-head">Apply for a Loan</h1>

      {step === 1 && (
        <div>
          <h2 className="text-center apply-subhead">Step 1</h2>
          <p className="text-center mb-5">Please Select type of loan</p>
          <div className="d-flex justify-content-center gap-5 mt-3 edit-user-container">
            <div className="d-flex flex-column align-items-center">
              <Button
                variant="light" className={`mx-3 loan-button ${loanType === 'car' ? 'active' : ''}`} onClick={() => handleLoanType('car')}>
                <Carloan className="loan-icon" />
              </Button>
              <p>Car loan</p>
            </div>
            <div className="d-flex flex-column align-items-center">
              <Button
                variant="light" className={`mx-3 loan-button ${loanType === 'home' ? 'active' : ''}`} onClick={() => handleLoanType('home')}>
                <Homeloan className="loan-icon" />
              </Button>
              <p>Home loan</p>
            </div>
            <div className="d-flex flex-column align-items-center">
              <Button variant="light" className={`mx-3 loan-button ${loanType === 'student' ? 'active' : ''}`} onClick={() => handleLoanType('student')}>
                <Studentloan className="loan-icon" />
              </Button>
              <p>Student loan</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && user && (
        <>
          <div>
            <h2 className="text-center mt-5 apply-subhead">Step 2</h2>
            <p className="text-center mb-5">Please fill the form to apply for {loanType} loan</p>
            <form onSubmit={handleLoanSubmit} className="d-flex dataform bg-light py-5 w-50 flex-column align-items-center mx-auto">
              <div className="mb-3 w-75">
                <label className="form-label">Name</label>
                <input type="text" className="form-control w-100" value={user.name} readOnly />
              </div>
              <div className="mb-3 w-75">
                <label className="form-label">Email</label>
                <input type="text" className="form-control w-100" value={user.email} readOnly />
              </div>
              <div className="mb-3 w-75">
                <label className="form-label">Phone</label>
                <input type="text" className="form-control w-100" value={user.phone} readOnly />
              </div>
              {loanType === 'car' && (
                <>
                <div className="mb-3 w-75">
                  <label className="form-label">Car Make</label>
                  <input type="text" className="form-control w-100" value={carmake} onChange={(e) => setCarmake(e.target.value)} required />
                </div>   
                <div className="mb-3 w-75">
                  <label className="form-label">Car Model</label>
                  <input type="text" className="form-control w-100" value={carModel} onChange={(e) => setCarmodel(e.target.value)} required />
                </div> 
                <div className="mb-3 w-75">
                  <label className="form-label">Car Year</label>
                  <input type="number" className="form-control w-100" value={carYear} onChange={(e) => setCaryear(e.target.value)} required />
                </div>       
                </>)}
              {loanType === 'home' && (
                <>
                <div className="mb-3 w-75">
                  <label className="form-label">Property Value</label>
                  <input type="number" className="form-control w-100" value={propertyvalue} onChange={(e) => setPropertyvalue(e.target.value)} required />
                </div>   
                <div className="mb-3 w-75">
                  <label className="form-label">Down Payment</label>
                  <input type="number" className="form-control w-100" value={downPayment} onChange={(e) => setDownpayment(e.target.value)} required />
                </div> 
                <div className="mb-3 w-75">
                  <label className="form-label">Home Address</label>
                  <input type="text" className="form-control w-100" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>       
                </>)}
              {loanType === 'student' && (
                <>
                <div className="mb-3 w-75">
                  <label className="form-label">Institution </label>
                  <input type="text" className="form-control w-100" value={institution} onChange={(e) => setInstitution(e.target.value)} required />
                </div>   
                <div className="mb-3 w-75">
                  <label className="form-label">Course Duration</label>
                  <input type="number" className="form-control w-100" value={courseDurattion} onChange={(e) => setCourseDuration(e.target.value)} required />
                </div>        
                </>)}
              <div className="mb-3 w-75">
                <label className="form-label">Amount</label>
                <input type="number" className="form-control w-100" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>

              <h2 className="text-center apply-subhead">Step 3</h2>
              <p className="text-center mb-5">Please Upload Required documents</p>
              <div className="d-flex w-75 flex-column bg-light dataform py-5 align-items-center mx-auto">
                {loanType === 'student' && (
                  <>
                    <div className="mb-3 w-75">
                      <label className="form-label">Previous Study Certificate</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-control w-100" onChange={(e) => setStudyCertificate(e.target.files[0])} required/>
                    </div>
                    <div className="mb-3 w-75">
                      <label className="form-label">College Acceptance Letter</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-control w-100" onChange={(e) => setCollegeAcceptanceLetter(e.target.files[0])} required/>
                    </div>
                  </>
                )}
                {loanType === 'car' && (
                  <>
                    <div className="mb-3 w-75">
                      <label className="form-label">Driving License</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-control w-100" onChange={(e) => setDrivingLicense(e.target.files[0])} required/>
                    </div>
                    <div className="mb-3 w-75">
                      <label className="form-label">Car Model details</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-control w-100" onChange={(e) => setCarCertificate(e.target.files[0])} required/>
                    </div>
                  </>
                )}
                {loanType === 'home' && (
                  <>
                    <div className="mb-3 w-75">
                      <label className="form-label">Property Papers</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-control w-100" onChange={(e) => setHomeCertificate(e.target.files[0])} required/>
                    </div>
                    <div className="mb-3 w-75">
                      <label className="form-label">Permission Letter</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-control w-100" onChange={(e) => setPermissionLetter(e.target.files[0])} required/>
                    </div>
                  </>
                )}
                <div className="mb-3 w-75">
                  <label className="form-label">Government Id</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-control w-100" onChange={(e) => setGovernmentId(e.target.files[0])} required/>
                </div>
              </div>
              <Button variant="primary" type="submit" className="w-25 mx-auto"> Submit </Button>
              <Button variant="warning" className="w-25 mt-3 mx-auto" onClick={() => setstep(1)}> Go Back </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ApplyLoan;