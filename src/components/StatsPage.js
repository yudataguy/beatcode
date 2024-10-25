import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5005/api';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, questionsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/stats`),
          axios.get(`${API_BASE_URL}/questions`)
        ]);
        setStats(statsResponse.data || {
          questionsPracticed: 0,
          masteryLevel: 'Beginner',
          currentStreak: 0,
          longestStreak: 0,
        });
        setQuestions(questionsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort questions by nextReviewDate
  const sortedQuestions = [...questions].sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));

  if (isLoading) {
    return <div className="text-center py-8">Loading stats...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Questions Practiced</h3>
          <p className="text-3xl font-bold">{stats?.questionsPracticed || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Mastery Level</h3>
          <p className="text-3xl font-bold">{stats?.masteryLevel || 'Beginner'}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
          <p className="text-3xl font-bold">{stats?.currentStreak || 0} days</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Longest Streak</h3>
          <p className="text-3xl font-bold">{stats?.longestStreak || 0} days</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Question Progress</h3>
      {sortedQuestions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Question</th>
                <th className="py-3 px-6 text-center">Difficulty</th>
                <th className="py-3 px-6 text-center">Attempts</th>
                <th className="py-3 px-6 text-center">Avg. Performance</th>
                <th className="py-3 px-6 text-center">Next Review</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {sortedQuestions.map((question) => (
                <tr key={question.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{question.title}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {question.tags && question.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`py-1 px-3 rounded-full text-xs ${
                      question.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {question.attempts || 0}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {question.averagePerformance ? (
                      <span className={`py-1 px-3 rounded-full ${
                        question.averagePerformance >= 4 ? 'bg-green-200 text-green-800' :
                        question.averagePerformance >= 3 ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {question.averagePerformance.toFixed(2)}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {new Date(question.nextReviewDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No questions available.</p>
      )}
    </div>
  );
};

export default StatsPage;
