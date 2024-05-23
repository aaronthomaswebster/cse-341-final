const { getModel } = require("../data/database");

const model =() => getModel("job");

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
    let job = await model().create(req.body).populate('companyId').exec();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {    
    let job = await model().updateOne({_id: req.params.id}, req.body).populate('companyId').exec();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {    
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
