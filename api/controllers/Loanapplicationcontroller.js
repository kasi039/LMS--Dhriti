const Loan = require('../models/loanApplications');

exports.createLoanApplication = async (req, res) => {
    const userId = req.session.user?.id; 
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    const { loantype, amount } = req.body;
    try{
        const newLoan = new Loan({userId, loantype, amount});
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
    const allapplications = await Loan.find().populate("userId", "name");;
    res.status(200).json(allapplications)
  } catch(error){
    console.error('Error fetching all applications:', error);
    res.status(500).json({ message: 'Error fetching all applications', error });
  }
}

