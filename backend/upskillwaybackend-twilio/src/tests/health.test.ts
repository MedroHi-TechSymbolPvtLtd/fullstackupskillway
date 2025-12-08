import request from 'supertest';
import app from '../app';

describe('Health Check', () => {
  it('should return 200 for health endpoint', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 404 for non-existent endpoint', async () => {
    await request(app)
      .get('/non-existent-endpoint')
      .expect(404);
  });
});