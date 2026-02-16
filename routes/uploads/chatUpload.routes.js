const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');
const { uploadChatFiles } = require('../../controllers/uploads/chatUpload.controller');

/**
 * @swagger
 * /api/uploads/chat:
 *   post:
 *     summary: Upload chat files
 *     description: Upload files for chat messages
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.post('/chat', upload.array('attachments'), auth, uploadChatFiles);

module.exports = router;