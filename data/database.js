const dontenv = require('dotenv');
dontenv.config();


const mongoose = require('mongoose');
const { Schema } = mongoose;
let database;

let models = {};
const userSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true}, 
    name: {type: String, required: [true, "Name Required"]},
    phone: {type: String, required: [true, "Phone Number Required"], match: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/},
    email: {type: String, required: [true, "Email Required"], match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,},
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
    resume: {type: String, default: null}
});
const companySchema = new Schema({
    name: {type: String, required: [true, "Company Name Required"]},
    description: {type: String, required: [true, "Company Description Required"]},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: [true, "Owner ID Required"]}
});

const jobSchema = new Schema({
    title: {type: String, required: [true, "Job Title Required"]},
    description: {type: String, required: [true, "Job Description Required"]},
    salary: {type: Number, required: [true, "Salary Required"]},
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'companies', required: [true, "Company ID Required"]}
});

const applicationSchema = new Schema({
    jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: [true, "Job ID Required"]},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: [true, "User ID Required"]},
    status: {type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'}
});

const initDb = async ( callback) => {
    if(database){
        console.warn('Trying to init DB again!');
        return callback(null, database);
    }

    database = await mongoose.connect(process.env.MONGODB_URL)
    models['user'] = database.model('users', userSchema);
    models['company'] = database.model('companies', companySchema);
    models['job'] = database.model('jobs', jobSchema);
    models['application'] = database.model('applications', applicationSchema);
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