import request from 'supertest';
import app from '../src/app';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Post API', () => {
  let token: string;
  let userId: string;

  const testUser = {
    username: 'postuser',
    email: 'postuser@example.com',
    password: 'password123',
  };

  const testPost = {
    title: 'First Test Post',
    content: 'This is the content of the first test post',
    tags: ['test', 'api'],
  };

  beforeEach(async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    token = res.body.token;
    userId = res.body.data.user.id;
  });

  it('should create a post when authenticated', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(testPost);

    expect(res.status).toBe(201);
    expect(res.body.data.post.title).toBe(testPost.title);
    expect(res.body.data.post.author).toBe(userId);
  });

  it('should fail to create a post without token', async () => {
    const res = await request(app).post('/api/v1/posts').send(testPost);
    expect(res.status).toBe(401);
  });

  it('should fetch all posts', async () => {
    await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(testPost);

    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(1);
    expect(res.body.data.posts[0].title).toBe(testPost.title);
  });

  it('should update a post if user is the author', async () => {
    const createRes = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(testPost);

    const postId = createRes.body.data.post._id;

    const res = await request(app)
      .patch(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.data.post.title).toBe('Updated Title');
  });

  it('should delete a post if user is the author', async () => {
    const createRes = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(testPost);

    const postId = createRes.body.data.post._id;

    const res = await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
