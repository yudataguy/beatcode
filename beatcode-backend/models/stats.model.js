const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statsSchema = new Schema({
  questionsPracticed: { type: Number, default: 0 },
  masteryLevel: { type: String, default: 'Beginner' },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
});

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;