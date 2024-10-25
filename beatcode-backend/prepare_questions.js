const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Question = require('./models/question.model');

// Read the JSON file
const rawData = fs.readFileSync('questionsList.json');
const data = JSON.parse(rawData);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  family: 4, // Use IPv4, skip trying IPv6
});

const nextReviewDate = new Date();
nextReviewDate.setDate(nextReviewDate.getDate() - 1);

// Function to prepare questions for insertion
function prepareQuestions(questions) {
  return questions.map(q => ({
    id: q.number.toString(),
    title: q.name,
    difficulty: q.difficulty,
    link: q.link,
    attempts: 0,
    averagePerformance: 0,
    lastAttemptDate: null,
    nextReviewDate: nextReviewDate,
    interval: 1,
    easeFactor: 2.5,
    consecutiveCorrect: 0,
    masteryLevel: 0,
    notes: "",
    tags: q.type,
    lastPerformanceRating: null,
  }));
}

async function resetAndInsertQuestions() {
  try {
    // First, delete all existing questions
    console.log('Deleting existing questions...');
    await Question.deleteMany({});
    console.log('Existing questions deleted');

    // Then insert new questions
    const preparedQuestions = prepareQuestions(data.questions);
    const result = await Question.insertMany(preparedQuestions);
    console.log(`${result.length} new questions were inserted`);
  } catch (error) {
    console.error('Error during reset and insert:', error);
  } finally {
    mongoose.connection.close();
  }
}

resetAndInsertQuestions();
