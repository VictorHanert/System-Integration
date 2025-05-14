// exposee/server.js
import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';

const app = express();
app.use(express.json());

const FILE_PATH = './webhooks.json';

// Helper to read registered webhooks from file
function loadWebhooks() {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

// Helper to save registered webhooks to file
function saveWebhooks(webhooks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(webhooks, null, 2));
}

app.post('/register', (req, res) => {
  const { url, event } = req.body;
  if (!url || !event) return res.status(400).json({ error: 'ERROR: Missing url or event' });
  const webhooks = loadWebhooks();
  webhooks.push({ url, event });
  saveWebhooks(webhooks);
  res.json({ message: 'Registered webhook successfully.' });
});

app.post('/unregister', (req, res) => {
  const { url, event } = req.body;
  if (!url || !event) return res.status(400).json({ error: 'ERROR: Missing url or event' });
  const webhooks = loadWebhooks().filter(w => !(w.url === url && w.event === event));
  saveWebhooks(webhooks);
  res.json({ message: 'Unregistered webhook successfully.' });
});

// Manually trigger test ping to all webhooks
app.get('/ping', async (req, res) => {
  const webhooks = loadWebhooks();
  for (const hook of webhooks) {
    try {
      await fetch(hook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: hook.event,
          message: 'Webhook test successful'
        })
      });
    } catch (err) {
      console.error(`Failed to ping ${hook.url}:`, err.message);
    }
  }
  res.send('Ping sent to all webhooks.');
});

// Example endpoint: simulate payment
app.post('/simulate-payment', async (req, res) => {
  const webhooks = loadWebhooks().filter(w => w.event === 'payment_received');
  for (const hook of webhooks) {
    try {
      await fetch(hook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment_received',
          data: {
            amount: 99,
            currency: 'USD',
            customerId: 'customer_123',
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (err) {
      console.error(`Failed to send payment event to ${hook.url}:`, err.message);
    }
  }
  res.json({ message: 'Payment event sent.' });
});

app.listen(3000, () => {
  console.log('Webhook Exposee running on http://localhost:3000');
});
