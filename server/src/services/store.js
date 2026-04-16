const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_DATA = {
  visits: 0,
  feedback: [],
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore() {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return { ...DEFAULT_DATA, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error reading store:', err.message);
  }
  return { ...DEFAULT_DATA };
}

function writeStore(data) {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store:', err.message);
  }
}

function getVisits() {
  return readStore().visits;
}

function incrementVisits() {
  const store = readStore();
  store.visits++;
  writeStore(store);
  return store.visits;
}

function getFeedback() {
  return readStore().feedback;
}

function addFeedback(entry) {
  const store = readStore();
  store.feedback.push({
    id: Date.now(),
    name: entry.name,
    email: entry.email || '',
    message: entry.message,
    createdAt: new Date().toISOString(),
  });
  writeStore(store);
  return store.feedback;
}

function deleteFeedback(id) {
  const store = readStore();
  store.feedback = store.feedback.filter((f) => f.id !== id);
  writeStore(store);
  return store.feedback;
}

module.exports = { getVisits, incrementVisits, getFeedback, addFeedback, deleteFeedback };
