const request = require('supertest');
const app = require('../server.js'); // Update with path to your server file

describe('GET Endpoints', () => {
  it('should get all jobs', async () => {
    const res = await request(app)
      .get('/jobs') // Update with your actual endpoint
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('jobs') // Update with the actual property you're expecting
  })

  it('should get a job by id', async () => {
    const res = await request(app)
      .get('/jobs/1') // Update with your actual endpoint and a valid id
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('job') // Update with the actual property you're expecting
  })

  // Add more tests for other GET endpoints
})