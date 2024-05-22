const { getModel } = require("../data/database");

const model =() => getModel("company");

const getCompanyById = async (req, res) => {
  try {    
    res.status(200).json({ message: "function getCompanyById" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {    
    res.status(200).json({ message: "function getAllCompanies" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createCompany = async (req, res) => {
  try {    
    res.status(200).json({ message: "function createCompany" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {    
    res.status(200).json({ message: "function updateCompany" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCompany = async (req, res) => {
  try {    
    res.status(200).json({ message: "function deleteCompany" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getCompanyById,
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};
