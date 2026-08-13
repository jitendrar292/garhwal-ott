// Vercel serverless entry point.
// Vercel auto-routes requests matching /api/* to files in this directory.
// We re-export the Express app so all /api/* routes are handled by it.
module.exports = require('../server/src/index.js');
