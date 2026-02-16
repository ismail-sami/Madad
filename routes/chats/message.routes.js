const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/role');
const {
  deleteAllMessages,
  deleteMessageForOne,
  deleteMessageForBoth
} = require('../../controllers/chats/message.controller');

router.use(auth);
router.use(authorizeRoles('doctor', 'patient'));

/**
 * @swagger
 * /api/messages/{chatId}/all:
 *   delete:
 *     summary: Delete all messages
 *     description: Delete all messages in a chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: All messages deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:chatId/all', deleteAllMessages);

/**
 * @swagger
 * /api/messages/{messageId}/one:
 *   delete:
 *     summary: Delete message for one user
 *     description: Delete a specific message for the current user only
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted for user
 *       401:
 *         description: Unauthorized
 */
router.delete('/:messageId/one', deleteMessageForOne);

module.exports = router;