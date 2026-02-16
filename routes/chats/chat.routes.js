const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/role');
const {
  getAllChats,
  getChatMessages,
  updateLastOpened,
  unreadMessagesCount,
  getChatStats,
  getMediaByChatId,
  getLinksByChatId,
  getDocumentsByChatId,
  getConsultationSummary,
  searchChats,
  searchMessages
} = require('../../controllers/chats/chat.controller');

router.use(auth);
router.use(authorizeRoles('doctor', 'patient'));

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats
 *     description: Retrieve all chats for the current user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 */
router.get('/', getAllChats);

/**
 * @swagger
 * /api/chats/{chatId}/last-opened:
 *   put:
 *     summary: Update last opened time
 *     description: Update the last time chat was opened by user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last opened updated
 */
router.put('/:chatId/last-opened', updateLastOpened);

/**
 * @swagger
 * /api/chats/{chatId}/messages:
 *   get:
 *     summary: Get chat messages
 *     description: Retrieve all messages for a specific chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get('/:chatId/messages', getChatMessages);

/**
 * @swagger
 * /api/chats/unread/count:
 *   get:
 *     summary: Get unread messages count
 *     description: Get count of unread messages for current user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved
 */
router.get('/unread/count', unreadMessagesCount);

/**
 * @swagger
 * /api/chats/stats:
 *   get:
 *     summary: Get chat statistics
 *     description: Get chat statistics for current user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat statistics
 */
router.get('/stats', getChatStats);

/**
 * @swagger
 * /api/chats/{chatId}/media:
 *   get:
 *     summary: Get media files
 *     description: Get all media files from a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of media files
 */
router.get('/:chatId/media', getMediaByChatId);

/**
 * @swagger
 * /api/chats/{chatId}/links:
 *   get:
 *     summary: Get links
 *     description: Get all links shared in a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of links
 */
router.get('/:chatId/links', getLinksByChatId);

/**
 * @swagger
 * /api/chats/{chatId}/documents:
 *   get:
 *     summary: Get documents
 *     description: Get all documents from a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents
 */
router.get('/:chatId/documents', getDocumentsByChatId);

/**
 * @swagger
 * /api/chats/{id}/summary:
 *   get:
 *     summary: Get consultation summary
 *     description: Get summary of a consultation chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultation summary
 */
router.get('/:id/summary', getConsultationSummary);

/**
 * @swagger
 * /api/chats/search:
 *   get:
 *     summary: Search chats
 *     description: Search in user's chats
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', searchChats);

/**
 * @swagger
 * /api/chats/messages/search:
 *   get:
 *     summary: Search messages
 *     description: Search in chat messages
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/messages/search', searchMessages);

module.exports = router;