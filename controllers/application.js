const { getModel } = require("../data/database");

const model =() => getModel("application");

const getApplicationById = async (req, res) => {
  try {    
    let application = await model.find({_id: req.params.id}).popluated('jobId').populated('userId').exec().popluate('jobId.ownerId').exec();
    if(application.length == 0) {
      return res.status(404).json({ message: "Application not found" });
    }
    if(application[0].userId.passport_user_id != req.session.user.id && application[0].jobId.ownerId.passport_user_id != req.session.user.id) {
      return res.status(401).json({ message: "Unauthorized: you must be the owner of the job or the user who applied to view this application" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const filterByStatus = async (req, res) => {
  try {    
    res.status(200).json({ message: "function filterByStatus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createApplication = async (req, res) => {
  try {    
    res.status(200).json({ message: "function createApplication" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {    
    res.status(200).json({ message: "function updateApplication" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteApplication = async (req, res) => {
  try {    
    res.status(200).json({ message: "function deleteApplication" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getApplicationById,
  filterByStatus,
  createApplication,
  updateApplication,
  deleteApplication,
};
