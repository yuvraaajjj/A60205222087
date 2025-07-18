const express = require('express');
const log = require('./logs');
const {
  createShortUrl,
  getShortUrl,
  recordClick,
  getStats
} = require('./shortner');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: true,
}));

app.post('/shorturls', async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;
    const result = await createShortUrl({ url, validity, shortcode });
    res.status(201).json(result);
  } catch (err) {
    await log('backend', 'error', err.type || 'handler', err.msg);
    res.status(err.code || 500).json({ error: err.msg });
  }
});

app.get('/:code', async (req, res) => {
  const code = req.params.code;
  try {
    const url = await getShortUrl(code);
    await log('backend', 'info', 'handler', `Redirect for shortcode: ${code}`);
    await recordClick(code, {
      time: new Date().toISOString(),
      referrer: req.get('Referrer') || '',
      ip: req.ip
    });
    res.redirect(url);
  } catch (err) {
    await log('backend', 'warn', err.type || 'handler', err.msg);
    res.status(err.code || 500).json({ error: err.msg });
  }
});


app.get('/shorturls/:code', async (req, res) => {
  const code = req.params.code;
  try {
    const url = await getShortUrl(code);
    await log('backend', 'info', 'handler', `Redirect for shortcode: ${code}`);
    await recordClick(code, {
      time: new Date().toISOString(),
      referrer: req.get('Referrer') || '',
      ip: req.ip
    });
    res.redirect(url)
  } catch (err) {
    await log('backend', 'warn', err.type || 'handler', err.msg);
    res.status(err.code || 500).json({ error: err.msg });
  }
});

app.get('/shorturls/:code/stats', async (req, res) => {
  const code = req.params.code;
  try {
    const stats = await getStats(code);
    res.json(stats);
  } catch (err) {
    await log('backend', 'warn', err.type || 'handler', err.msg);
    res.status(err.code || 500).json({ error: err.msg });
  }
});

app.listen(3001, () => {
  console.log('Listening on http://localhost:3001');
});
