'use client';

import { useState } from 'react';

export interface QuizData {
  questions: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number;
  allowRetake?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

interface QuizViewerProps {
  quizData: QuizData;
  title: string;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export function QuizViewer({ quizData, title, onComplete }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (submitted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    
    const correctAnswers = quizData.questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    
    onComplete?.(correctAnswers, totalQuestions);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const calculateScore = () => {
    const correctAnswers = quizData.questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    const correctCount = quizData.questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const passed = quizData.passingScore ? score >= quizData.passingScore : true;

    return (
      <div style={{ 
        minHeight: '100%', 
        backgroundColor: '#f3f4f6',
        padding: '2rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '56rem',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '2.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              Quiz Results
            </h2>
            <div style={{ 
              fontSize: '3.75rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              color: passed ? '#059669' : '#dc2626'
            }}>
              {score}%
            </div>
            <p style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '0.5rem' }}>
              You got {correctCount} out of {totalQuestions} questions correct
            </p>
            {quizData.passingScore && (
              <p style={{ color: '#6b7280' }}>
                Passing score: {quizData.passingScore}%
              </p>
            )}
            {passed ? (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#d1fae5', 
                border: '1px solid #6ee7b7',
                borderRadius: '0.5rem'
              }}>
                <p style={{ color: '#065f46', fontWeight: '600' }}>🎉 Congratulations! You passed!</p>
              </div>
            ) : (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#fee2e2', 
                border: '1px solid #fca5a5',
                borderRadius: '0.5rem'
              }}>
                <p style={{ color: '#991b1b', fontWeight: '600' }}>Keep trying! You can retake the quiz.</p>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Review Your Answers
            </h3>
            {quizData.questions.map((question, index) => {
              const selectedOptionId = selectedAnswers[question.id];
              const isCorrect = selectedOptionId === question.correctAnswer;

              return (
                <div key={question.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem', 
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{
                      flexShrink: 0,
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {index + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                        {question.question}
                      </p>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        {question.options.map(option => {
                          const isSelected = option.id === selectedOptionId;
                          const isCorrectOption = option.id === question.correctAnswer;
                          
                          let bgColor = '#f9fafb';
                          let borderColor = '#e5e7eb';
                          let textColor = '#374151';
                          
                          if (isCorrectOption) {
                            bgColor = '#d1fae5';
                            borderColor = '#10b981';
                            textColor = '#065f46';
                          } else if (isSelected && !isCorrect) {
                            bgColor = '#fee2e2';
                            borderColor = '#ef4444';
                            textColor = '#991b1b';
                          }

                          return (
                            <div
                              key={option.id}
                              style={{
                                padding: '0.75rem',
                                border: `2px solid ${borderColor}`,
                                borderRadius: '0.5rem',
                                backgroundColor: bgColor,
                                marginBottom: '0.5rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: textColor, fontWeight: '500' }}>{option.text}</span>
                                {isCorrectOption && <span style={{ color: '#059669' }}>✓ Correct</span>}
                                {isSelected && !isCorrect && <span style={{ color: '#dc2626' }}>✗ Your answer</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {question.explanation && (
                        <div style={{ 
                          backgroundColor: '#dbeafe', 
                          border: '1px solid #93c5fd', 
                          borderRadius: '0.5rem', 
                          padding: '1rem'
                        }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.25rem' }}>
                            Explanation:
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {quizData.allowRetake !== false && (
              <button
                onClick={handleRetake}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const hasAnswered = !!selectedAnswer;

  return (
    <div style={{ 
      minHeight: '100%', 
      backgroundColor: '#f3f4f6',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '56rem',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '2.5rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{title}</h2>
            {quizData.timeLimit && (
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                ⏱️ Time limit: {quizData.timeLimit} minutes
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <div style={{ flex: 1, backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
              <div
                style={{
                  backgroundColor: '#2563eb',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  transition: 'width 0.3s',
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
                }}
              />
            </div>
            <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{
              flexShrink: 0,
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#dbeafe',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              color: '#1d4ed8'
            }}>
              {currentQuestionIndex + 1}
            </span>
            <p style={{ fontSize: '1.25rem', fontWeight: '500', color: '#111827', paddingTop: '0.25rem' }}>
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div>
            {currentQuestion.options.map(option => {
              const isSelected = selectedAnswer === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  disabled={submitted}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    textAlign: 'left',
                    border: `2px solid ${isSelected ? '#2563eb' : '#e5e7eb'}`,
                    borderRadius: '0.5rem',
                    backgroundColor: isSelected ? '#eff6ff' : 'white',
                    marginBottom: '0.75rem',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (!submitted && !isSelected) {
                      e.currentTarget.style.borderColor = '#93c5fd';
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!submitted && !isSelected) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '9999px',
                      border: `2px solid ${isSelected ? '#2563eb' : '#d1d5db'}`,
                      backgroundColor: isSelected ? '#2563eb' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isSelected && (
                        <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '9999px' }} />
                      )}
                    </div>
                    <span style={{ fontWeight: '500', color: isSelected ? '#1e3a8a' : '#374151' }}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: currentQuestionIndex === 0 ? '#f3f4f6' : '#e5e7eb',
              color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151',
              border: 'none',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (currentQuestionIndex !== 0) e.currentTarget.style.backgroundColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              if (currentQuestionIndex !== 0) e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: 
                    index === currentQuestionIndex ? '#2563eb' :
                    selectedAnswers[quizData.questions[index].id] ? '#d1fae5' : '#f3f4f6',
                  color: 
                    index === currentQuestionIndex ? 'white' :
                    selectedAnswers[quizData.questions[index].id] ? '#065f46' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (index !== currentQuestionIndex) {
                    e.currentTarget.style.backgroundColor = selectedAnswers[quizData.questions[index].id] ? '#a7f3d0' : '#e5e7eb';
                  }
                }}
                onMouseOut={(e) => {
                  if (index !== currentQuestionIndex) {
                    e.currentTarget.style.backgroundColor = selectedAnswers[quizData.questions[index].id] ? '#d1fae5' : '#f3f4f6';
                  }
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== totalQuestions}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                backgroundColor: Object.keys(selectedAnswers).length === totalQuestions ? '#16a34a' : '#f3f4f6',
                color: Object.keys(selectedAnswers).length === totalQuestions ? 'white' : '#9ca3af',
                border: 'none',
                cursor: Object.keys(selectedAnswers).length === totalQuestions ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (Object.keys(selectedAnswers).length === totalQuestions) {
                  e.currentTarget.style.backgroundColor = '#15803d';
                }
              }}
              onMouseOut={(e) => {
                if (Object.keys(selectedAnswers).length === totalQuestions) {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }
              }}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                backgroundColor: hasAnswered ? '#2563eb' : '#f3f4f6',
                color: hasAnswered ? 'white' : '#9ca3af',
                border: 'none',
                cursor: hasAnswered ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (hasAnswered) e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                if (hasAnswered) e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              Next →
            </button>
          )}
        </div>

        {/* Answer count indicator */}
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
          {Object.keys(selectedAnswers).length} of {totalQuestions} questions answered
        </div>
      </div>
    </div>
  );
}
