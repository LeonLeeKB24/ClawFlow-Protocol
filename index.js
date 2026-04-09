const express = require('express');
const { Pool } = require('pg');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/clawflow',
});

// Middleware
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Workflow Schema
const workflowSchema = {
  id: 'string',
  name: 'string',
  version: 'string',
  description: 'string',
  agents: ['string'],
  steps: [{
    id: 'string',
    agent: 'string',
    action: 'string',
    parameters: 'object',
    depends_on: ['string']
  }],
  schedule: {
    cron: 'string',
    timezone: 'string'
  }
};

// API Endpoints

// Create Workflow
app.post('/workflows', async (req, res) => {
  try {
    const { id, name, version, description, agents, steps, schedule } = req.body;
    
    // Validate workflow schema
    if (!id || !name || !version) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO workflows (id, name, version, description, agents, steps, schedule, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [id, name, version, description, JSON.stringify(agents), JSON.stringify(steps), JSON.stringify(schedule)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Execute Workflow
app.post('/workflows/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    
    // Verify JWT token
    if (!authToken) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }
    
    const decoded = jwt.verify(authToken, JWT_SECRET);
    
    // Start workflow execution
    const result = await pool.query(
      'INSERT INTO executions (workflow_id, status, created_at, created_by) VALUES ($1, $2, NOW(), $3) RETURNING *',
      [id, 'running', decoded.userId]
    );

    res.status(202).json({ executionId: result.rows[0].id, status: 'started' });
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Workflow Status
app.get('/workflows/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM executions WHERE workflow_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No executions found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting workflow status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`ClawFlow Protocol API server running on port ${PORT}`);
});

// Schedule workflow execution
cron.schedule('0 2 * * *', async () => {
  console.log('Running scheduled workflow executions...');
  
  try {
    // Get workflows scheduled to run
    const result = await pool.query(`
      SELECT w.* FROM workflows w 
      WHERE w.schedule IS NOT NULL 
      AND w.schedule->>'cron' IS NOT NULL
    `);
    
    for (const workflow of result.rows) {
      console.log(`Executing workflow: ${workflow.name}`);
      // Implement workflow execution logic here
    }
  } catch (error) {
    console.error('Error in scheduled workflow execution:', error);
  }
});

module.exports = app;