import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DailyQuestions from './components/DailyQuestions';
import StatsPage from './components/StatsPage';
import { selectDailyQuestions } from './utils/spacedRepetition';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5005/api';

function App() {
  const [questions, setQuestions] = useState([]);
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dailyQuestionsResponse, questionsResponse, statsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/questions/daily`),
        axios.get(`${API_BASE_URL}/questions`),
        axios.get(`${API_BASE_URL}/stats`)
      ]);
      setDailyQuestions(dailyQuestionsResponse.data);
      setQuestions(questionsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load initial data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestions = async (count) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/questions/add`, { count });
      const newQuestions = response.data;
      console.log('New questions:', newQuestions);
      setDailyQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
      console.log('Updated daily questions:', dailyQuestions);
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchInitialData} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold text-gray-700">LeetCode Practice</div>
              <ul className="flex space-x-4">
                <li><Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
                <li><Link to="/stats" className="text-blue-600 hover:text-blue-800">Stats</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<DailyQuestions
              dailyQuestions={dailyQuestions}
              questions={questions} 
              setQuestions={setQuestions}
              stats={stats}
              setStats={setStats}
              addQuestions={addQuestions} 
            />} />
            <Route path="/stats" element={<StatsPage stats={stats} questions={questions} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
