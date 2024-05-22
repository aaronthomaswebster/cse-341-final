const { getModel } = require("../data/database");

const model =() => getModel("job");

const getAllJobs = async (req, res) => {
  try {    
    res.status(200).json({ message: "function getAllJobs" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getJobById = async (req, res) => {
  try {    
    res.status(200).json({ message: "function getJob" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  try {    
    res.status(200).json({ message: "function createJob" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {    
    res.status(200).json({ message: "function updateJob" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteJob = async (req, res) => {
  try {    
    res.status(200).json({ message: "function deleteJob" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
