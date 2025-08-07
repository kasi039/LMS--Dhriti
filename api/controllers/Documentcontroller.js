const { application } = require('express');
const Document = require('../models/Documents');

exports.uploadDocument = async (req, res) => {
    const userId = req.session.user?.id;
    const {applicationId } = req.body;
    try{
        const uploadedDocs = [];
        for (const file of req.files) {
            
                const newDocument = new Document({ userId, applicationId, fileName:file.originalname, fileType:file.mimetype, data: file.buffer });
                await newDocument.save();
                uploadedDocs.push(newDocument);
            
        }
        res.status(201).json({ message: 'Document uploaded successfully'}); 
    }
    catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Error uploading document', error });
    }
}


exports.documentsByApplication = async (req, res) => {
  try{
    const {applicationId} = req.params;

    const documents = await Document.find({applicationId});

    res.status(200).json(documents);
  }
  catch(error){
    res.status(500).json({message: 'Failed to fetch documents', error});
  }
}



exports.documentsbyId = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.set({
      'Content-type': document.fileType,
      'Content-Disposition': `inline; filename="${document.fileName}"`
    });
    res.send(document.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};



