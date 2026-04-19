// Cloudflare R2 (S3-compatible) storage service.
// Set these env vars in Render dashboard:
//   R2_ACCOUNT_ID        – Cloudflare account ID
//   R2_ACCESS_KEY_ID     – R2 API token access key
//   R2_SECRET_ACCESS_KEY – R2 API token secret
//   R2_BUCKET_NAME       – bucket name (e.g. "pahadi-news")
//   R2_PUBLIC_URL        – public URL of the bucket (custom domain or r2.dev URL)

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const BUCKET = process.env.R2_BUCKET_NAME || 'pahadi-news';
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
const R2_ENABLED = !!(ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);

let s3;
if (R2_ENABLED) {
  s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

function isR2Enabled() {
  return R2_ENABLED;
}

/**
 * Upload a buffer to R2.
 * @param {string} key   – object key (e.g. "news/1713450000-cover.jpg")
 * @param {Buffer} body  – file content
 * @param {string} contentType – MIME type
 * @returns {{ key, url }} – public URL of the uploaded object
 */
async function uploadFile(key, body, contentType) {
  if (!R2_ENABLED) throw new Error('R2 storage not configured');
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
  const url = PUBLIC_URL ? `${PUBLIC_URL}/${key}` : key;
  return { key, url };
}

/**
 * Delete an object from R2.
 */
async function deleteFile(key) {
  if (!R2_ENABLED) return;
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * List objects under a prefix.
 */
async function listFiles(prefix = '', maxKeys = 100) {
  if (!R2_ENABLED) return [];
  const result = await s3.send(new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
    MaxKeys: maxKeys,
  }));
  return (result.Contents || []).map((obj) => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified,
    url: PUBLIC_URL ? `${PUBLIC_URL}/${obj.Key}` : obj.Key,
  }));
}

module.exports = { isR2Enabled, uploadFile, deleteFile, listFiles, BUCKET, PUBLIC_URL };
