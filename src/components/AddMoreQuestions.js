import React, { useState } from 'react';

const AddMoreQuestions = ({ addQuestions }) => {
  const [count, setCount] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    addQuestions(count);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Add More Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="count" className="block mb-2">Number of questions to add:</label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            min="1"
            max="10"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Questions
        </button>
      </form>
    </div>
  );
};

export default AddMoreQuestions;
