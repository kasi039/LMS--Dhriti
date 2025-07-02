const Document = require('../models/Documents');

exports.uploadDocument = async (req, res) => {
    const userId = req.session.user?.id;
    const {applicationId } = req.body;
    try{
        const uploadedDocs = [];
        for (const[fieldName, fileArray] of Object.entries(req.files)) {
            for (const file of fileArray) {
                const newDocument = new Document({ userId, applicationId, fileName:file.originalname, fileType:file.mimetype, data: file.buffer });
                await newDocument.save();
                uploadedDocs.push(newDocument);
            }
        }
        res.status(201).json({ message: 'Document uploaded successfully'});
    }
    catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Error uploading document', error });
    }
}


exports.documentsbyuser = async (req, res) => {
  try {
    const loanapplications = await Document.find({ userId: req.session.user?.id });
    res.status(200).json(loanapplications);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};



exports.documentsbyId = async (req, res) => {
  try {
    const document = await Document.find({ applicationId: req.params.Id });
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