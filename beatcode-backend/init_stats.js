const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb://localhost:27017'; // adjust this to your MongoDB URI

async function initializeStats() {
  try {
    const client = await MongoClient.connect(mongoUri);
    const db = client.db('leetcode_practice');
    const stats = db.collection('stats');

    const initialStats = {
      questionsPracticed: 0,
      masteryLevel: 'Beginner',
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await stats.insertOne(initialStats);
    console.log('Initial stats created successfully');

    await client.close();
  } catch (error) {
    console.error('Error initializing stats:', error);
  }
}

initializeStats();
