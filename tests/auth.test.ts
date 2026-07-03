import request from 'supertest';
import app from '../src/app';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';
import User from '../src/models/User';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.password).toBeUndefined(); // Should not return password
  });

  it('should not register user with existing email', async () => {
    await User.create(testUser);
    const res = await request(app).post('/api/v1/auth/register').send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Email already in use');
  });

  it('should login successfully with correct credentials', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.token).toBeDefined();
  });

  it('should fail login with incorrect password', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Incorrect email or password');
  });
});
