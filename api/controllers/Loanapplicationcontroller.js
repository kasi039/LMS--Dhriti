const Loan = require('../models/loanApplications');
exports.createLoanApplication = async (req, res) => {
    const userId = req.session.user?.id; 
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    const { loanType, amount, details } = req.body;
    try{
        const newLoan = new Loan({userId, loanType, amount, details: details || {}});
        await newLoan.save();
        res.status(201).json({ message: 'Loan application created successfully', applicationId: newLoan._id });
    } catch (error) {
        console.error('Error creating loan application:', error);
        res.status(500).json({ message: 'Error creating loan application', error });
    }
}

exports.applications = async (req, res) => {
  try {
    const loanapplications = await Loan.find({ userId: req.session.user?.id });
    res.status(200).json(loanapplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error });
  }
};

exports.allapplications = async (req, res) => {
  try{
    const allapplications = await Loan.find().populate("userId", "name");
    res.status(200).json(allapplications)
  } catch(error){
    console.error('Error fetching all applications:', error);
    res.status(500).json({ message: 'Error fetching all applications', error });
  }
}

exports.statusupdate = async (req, res) => {
  try{
    const { status } = req.body;
    const applicationId = req.params.id;
    const updatedApplication = await Loan.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Error occured in updating application' });
    }
    res.json(updatedApplication);
  }
  catch(error){
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Error updating application status', error });
  }
}


exports.getapplicationdetails = async (req, res) => {
  try{
    const applicationId = req.params.id;
    const applicationDetails = await Loan.findById(applicationId);
    if(!applicationDetails){
      return res.status(404).json({message: 'Cannot get the application details'})
    }
    res.json(applicationDetails)
  }
  catch(error){
    console.error('Error getting details', error)
    res.status(500).json({message: 'Error getting details'})
  }
}
