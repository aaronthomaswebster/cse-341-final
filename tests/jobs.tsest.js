const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../server");
const { initDb, getModel } = require("../data/database");
let Job;

let mongoServer;

beforeAll(async () => {
  await initDb(() => {
    console.log("DB Initialized");
  });
  Job = getModel("job");
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
  await Job.create([
    {
      title: "Developer",
      description: "Develop stuff",
      salary: 1234,
      companyId: new mongoose.Types.ObjectId(),
    },
  ]);
});

afterEach(async () => {
  await Job.deleteMany();
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
    const jobs = await Job.find();
    const response = await request(app).get(`/job/${jobs[0]._id}`);
    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      title: "Developer",
      description: "Develop stuff",
      salary: 1234,
    });
  });
});
