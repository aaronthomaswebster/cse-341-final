const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const { initDb, getModel } = require("../data/database");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User;
let mongoServer;

beforeAll(async () => {
  await initDb(() => { console.log('DB Initialized') });
  User = getModel("user");
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Disconnect any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Configure Passport
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    // Mock user authentication logic here
    const user = { id: 1, email: 'test@example.com' };
    return done(null, user);
  }));

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser((id, done) => {
    // Mock user retrieval logic here
    const user = { id: 1, email: 'test@example.com' };
    done(null, user);
  });

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  await mongoose.connection.close();
  await mongoServer.stop();
  await app.closeServer();
});

beforeEach(async () => {
  await User.create([{ name: 'Developer', description: 'Develop stuff', salary: 1234, passport_user_id: '123456' }]);
});

afterEach(async () => {
  await User.deleteMany();
});

describe('GET /user', () => {
  it('should return the current user', async () => {
    const agent = request.agent(app); // Create an agent to persist session

    // Simulate user login
    await agent
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' });

    const response = await agent.get('/user'); // Use the agent to make authenticated requests
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      title: 'Developer',
      description: 'Develop stuff',
      salary: 1234
    });
  });
});