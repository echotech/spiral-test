const axios = require('axios');
const fs = require('fs');

const logFilePath = './logs/json_test.log'; // Specify the path to the log file

// Configure logging
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
};

// Test suite for the 'https://jsonplaceholder.typicode.com/posts' endpoint
describe('JSONPlaceholder Posts API', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  const postsEndpoint = `${baseUrl}/posts`;

  beforeEach(() => {
    log('Setting up test...');
  });

  // Test to check if the API is reachable and returns data
  test('should retrieve posts', async () => {
    const response = await axios.get(postsEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(100); // Assuming there are 100 posts
  });

  // Test to check the content of a specific post
  test('should retrieve a specific post', async () => {
    const postId = 1;
    const response = await axios.get(`${postsEndpoint}/${postId}`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(postId);
    expect(response.data.userId).toBeTruthy();
    expect(response.data.title).toBeTruthy();
    expect(response.data.body).toBeTruthy();
  });

  // Test to check invalid post ID
  test('should handle invalid post ID', async () => {
    const invalidPostId = 9999; // Assuming an invalid post ID
    try {
      await axios.get(`${postsEndpoint}/${invalidPostId}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  // Test to check non-numeric post ID
  test('should handle non-numeric post ID', async () => {
    const nonNumericPostId = 'abc'; // Non-numeric post ID
    try {
      await axios.get(`${postsEndpoint}/${nonNumericPostId}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  // Test to check invalid user ID
  test('should handle invalid user ID', async () => {
    const invalidUserId = 9999; // Invalid user ID
    const response = await axios.get(`${postsEndpoint}?userId=${invalidUserId}`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(0); // Assuming no posts for the invalid user ID
  });

  // Test to check if titles are not empty
  test('should have non-empty titles', async () => {
    const response = await axios.get(postsEndpoint);
    const posts = response.data;
    for (const post of posts) {
      expect(post.title).toBeTruthy();
    }
  });

  // Test to check if bodies are not empty
  test('should have non-empty bodies', async () => {
    const response = await axios.get(postsEndpoint);
    const posts = response.data;
    for (const post of posts) {
      expect(post.body).toBeTruthy();
    }
  });

  afterEach(() => {
    log('Cleaning up test...');
  });
});
