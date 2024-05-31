const { getModel } = require("../data/database");

const model =() => getModel("job");
const companyModel =() => getModel("company");
const applicationModel =() => getModel("application");

const getAllJobs = async (req, res) => {
  try {    
    let jobs = await model().find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getJobById = async (req, res) => {
  try {    
    let job = await model().find({_id: req.params.id});
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  try {    
    const company = await companyModel().findById(req.body.companyId).populate('ownerId').exec();
    if(!company || company.length == 0){
      return res.status(400).json({ message: 'Company does not exist'});
    }else if(company.ownerId.passport_user_id != req.session.user.id){
      return res.status(400).json({ message: 'Unauthorized: you must be the owner of the company to create a job'});
    }
    let job = await model().create(req.body);
    job = await model().findById(job._id).populate('companyId').exec();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {    
    const job = await model().findById(req.params.id).populate('companyId').exec();
    if(!job || job.length == 0){
      return res.status(400).json({ message: 'Job does not exist'});
    }
    const company = await companyModel().findById(job.companyId).populate('ownerId').exec();
    if(company.ownerId.passport_user_id != req.session.user.id){
      return res.status(400).json({ message: 'Unauthorized: you must be the owner of the company to update this job'});
    }

    if(req.body.companyId != job.companyId._id && req.body.companyId != null){
      const newCompany = await companyModel().findById(req.body.companyId).populate('ownerId').exec();
      if(!company || company.length == 0){
        return res.status(400).json({ message: 'Company does not exist'});
      }else if(company.ownerId.passport_user_id != req.session.user.id){
        return res.status(400).json({ message: 'Unauthorized: you must be the owner of the company to set it as the company for a job'});
      }
    }

    await model().findByIdAndUpdate({_id: req.params.id}, req.body)
    const update = await model().findById(req.params.id).populate('companyId').exec();
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {    
    const jobToDelete = await model().findById(req.params.id).populate('companyId').exec();
    if(!jobToDelete){
      return res.status(400).json({ message: 'Job does not exist'});
    }
    const company = await companyModel().findById(jobToDelete.companyId).populate('ownerId').exec();
    if(company.ownerId.passport_user_id != req.session.user.id){
      return res.status(400).json({ message: 'Unauthorized: you must be the owner of the company associated with a job inorder to delte it'});
    }
    await applicationModel().deleteMany({jobId:  req.params.id});
    let job = await model().deleteOne({_id: req.params.id});
    res.status(200).json({ message: "Job deleted" });
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
