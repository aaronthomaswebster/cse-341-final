const dontenv = require('dotenv');
dontenv.config();


const mongoose = require('mongoose');
const { Schema } = mongoose;
let database;

let models = {};
const userSchema = new Schema({
    name: String,
    email: String,
    password: String
});
const companySchema = new Schema({
    name: String,
    description: String,
    userId: String
});

const jobSchema = new Schema({
    title: String,
    description: String,
    companyId: String
});

const applicationSchema = new Schema({
    jobId: String,
    userId: String,
    status: String
});

const initDb = async ( callback) => {
    if(database){
        console.warn('Trying to init DB again!');
        return callback(null, database);
    }

    database = await mongoose.connect(process.env.MONGODB_URL)
    models['user'] = database.model('user', userSchema);
    models['company'] = database.model('company', companySchema);
    models['job'] = database.model('job', jobSchema);
    models['application'] = database.model('application', applicationSchema);
    return callback(null, database);

}

const getDatabase = () => {
    if(!database){
        throw 'Db has not been initialized. Please call init first.';
    }
    return database;
}

const getModel = (name) => {
    if(!models || !models[name]){
        throw name+' Model has not been initialized. Please call init first.';
    }
    return models[name];
}

module.exports = {
    initDb,
    getDatabase,
    getModel
}