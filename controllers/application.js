const { getModel } = require("../data/database");

const model =() => getModel("application");

const getApplicationById = async (req, res) => {
  try {    
    res.status(200).json({ message: "function getApplicationById" });
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
