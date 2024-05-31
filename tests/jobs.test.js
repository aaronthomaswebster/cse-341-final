const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../server");
const { initDb, getModel } = require("../data/database");
let jobModel;
let userModel;
let applicationModel;
let companyModel;


let mongoServer;

beforeAll(async () => {
  await initDb(() => {
    console.log("DB Initialized");
  });
  jobModel = getModel("job");
  userModel = getModel("user");
  applicationModel = getModel("application");
  companyModel = getModel("company");

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Disconnect any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  await mongoose.connection.close();
  await mongoServer.stop();
  await app.closeServer();
});

beforeEach(async () => {
  const user = await userModel.create([
    {
      name: "Developer",
      description: "Develop stuff",
      salary: 1234,
      passport_user_id: "123456",
    }
  ]);
  const company = await companyModel.create([
    {
      name: "Developer",
      description: "Develop stuff",
      ownerId: user[0]._id,
    }
  ]);
  const job = await jobModel.create([
    {
      title: "Developer",
      description: "Develop stuff",
      salary: 1234,
      companyId: company[0]._id
    },
  ]);

  await applicationModel.create([
    {
      jobId: job[0]._id,
      userId: user[0]._id,
      status: "pending",
    },
  ]);
});

afterEach(async () => {
  await jobModel.deleteMany();
  await userModel.deleteMany();
  await applicationModel.deleteMany();
  await companyModel.deleteMany();
});

describe("GET /job", () => {
  it("should return all jobs", async () => {
    const response = await request(app).get("/job");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      title: "Developer",
      description: "Develop stuff",
      salary: 1234,
    });
  });
});

describe("GET /job/:id", () => {
  it("should return a job by id", async () => {
    const jobs = await jobModel.find();
    const response = await request(app).get(`/job/${jobs[0]._id}`);
    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      title: "Developer",
      description: "Develop stuff",
      salary: 1234,
    });
  });
});


describe("GET /company", () => {
  it("should return all companies", async () => {
    const response = await request(app).get("/company");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      name: "Developer",
      description: "Develop stuff",
    });
  });
});

describe("GET /company/:id", () => {
  it("should return a company by id", async () => {
    const companies = await companyModel.find();
    const response = await request(app).get(`/company/${companies[0]._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Developer",
      description: "Develop stuff",
    });
  });
});