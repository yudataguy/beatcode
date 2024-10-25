const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb://localhost:27017'; // adjust this to your MongoDB URI

async function initializeStats() {
  let client;
  try {
    client = await MongoClient.connect(mongoUri);
    const db = client.db('leetcode_practice');
    const stats = db.collection('stats');

    // Delete existing stats
    await stats.deleteMany({});
    console.log('Existing stats cleared');

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

  } catch (error) {
    console.error('Error initializing stats:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

initializeStats();
