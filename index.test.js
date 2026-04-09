const request = require('supertest');
const app = require('./index');

describe('ClawFlow Protocol API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /workflows', () => {
    it('should create a new workflow', async () => {
      const workflowData = {
        id: 'test-workflow-1',
        name: 'Test Workflow',
        version: '1.0.0',
        description: 'Test workflow for API validation',
        agents: ['agent1', 'agent2'],
        steps: [
          {
            id: 'step1',
            agent: 'agent1',
            action: 'search',
            parameters: {},
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

      expect(response.body).toHaveProperty('id', workflowData.id);
      expect(response.body).toHaveProperty('name', workflowData.name);
      expect(response.body).toHaveProperty('status', 'draft');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        name: 'Incomplete Workflow',
        version: '1.0.0'
      };

      await request(app)
        .post('/workflows')
        .send(incompleteData)
        .expect(400);
    });
  });

  describe('POST /workflows/:id/execute', () => {
    it('should start workflow execution', async () => {
      const authToken = 'test-token';
      
      const response = await request(app)
        .post('/workflows/test-workflow-1/execute')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(202);

      expect(response.body).toHaveProperty('executionId');
      expect(response.body).toHaveProperty('status', 'started');
    });

    it('should return 401 for missing authorization', async () => {
      await request(app)
        .post('/workflows/test-workflow-1/execute')
        .expect(401);
    });
  });

  describe('GET /workflows/:id/status', () => {
    it('should return workflow status', async () => {
      const response = await request(app)
        .get('/workflows/test-workflow-1/status')
        .expect(200);

      expect(response.body).toHaveProperty('status');
    });

    it('should return 404 for non-existent workflow', async () => {
      await request(app)
        .get('/workflows/non-existent/status')
        .expect(404);
    });
  });
});