import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { updateQuestionData } from '../utils/spacedRepetition';

const API_BASE_URL = 'http://localhost:5005/api';

const DailyQuestions = ({ dailyQuestions, questions: initialQuestions, setQuestions, stats, setStats, addQuestions }) => {
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [finishedQuestions, setFinishedQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Initial questions received:', dailyQuestions);
    if (dailyQuestions && dailyQuestions.length > 0) {
      // TODO: Update the active and finished questions correctly
      // const active = initialQuestions.filter(q => q.lastPerformanceRating === null);
      // const finished = initialQuestions.filter(q => q.lastPerformanceRating !== null);
      // console.log('Filtered active questions:', active);
      // console.log('Filtered finished questions:', finished);
      setActiveQuestions(dailyQuestions);
      // setFinishedQuestions(finished);
      setIsLoading(false);
    } else {
      console.log('No initial questions, fetching from API');
      fetchQuestions();
    }
  }, []); // Remove initialQuestions from the dependency array

  useEffect(() => {
    console.log('Daily questions updated:', dailyQuestions);
    // TODO: Update the active questions based on the new daily questions
    const active = dailyQuestions.filter(q => q.lastPerformanceRating === null);
    setActiveQuestions(active);
  }, [dailyQuestions]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/daily`);
      console.log('Fetched questions from API:', response.data);
      if (Array.isArray(response.data)) {
        const active = response.data.filter(q => q.lastPerformanceRating === null);
        const finished = response.data.filter(q => q.lastPerformanceRating !== null);
        console.log('Filtered active questions:', active);
        console.log('Filtered finished questions:', finished);
        setActiveQuestions(active);
        setFinishedQuestions(finished);
        setQuestions(response.data); // Update the parent state
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Received unexpected data format from the server.');
      }
    } catch (error) {
      console.error('Error fetching daily questions:', error);
      setError('Failed to fetch questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = async (id, performance) => {
    console.log(`Updating question ${id} with performance ${performance}`);
    try {
      const questionToUpdate = activeQuestions.find(q => q.id === id);
      console.log('Question to update:', questionToUpdate);
      const updatedQuestion = updateQuestionData(questionToUpdate, performance);
      console.log('Updated question data:', updatedQuestion);
      await axios.put(`${API_BASE_URL}/questions/${id}`, updatedQuestion);
      await updateStats(performance);
      return updatedQuestion;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  };

  const updateStats = async (performance) => {
    console.log('Updating stats with performance:', performance);
    if (!stats) {
      console.error('Stats object is null');
      return;
    }
    try {
      const updatedStats = {
        ...stats,
        questionsPracticed: stats.questionsPracticed + 1,
        // TODO: Update other stats based on performance
      };
      console.log('Updated stats:', updatedStats);
      await axios.put(`${API_BASE_URL}/stats`, updatedStats);
      setStats(updatedStats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handleRating = async (questionId, rating) => {
    console.log(`Handling rating for question ${questionId} with rating ${rating}`);
    try {
      const updatedQuestion = await updateQuestion(questionId, rating);

      console.log('Active questions before update:', activeQuestions);
      console.log('Finished questions before update:', finishedQuestions);

      // Update local state
      setActiveQuestions(prev => {
        const updated = prev.filter(q => q.id !== questionId);
        console.log('Updated active questions:', updated);
        return updated;
      });
      setFinishedQuestions(prev => {
        const updated = [...prev, updatedQuestion];
        console.log('Updated finished questions:', updated);
        return updated;
      });

      // Update parent component's state
      setQuestions(prevQuestions => {
        const updated = prevQuestions.map(q => q.id === questionId ? updatedQuestion : q);
        console.log('Updated questions in parent state:', updated);
        return updated;
      });

      setExpandedQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleRefreshQuestion = async (questionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/refresh`, {
        params: { currentIds: activeQuestions.map(q => q.id) }
      });
      const newQuestion = response.data;
      setActiveQuestions(prevQuestions =>
        prevQuestions.map(q => q.id === questionId ? newQuestion : q)
      );
      setExpandedQuestion(null);
    } catch (error) {
      console.error('Error refreshing question:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-200 text-green-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'hard':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const difficultyColors = [
    'bg-red-500 hover:bg-red-600',
    'bg-orange-500 hover:bg-orange-600',
    'bg-yellow-500 hover:bg-yellow-600',
    'bg-lime-500 hover:bg-lime-600',
    'bg-green-500 hover:bg-green-600'
  ];

  const renderQuestionList = (questions, isFinished = false) => (
    <ul className="space-y-4 mb-8">
      {questions.map((question) => (
        <li key={question.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
              className="text-blue-600 hover:text-blue-800 text-left flex-grow"
            >
              {question.title}
            </button>
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            {!isFinished && (
              <button
                onClick={() => handleRefreshQuestion(question.id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded ml-2"
              >
                ↻
              </button>
            )}
          </div>
          {expandedQuestion === question.id && (
            <div className="mt-4">
              <p className="text-gray-700 mb-4">{question.description || "No description available."}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {question.tags && question.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <a href={question.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mb-4 block">
                View on LeetCode
              </a>
              {!isFinished && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Rate your performance:</p>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRating(question.id, rating)}
                        className={`px-3 py-1 ${difficultyColors[rating - 1]} text-white rounded`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {isFinished && (
                <p className="text-sm text-gray-600">Your rating: {question.lastPerformanceRating}</p>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading questions...</div>;
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
      <h2 className="text-2xl font-bold mb-4">Daily Practice Questions</h2>

      <h3 className="text-xl font-semibold mb-2">Active Questions</h3>
      {activeQuestions.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <p className="text-gray-700">No more active questions. Add more questions to continue practicing.</p>
        </div>
      ) : (
        renderQuestionList(activeQuestions)
      )}

      <h3 className="text-xl font-semibold mb-2">Finished Questions</h3>
      {finishedQuestions.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <p className="text-gray-700">No finished questions yet. Rate some questions to see them here.</p>
        </div>
      ) : (
        renderQuestionList(finishedQuestions, true)
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-xl font-bold mb-4">Add More Questions</h3>
        <div>
          <p className="text-sm text-gray-600 mb-2">Select the number of questions to add:</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((count) => (
              <button
                key={count}
                onClick={() => addQuestions(count)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestions;
