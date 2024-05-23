const { getModel } = require("../data/database");

const model =() => getModel("user");

const getUser = async (req, res) => {
  try {    
    let user = await model().find({_id: req.params.id});
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
    res.status(200).json({ message: "function updateUser" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {    
    res.status(200).json({ message: "function deleteUser" });
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
