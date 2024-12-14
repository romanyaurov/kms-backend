import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('GET /projects', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return all projects', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });
});
