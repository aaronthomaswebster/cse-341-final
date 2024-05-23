const { getModel } = require("../data/database");
const { getUserByPassportId } = require('./user.js');

const model =() => getModel("company");

const getCompanyById = async (req, res) => {
  try {    
    const company = await model.findById(req.params.id);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {    
    const allCompanies = await model.find();
    res.status(200).json(allCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createCompany = async (req, res) => {
  try {    
    const creation = await model.create(req.body);
    res.status(200).json(creation.populate('ownerId').exec());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const getCompanyOwner = await model.findById(req.params.id)
    const getPassportID = await getUserByPassportId();
    if(getPassportID.id == getCompanyOwner.ownerId){
      const update = await model.findByIdAndUpdate(getCompanyOwner, req.body)
      res.status(200).json(update);
    }else{
      throw Error
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCompany = async (req, res) => {
  try {    
    const getCompanyOwner = await model.findById(req.params.id)
    const getPassportID = await getUserByPassportId();
    if(getPassportID.id == getCompanyOwner.ownerId){
      const deletion = await model.findByIdAndDelete(getCompanyOwner)
      res.status(200).json(deletion);
    }else{
      throw Error
    }
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
