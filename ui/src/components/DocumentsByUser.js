import React from "react";
import { useState, useEffect } from "react";

function Userdocuments() {
    
    const[applications, setApplications] = useState([]);
    const[documents, setDocuments] = useState([]);

    useEffect(() => {
        
        const fetchApplications = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/applications/applicationsbyuser", {credentials:"include"});
                if (!response.ok) {
                    throw new Error("Failed to fetch applications");
                }
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        const fetchDocuments = async () => {
            try{
                const response= await fetch("http://localhost:5000/api/documents/userdocuments", {credentials:"include"});
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

        fetchApplications();
        fetchDocuments();
    }, []);

    

            return (
                <div className="user-accounts-container">
                    <h1>User Documents</h1>
                    <table className="table table-striped w-75 mx-auto mt-5 py-5">
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id}>
                                    <td className="py-5">{application._id}</td>
                                    {documents
                                        .filter((doc) => doc.applicationId === application._id)
                                        .map((doc) => (
                                            <td key={doc._id} className="py-5">
                                                <a
                                                    href={`http://localhost:5000/api/documents/${doc._id}/view`} target="_blank" rel="noopener noreferrer" className="Document-anchor">
                                                    {doc.fileName}
                                                </a>
                                            </td>
                                        ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

    export default Userdocuments;