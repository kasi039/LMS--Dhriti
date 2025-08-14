import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';


function Userdocuments() {
    const { id: applicationId } = useParams(); 
    const[documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchDocuments = async () => {
            try{
                const response= await fetch(`http://localhost:5000/api/documents/documentsbyapplication/${applicationId}`, {credentials:"include"});
                if(!response.ok){
                    throw new Error("Failed to fetch documents"); 
                }
                const data = await response.json();
                
                setDocuments(data);
            }
            catch(error){
                console.error('cant fetch documents', error) 
            }
        }

        fetchDocuments();
    }, [applicationId]);

    

            return (
                <div className="user-accounts-container">
                    <h2>Documents Uploaded for Application Id : <b>{applicationId}</b>  </h2>
                    <table className="table table-striped w-25 mx-auto mt-5 py-5">
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc._id}>
                                    <td className="py-5">
                                        <a
                                            href={`http://localhost:5000/api/documents/${doc._id}/view`} target="_blank" rel="noopener noreferrer" className="Document-anchor">
                                                {doc.fileName}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="last-button mt-5 d-flex justify-content-center">
                        <Button variant="info" className="w-25" onClick={() => navigate(`/applicationdetails/${applicationId}`)}>Go back</Button>
                    </div>
                </div>
            );
        }

    export default Userdocuments;