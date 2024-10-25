const router = require('express').Router();
let Question = require('../models/question.model');

// Get all questions
router.route('/').get((req, res) => {
  Question.find()
    .then(questions => res.json(questions))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get daily questions
router.route('/daily').get(async (req, res) => {
  try {
    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // today.setDate(today.getDate() + 1);
    
    // Find questions for today or create new ones if none exist
    let dailyQuestions = await Question.find({
      nextReviewDate: { $lte: today },
      $or: [
        { lastAttemptDate: null },
        { lastAttemptDate: { $lt: today } }
      ]
    }).limit(3);

    if (dailyQuestions.length < 3) {
      const additionalQuestions = await Question.aggregate([
        { $match: { lastAttemptDate: { $lt: today } } },
        { $sample: { size: 3 - dailyQuestions.length } }
      ]);

      // Update lastAsked for new questions
      const updatePromises = additionalQuestions.map(q => 
        Question.findByIdAndUpdate(q._id, { lastAttemptDate: today })
      );
      await Promise.all(updatePromises);

      dailyQuestions = [...dailyQuestions, ...additionalQuestions];
    }

    res.json(dailyQuestions);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Update a question
router.route('/:id').put((req, res) => {

  Question.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
    .then(question => res.json(question))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add new questions
router.route('/add').post(async (req, res) => {
  const { count } = req.body;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const newQuestions = await Question.aggregate([
      { $match: { nextReviewDate: { $lte: today }, } },
      { $sample: { size: count } }
    ]);

    const updatePromises = newQuestions.map(q => 
      Question.findByIdAndUpdate(q._id, { lastAttemptDate: today })
    );
    await Promise.all(updatePromises);

    res.json(newQuestions);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Refresh a question
router.route('/refresh').get(async (req, res) => {
  const { currentIds } = req.query;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    const refreshedQuestion = await Question.findOne({
      id: { $nin: currentIds },
      nextReviewDate: { $gte: today }
    });

    if (refreshedQuestion) {
      refreshedQuestion.lastAttemptDate = new Date();
      await refreshedQuestion.save();
      res.json(refreshedQuestion);
    } else {
      res.status(404).json('No more questions available');
    }
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

module.exports = router;
