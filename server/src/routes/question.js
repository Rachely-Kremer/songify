const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question');

router.get('/question', questionController.getAllQuestions);
router.get('/question/:id', questionController.getQuestionById);
router.post('/question', questionController.createQuestions);
module.exports = router;
