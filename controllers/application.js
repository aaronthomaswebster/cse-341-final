const { getModel } = require("../data/database");
const { getUserByPassportId } = require('./user.js');

const model =() => getModel("application");
const jobController =() => getModel("job");

const getApplicationById = async (req, res) => {
  try {    
    let application = await model().find({_id: req.params.id}).populate([
      {path: 'userId'},
      {path: 'jobId',
        populate: {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}}]).exec();
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
const getApplicationByJobId = async (req, res) => {
  try {    
      
    let job = await jobController().findById(req.params.id).populate([
      {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}]).exec();
    
    if(!job._id || job.length == 0){
      return res.status(400).json({message: "Job doesn't exist"});
    }    
    let applicationList = await model().find({jobId: req.params.id}).populate([
      {path: 'userId'},
      {path: 'jobId',
        populate: {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}}]).exec();
    if(applicationList.length == 0) {
      return res.status(404).json({ message: "No Applications found for given job Id" });
    }
    if(applicationList[0].jobId.companyId.ownerId.passport_user_id != req.session.user.id) {
      return res.status(401).json({ message: "Unauthorized: you must be the owner of the job to view it's applications" });
    }
    res.status(200).json(applicationList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplications = async (req, res) => {
  try {    
    let userFilteredList = [];
    let allApplicationList = await model().find().populate([
      {path: 'userId'},
      {path: 'jobId',
        populate: {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}}]).exec();
    allApplicationList.forEach(filter => {
      if(filter.jobId.companyId.ownerId.passport_user_id == req.session.user.id){
        userFilteredList.push(filter);
      }else if(filter.userId.passport_user_id == req.session.user.id){
        userFilteredList.push(filter);
      }
    });

    if(userFilteredList.length == 0){
      return res.status(401).json({message: "You don't have any applications."})
    }
    res.status(200).json(userFilteredList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const filterByStatus = async (req, res) => {
  try {    
    let userFilteredList = [];
    let statusFilterList = [];
    let allApplicationList = await model().find().populate([
      {path: 'userId'},
      {path: 'jobId',
        populate: {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}}]).exec();
    allApplicationList.forEach(filter => {
      if(filter.userId.passport_user_id == req.session.user.id){
        userFilteredList.push(filter);
      }else if(filter.jobId.companyId.ownerId.passport_user_id == req.session.user.id){
        userFilteredList.push(filter);
      }
    });

    if(userFilteredList.length == 0){
      return res.status(401).json({message: "You don't have any applications."})
    }
    userFilteredList.forEach(statusFilter => {
      if(statusFilter.status == req.params.status){
        statusFilterList.push(statusFilter)
      }
    })

    if(statusFilterList.length == 0){
      return res.status(401).json({message: "You don't have any applications under this status."})
    }
    res.status(200).json(statusFilterList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createApplication = async (req, res) => {
  try {    
    let job = await jobController().findById(req.body.jobId).populate([
      {path: 'companyId',
      populate: {path: 'ownerId', model: 'users'}}]).exec();
    if(!job._id || job.length == 0){
      return res.status(400).json({message: "Job doesn't exist"});
    }else if(job.companyId.ownerId.passport_user_id == req.session.user.id){
      return res.status(400).json({message: "You cannot create an application for your own job."})
    }
    const user = await getUserByPassportId(req.session.user.id);
    let applicationData = {
      jobId: req.body.jobId,
      userId: user[0].id,
      status: "pending"
    }
    let createdApplication = await model().create(applicationData);
    let application = await model().findById(createdApplication._id).populate('jobId').exec();
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {    
    let application = await model().findById(req.params.id).populate([
      {path: 'userId'},
      {path: 'jobId',
        populate: {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}}]).exec();
    if(application.jobId.companyId.ownerId.passport_user_id != req.session.user.id){
      return res.status(401).json({message: "Unauthorized: You must be the owner of the job to update the status of this application."});
    }
    await model().findByIdAndUpdate(application._id, {status: req.body.status});
    let updatedApplication = await model().findById(req.params.id).populate([
      {path: 'userId'},
      {path: 'jobId',
        populate: {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}}]).exec();
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteApplication = async (req, res) => {
  try {    
    let application = await model().find({_id: req.params.id}).populate([
      {path: 'userId'},
      {path: 'jobId',
        populate: {path: 'companyId', model: 'companies', 
          populate: {path: 'ownerId', model: 'users'}}}]).exec();
    if(application.length == 0) {
      return res.status(404).json({ message: "Application not found" });
    }
    if(application[0].userId.passport_user_id != req.session.user.id) {
      return res.status(401).json({ message: "Unauthorized: you must be the user who applied to delete this application" });
    }
    let deletedApplication = await model().findByIdAndDelete(req.params.id);
    res.status(200).json("Applciation deleted!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getApplications,
  getApplicationById,
  filterByStatus,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationByJobId
};
