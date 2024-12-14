import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('GET /users', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return all users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(21);
  });
});
