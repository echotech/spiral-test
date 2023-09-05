const axios = require('axios');
const fs = require('fs');

const logFilePath = './logs/json_test.log';

// Configure logging
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
};

describe('JSONPlaceholder Posts API', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  const postsEndpoint = `${baseUrl}/posts`;

  beforeEach(() => {
    log('Setting up test...');
  });

  // Test to check if the API is reachable and returns data
  test('should retrieve posts', async () => {
    log('Running test: should retrieve posts');
    try {
      const response = await axios.get(postsEndpoint);
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(100);
      log('Test passed');
    } catch (error) {
      log(`Test failed: ${error}`);
      throw error;
    }
  });

  // Test to check the content of a specific post
  test('should retrieve a specific post', async () => {
    log('Running test: should retrieve a specific post');
    const postId = 1;
    try {
      const response = await axios.get(`${postsEndpoint}/${postId}`);
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(postId);
      expect(response.data.userId).toBeTruthy();
      expect(response.data.title).toBeTruthy();
      expect(response.data.body).toBeTruthy();
      log('Test passed');
    } catch (error) {
      log(`Test failed: ${error}`);
      throw error;
    }
  });

  // Test to check invalid post ID
  test('should handle invalid post ID', async () => {
    log('Running test: should handle invalid post ID');
    const invalidPostId = 9999; 
    try {
      await axios.get(`${postsEndpoint}/${invalidPostId}`);
    } catch (error) {
      log('Test Passed: Received expected 404.');
      expect(error.response.status).toBe(404);
    }
  });

  // Test to check non-numeric post ID
  test('should handle non-numeric post ID', async () => {
    log('Running test: should handle non-numeric post ID');
    const nonNumericPostId = 'abc'; 
    try {
      await axios.get(`${postsEndpoint}/${nonNumericPostId}`);
    } catch (error) {
      log('Test Passed: Received expected 404.')
      expect(error.response.status).toBe(404);
    }
  });

  // Test to check invalid user ID
  test('should handle invalid user ID', async () => {
    log('Running test: should handle invalid user ID');
    const invalidUserId = 9999; 
    const response = await axios.get(`${postsEndpoint}?userId=${invalidUserId}`);
    log(`Response was ${response.status}`);
    expect(response.status).toBe(200);
    log(`Response did not have any posts with ${invalidUserId}`)
    expect(response.data).toHaveLength(0); 
  });

  // Test to check if titles are not empty
  test('should have non-empty titles', async () => {
    log('Running test: should have something in title');
    const response = await axios.get(postsEndpoint);
    const posts = response.data;
    for (const post of posts) {
      log(`Got title ${post.title}`);
      expect(post.title).toBeTruthy();
    }
  });

  // Test to check if bodies are not empty
  test('should have non-empty bodies', async () => {
    log('Running test: should have text in body');
    const response = await axios.get(postsEndpoint);
    const posts = response.data;
    for (const post of posts) {
      log(`Got body ${post.body}`);
      expect(post.body).toBeTruthy();
    }
  });

  afterEach(() => {
    log('Cleaning up test...');
  });
});
