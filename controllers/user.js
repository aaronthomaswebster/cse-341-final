const { getModel } = require("../data/database");

const model =() => getModel("user");

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
    await model().updateOne({_id: req.params.id}, req.body);
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {    
    await model().deleteOne({_id: req.params.id});
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
