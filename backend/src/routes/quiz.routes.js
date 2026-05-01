const express = require('express');
const router = express.Router();
const quizQuestions = require('../data/quizQuestions.json');

router.get('/', (req, res, next) => {
  try {
    const { topic = 'general', difficulty = 'beginner' } = req.query;
    
    // In our mock data, we just have 'general' topic
    const questions = quizQuestions[topic] || quizQuestions['general'];

    res.json({ questions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
