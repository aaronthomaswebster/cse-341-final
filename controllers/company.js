const { getModel } = require("../data/database");
const { getUserByPassportId } = require('./user.js');

const model =() => getModel("company");

const getCompanyById = async (req, res) => {
  try {    
    const company = await model().findById(req.params.id).populate('ownerId').exec();
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {    
    const allCompanies = await model().find().populate('ownerId').exec();
    const companies = allCompanies.map(company => {
      return {
        _id: company._id,
        name: company.name,
        description: company.description,
        owner: company.ownerId.name
      }
    })
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createCompany = async (req, res) => {
  try {    
    const getPassportID = await getUserByPassportId(req.session.user.id);
    
    req.body.ownerId = getPassportID[0].id;
    const creation = await model().create(req.body);
    const createdCompany = await model().findById(creation._id).populate('ownerId').exec();
    res.status(200).json(createdCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const currentCompanyData = await model().findById(req.params.id);
    const ownerId = currentCompanyData.ownerId;
    const getPassportID = await getUserByPassportId(req.session.user.id);
    let company = {_id: req.params.id, name: req.body.name, description: req.body.description, ownerId: ownerId}
    if(getPassportID[0].id == ownerId.toString()){
      const update = await model().findByIdAndUpdate({_id: req.params.id}, company)
      res.status(200).json({message: 'Company updated'});
    }else{
      res.status(400).json({ message: 'Unauthorized: you must be the owner of the company to update this company'});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCompany = async (req, res) => {
  try {    
    const currentCompanyData = await model().findById(req.params.id);
    const ownerId = currentCompanyData.ownerId;
    const getPassportID = await getUserByPassportId(req.session.user.id);
    if(getPassportID[0].id == ownerId.toString()){
      const deletion = await model().findByIdAndDelete(req.params.id)
      res.status(200).json({message: 'Company successfully deleted'});
    }else{
      res.status(400).json({ message: 'Unauthorized: you must be the owner of the company to update this company'});
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
