/**
 * TTS (Text-to-Speech) Routes
 * Handles sentence retrieval and audio recording uploads for Garhwali TTS training
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadToR2, getR2Url } = require('../services/r2');
const { redisGetJSON, redisSetJSON, redisSetAdd, redisSetMembers, redisSetCount } = require('../services/store');

const router = express.Router();

// Import sentences data
const { generateJSON, totalCount } = require('../../scripts/tts-sentences');

// Configure multer for audio uploads (in-memory for R2 upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format'));
    }
  },
});

// Redis keys
const RECORDINGS_KEY = 'pahadi_tts_recordings';
const CONTRIBUTORS_KEY = 'pahadi_tts_contributors';
const STATS_KEY = 'pahadi_tts_stats';

/**
 * GET /api/tts/sentences
 * Returns all sentences for recording with stats
 */
router.get('/sentences', async (req, res) => {
  try {
    const sentences = generateJSON();
    const recordedCount = await redisSetCount(RECORDINGS_KEY) || 0;
    
    res.json({
      sentences,
      total: totalCount,
      recorded: recordedCount,
    });
  } catch (error) {
    console.error('Error fetching sentences:', error);
    res.status(500).json({ error: 'Failed to fetch sentences' });
  }
});

/**
 * POST /api/tts/upload
 * Upload a recorded audio file
 */
router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { sentenceId, text, userId, userName } = req.body;

    if (!sentenceId || !text) {
      return res.status(400).json({ error: 'Missing sentence ID or text' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `tts-recordings/${sentenceId}_${timestamp}.webm`;

    // Upload to R2
    const r2Result = await uploadToR2(
      filename,
      req.file.buffer,
      req.file.mimetype
    );

    if (!r2Result.success) {
      throw new Error('R2 upload failed');
    }

    // Store recording metadata
    const recordingData = {
      id: `${sentenceId}_${timestamp}`,
      sentenceId,
      text,
      filename,
      url: r2Result.url || getR2Url(filename),
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous',
      createdAt: new Date().toISOString(),
    };

    // Track in Redis
    await redisSetAdd(RECORDINGS_KEY, recordingData.id);
    await redisSetJSON(`pahadi_tts_recording:${recordingData.id}`, recordingData, 365 * 24 * 60 * 60);

    // Track contributor
    if (userId) {
      await redisSetAdd(CONTRIBUTORS_KEY, userId);
    }

    res.json({
      success: true,
      recording: recordingData,
    });
  } catch (error) {
    console.error('Error uploading recording:', error);
    res.status(500).json({ error: 'Failed to upload recording' });
  }
});

/**
 * GET /api/tts/stats
 * Get recording statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const recordedCount = await redisSetCount(RECORDINGS_KEY) || 0;
    const contributorCount = await redisSetCount(CONTRIBUTORS_KEY) || 0;

    res.json({
      totalSentences: totalCount,
      recordedCount,
      contributorCount,
      completionPercent: Math.round((recordedCount / totalCount) * 100),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/tts/recordings
 * List all recordings (admin)
 */
router.get('/recordings', async (req, res) => {
  try {
    const recordingIds = await redisSetMembers(RECORDINGS_KEY) || [];
    const recordings = [];

    for (const id of recordingIds.slice(0, 100)) { // Limit to 100
      const data = await redisGetJSON(`pahadi_tts_recording:${id}`);
      if (data) {
        recordings.push(data);
      }
    }

    // Sort by date, newest first
    recordings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      recordings,
      total: recordingIds.length,
    });
  } catch (error) {
    console.error('Error fetching recordings:', error);
    res.status(500).json({ error: 'Failed to fetch recordings' });
  }
});

/**
 * GET /api/tts/export
 * Export recordings metadata for training
 */
router.get('/export', async (req, res) => {
  try {
    const recordingIds = await redisSetMembers(RECORDINGS_KEY) || [];
    const recordings = [];

    for (const id of recordingIds) {
      const data = await redisGetJSON(`pahadi_tts_recording:${id}`);
      if (data) {
        recordings.push({
          id: data.sentenceId,
          text: data.text,
          audio_url: data.url,
        });
      }
    }

    // Generate metadata.csv format
    const metadata = recordings
      .map(r => `${r.id}|${r.text}`)
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=metadata.csv');
    res.send(metadata);
  } catch (error) {
    console.error('Error exporting recordings:', error);
    res.status(500).json({ error: 'Failed to export recordings' });
  }
});

module.exports = router;
