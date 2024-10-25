const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  difficulty: { type: String, required: true },
  link: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  averagePerformance: { type: Number, default: 0 },
  lastAttemptDate: { type: Date },
  nextReviewDate: { type: Date, default: Date.now },
  interval: { type: Number, default: 1 },
  easeFactor: { type: Number, default: 2.5 },
  consecutiveCorrect: { type: Number, default: 0 },
  masteryLevel: { type: Number, default: 0 },
  notes: { type: String },
  tags: [{ type: String }],
  lastPerformanceRating: { type: Number },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
