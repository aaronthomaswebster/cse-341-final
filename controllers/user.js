const { getModel } = require("../data/database");

const model =() => getModel("book");

const getUser = async (req, res) => {
  try {    
    res.status(200).json({ message: "function getUser" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {    
    res.status(200).json({ message: "function createUser" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  createUser,
  updateUser,
  deleteUser,
};
