const dontenv = require('dotenv');
dontenv.config();


const mongoose = require('mongoose');
let database;

let models = {};
const initDb = async ( callback) => {
    if(database){
        console.warn('Trying to init DB again!');
        return callback(null, database);
    }

    database = await mongoose.connect(process.env.MONGODB_URL)
    models['book'] = mongoose.model('book',{
        book_id: { type: String, unique: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        isbn: { type: String, unique: true, required: true },
        published_date: { type: Date, required: true },
        genre: { type: String, required: true },
        description: { type: String, required: true },
        cover_image: { type: String, required: true },
        pages: { type: Number, required: true },
        language: { type: String, required: true },
        publisher: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
      });
    models['review'] = mongoose.model('review',{
        review_id: { type: String, unique: true },
        user_name: { type: String, required: true},
        book_id: {type: mongoose.Schema.Types.ObjectId, ref: 'book'}, // Change 'Item' to the actual referenced collection name, e.g., 'Book'
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
      });
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