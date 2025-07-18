const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const log = require('./logs');

const urlStore = {}; 

function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

function generateShortcode() {
  return nanoid(7);
}

async function createShortUrl({ url, validity = 30, shortcode }) {
  if (!validUrl.isUri(url)) {
    throw { code: 400, type: 'handler', msg: 'Invalid original URL.' };
  }

  let code = shortcode;
  if (shortcode) {
    if (!isAlphanumeric(shortcode) || shortcode.length > 20) {
      throw { code: 400, type: 'handler', msg: 'Invalid shortcode format.' };
    }
    if (urlStore[shortcode]) {
      throw { code: 409, type: 'handler', msg: 'Shortcode collision.' };
    }
  } else {
    do {
      code = generateShortcode();
    } while (urlStore[code]);
  }

  const now = new Date();
  const expiryDate = new Date(now.getTime() + validity * 60000);
  urlStore[code] = {
    url,
    expiry: expiryDate,
    created: now,
    clicks: []
  };

  await log('backend', 'info', 'handler', `Shortlink created: ${code} for ${url}`);

  return {
    shortLink: `http://localhost:3000/shorturls/${code}`,
    expiry: expiryDate.toISOString()
  };
}

async function getShortUrl(code) {
  const entry = urlStore[code];
  if (!entry) throw { code: 404, type: 'handler', msg: 'Shortcode not found.' };
  if (new Date() > entry.expiry) throw { code: 410, type: 'handler', msg: 'Link expired.' };
  return entry.url;
}

async function recordClick(code, clickData) {
  const entry = urlStore[code];
  if (entry) {
    entry.clicks.push(clickData);
  }
}

async function getStats(code) {
  const entry = urlStore[code];
  if (!entry) throw { code: 404, type: 'handler', msg: 'Shortcode not found.' };
  return {
    original_url: entry.url,
    created: entry.created.toISOString(),
    expiry: entry.expiry.toISOString(),
    total_clicks: entry.clicks.length,
    clicks: entry.clicks
  };
}

module.exports = { createShortUrl, getShortUrl, recordClick, getStats };
