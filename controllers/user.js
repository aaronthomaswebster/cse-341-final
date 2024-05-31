const { getModel } = require("../data/database");

const model =() => getModel("user");
const companyModel =() => getModel("company");
const applicationModel =() => getModel("application");
const jobModel =() => getModel("job");

const getUser = async (req, res) => {
  try {    
    let passport_user_id = req.session.user.id;
    let user = await getUserByPassportId(passport_user_id);
    if(user.length == 0) {
      return res.status(404).json({ message: "User not found" });
    } 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByPassportId = async (passport_user_id) => {
  try {    
    let user = await model().find({passport_user_id: passport_user_id});
    return user;
  } catch (error) {
    return false;
  }
}


const createUser = async (user) => {
  try {    

    model().create({
      name: user.displayName,
      passport_user_id: user.id,
      email: user.emails ? user.emails[0].value : null,
      resume: user.resume
    });
  } catch (error) {
    console.log({error})
  }
};

const updateUser = async (req, res) => {
  try {    
    let passport_user_id = req.session.user.id;
    const user = await getUserByPassportId(passport_user_id);
    if(user.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const response = await model().updateOne({passport_user_id: passport_user_id}, req.body, { runValidators: true });
    console.log({response})
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {    

    let passport_user_id = req.session.user.id;
    let user = await getUserByPassportId(passport_user_id);

    let companies = await companyModel().find({ownerId: user[0].id});
    console.log({companies})
    for(let i = 0; i < companies.length; i++){
      let jobs = await jobModel().find({companyId: companies[i].id});
      console.log({jobs})
      for(let j = 0; j < jobs.length; j++){
        await applicationModel().deleteMany({jobId: jobs[j].id});
      }
      await jobModel().deleteMany({companyId: companies[i].id})
    }
    await companyModel().deleteMany({ownerId: user[0].id});
    await applicationModel().deleteMany({userId: user[0].id});
    await model().deleteOne({passport_user_id: passport_user_id});
    req.session.destroy();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getUser,
  getUserByPassportId,
  createUser,
  updateUser,
  deleteUser,
};
