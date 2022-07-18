const express = require('express');
const auth = require('../../middlewares/auth');
const proxy = require('../../middlewares/proxy');

const router = express.Router();

router.route('/*').all(auth(), proxy());

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Papers
 *   description: Paper browse and retrieval
 */
