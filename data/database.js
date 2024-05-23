const dontenv = require('dotenv');
dontenv.config();


const mongoose = require('mongoose');
const { Schema } = mongoose;
let database;

let models = {};
const userSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true}, 
    name: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
    resume: {type: String, default: null}
});
const companySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true}
});

const jobSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    salary: {type: Number, required: true},
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'company', required: true}
});

const applicationSchema = new Schema({
    jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'job', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
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