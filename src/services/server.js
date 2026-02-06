const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, db } = require('../db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB ulanish
connectDB();

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server ishlayapti' });
});

// ========== USER ROUTES ==========
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.users.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.users.getById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const user = await db.users.register(req.body);
    res.status(201).json({ success: true, message: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz', data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.login(email, password);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await db.users.update(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await db.users.delete(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// ========== STARTUP ROUTES ==========
app.get('/api/startups', async (req, res) => {
  try {
    const startups = await db.startups.getAll(req.query);
    res.json({ success: true, data: startups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/startups/:id', async (req, res) => {
  try {
    const startup = await db.startups.getById(req.params.id);
    res.json({ success: true, data: startup });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.get('/api/startups/user/:userId', async (req, res) => {
  try {
    const startups = await db.startups.getUserStartups(req.params.userId);
    res.json({ success: true, data: startups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/startups', async (req, res) => {
  try {
    const startup = await db.startups.create(req.body);
    res.status(201).json({ success: true, message: 'Startup muvaffaqiyatli yaratildi', data: startup });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/startups/:id', async (req, res) => {
  try {
    const startup = await db.startups.update(req.params.id, req.body);
    res.json({ success: true, data: startup });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.patch('/api/startups/:id/moderate', async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const startup = await db.startups.moderate(req.params.id, status, rejection_reason);
    res.json({ success: true, data: startup });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/startups/:id/tasks', async (req, res) => {
  try {
    const startup = await db.startups.addTask(req.params.id, req.body);
    res.json({ success: true, data: startup });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.patch('/api/startups/:startupId/tasks/:taskId', async (req, res) => {
  try {
    const { status } = req.body;
    const startup = await db.startups.updateTask(req.params.startupId, req.params.taskId, status);
    res.json({ success: true, data: startup });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/startups/:id', async (req, res) => {
  try {
    const result = await db.startups.delete(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// ========== JOIN REQUEST ROUTES ==========
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await db.requests.getAll(req.query);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/requests/startup/:startupId', async (req, res) => {
  try {
    const requests = await db.requests.getForStartup(req.params.startupId);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const request = await db.requests.create(req.body);
    res.status(201).json({ success: true, message: 'So\'rov muvaffaqiyatli yuborildi', data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.patch('/api/requests/:id', async (req, res) => {
  try {
    const { action } = req.body;
    const result = await db.requests.respond(req.params.id, action);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========== NOTIFICATION ROUTES ==========
app.get('/api/notifications/user/:userId', async (req, res) => {
  try {
    const notifications = await db.notifications.getUserNotifications(req.params.userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const notification = await db.notifications.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await db.notifications.markAsRead(req.params.id);
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.patch('/api/notifications/user/:userId/read-all', async (req, res) => {
  try {
    const result = await db.notifications.markAllAsRead(req.params.userId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const result = await db.notifications.delete(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server xatosi', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portda ishga tushdi`);
});