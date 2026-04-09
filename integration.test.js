const request = require('supertest');
const app = require('./index');

describe('ClawFlow Protocol API - Integration Tests', () => {
  let authToken = 'test-jwt-token';
  
  beforeAll(() => {
    // Generate test JWT token
    authToken = jwt.sign({ userId: 'test-user' }, 'test-secret', { expiresIn: '1h' });
  });

  describe('Health Check', () => {
    test('GET /health should return status ok', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('ok');
      expect(response.body.version).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Workflow Management', () => {
    test('POST /workflows should create a new workflow', async () => {
      const workflowData = {
        id: 'test-integration-workflow',
        name: 'Integration Test Workflow',
        version: '1.0.0',
        description: 'Workflow for integration testing',
        agents: ['test-agent-1', 'test-agent-2'],
        steps: [
          {
            id: 'step1',
            agent: 'test-agent-1',
            action: 'search',
            parameters: { query: 'test query' },
            depends_on: []
          }
        ],
        schedule: {
          cron: '0 2 * * *',
          timezone: 'UTC'
        }
      };

      const response = await request(app)
        .post('/workflows')
        .send(workflowData)
        .expect(201);

      expect(response.body.id).toBe(workflowData.id);
      expect(response.body.name).toBe(workflowData.name);
      expect(response.body.status).toBe('draft');
    });

    test('POST /workflows should return 400 for missing fields', async () => {
      const incompleteData = {
        name: 'Incomplete Workflow'
      };

      await request(app)
        .post('/workflows')
        .send(incompleteData)
        .expect(400);
    });
  });

  describe('Workflow Execution', () => {
    test('POST /workflows/:id/execute should start execution', async () => {
      const response = await request(app)
        .post('/workflows/test-integration-workflow/execute')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(202);

      expect(response.body).toHaveProperty('executionId');
      expect(response.body).toHaveProperty('status', 'started');
    });

    test('POST /workflows/:id/execute should return 401 without auth', async () => {
      await request(app)
        .post('/workflows/test-integration-workflow/execute')
        .expect(401);
    });
  });

  describe('Status Monitoring', () => {
    test('GET /workflows/:id/status should return execution status', async () => {
      const response = await request(app)
        .get('/workflows/test-integration-workflow/status')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('workflow_id', 'test-integration-workflow');
    });

    test('GET /workflows/non-existent/status should return 404', async () => {
      await request(app)
        .get('/workflows/non-existent/status')
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    test('Invalid JSON should return 400', async () => {
      await request(app)
        .post('/workflows')
        .send('invalid json')
        .expect(400);
    });

    test('Non-existent endpoint should return 404', async () => {
      await request(app)
        .get('/non-existent')
        .expect(404);
    });
  });
});