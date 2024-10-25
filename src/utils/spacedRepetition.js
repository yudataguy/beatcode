const calculateNextReviewDate = (easeFactor, interval) => {
  const nextInterval = interval * easeFactor;
  const now = new Date();
  return new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000);
};

export const updateQuestionData = (questionData, performance) => {
  const { easeFactor, interval, attempts = 0, totalPerformance = 0 } = questionData;
  let newEaseFactor = easeFactor;
  let newInterval = interval;

  if (performance < 3) {
    newInterval = 1;
    newEaseFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    newInterval = interval === 0 ? 1 : interval * easeFactor;
    newEaseFactor = easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
  }

  const nextReviewDate = calculateNextReviewDate(newEaseFactor, newInterval);

  return {
    ...questionData,
    easeFactor: newEaseFactor,
    interval: newInterval,
    nextReviewDate,
    lastAttemptDate: new Date(),
    attempts: attempts + 1,
    totalPerformance: totalPerformance + performance,
    averagePerformance: (totalPerformance + performance) / (attempts + 1)
  };
};

export const selectDailyQuestions = (questions, maxQuestions = 3) => {
  const now = new Date();
  return questions
    .filter(q => q.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate - b.nextReviewDate)
    .slice(0, maxQuestions);
};
