'use client';

import { logger } from '@/lib/utils/logger';
import { useState, useEffect } from 'react';
import { tokenManager } from '@/lib/utils/tokenManager/tokenManager';

export interface QuizData {
  questions: QuizQuestion[];
  passingScore?: number;
  timeLimit: number;
  maxAttempts: number;
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
  lessonId: string;
  courseId: string;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export function QuizViewer({ quizData, title, lessonId, courseId, onComplete }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit * 60); // Convert minutes to seconds
  const [timerActive, setTimerActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  const [readOnlyMode, setReadOnlyMode] = useState(false); // New state for read-only mode
  const [readOnlyMessage, setReadOnlyMessage] = useState<string>(''); // Message to display in read-only mode
  const [lastAttemptAnswers, setLastAttemptAnswers] = useState<Record<string, string>>({}); // User's previous answers
  const [isLastAttempt, setIsLastAttempt] = useState(false); // Warning: this is the last attempt
  const [lastAttemptWarning, setLastAttemptWarning] = useState<string>(''); // Warning message for last attempt

  // Initialize quiz - call start API on mount
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        logger.debug('🎯 ========== QUIZ INITIALIZATION START ==========');
        setIsInitializing(true);
        setInitError(null);
        
        // Get access token
        logger.debug('🔑 Step 1: Getting access token from tokenManager...');
        const token = tokenManager.getAccessToken();
        logger.debug('🔑 Token exists:', !!token);
        logger.debug('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'NULL');
        
        if (!token) {
          throw new Error('You must be logged in to take this quiz');
        }

        // Call backend API directly
        const BACKEND_API = process.env.NEXT_PUBLIC_API_URL as string;
        const url = `${BACKEND_API}/quiz/start`;
        
        logger.debug('📡 Step 2: Calling backend API...');
        logger.debug('📡 Backend URL:', BACKEND_API);
        logger.debug('📡 Full endpoint:', url);
        logger.debug('📡 Request body:', { lessonId, courseId });
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ lessonId, courseId }),
        });

        logger.debug('📥 Step 3: Response received');
        logger.debug('📥 Status:', response.status, response.statusText);
        logger.debug('📥 OK:', response.ok);

        const data = await response.json();
        logger.debug('📥 Response data:', data);

        if (!response.ok || !data.success) {
          logger.error('❌ API call failed:', data);
          throw new Error(data.message || 'Failed to start quiz');
        }

        logger.debug('✅ Quiz started successfully!');
        logger.debug('✅ Attempt number:', data.data.attemptNumber);
        logger.debug('✅ Max attempts:', data.data.maxAttempts);
        logger.debug('✅ Read-only mode:', data.data.readOnly);

        // Set attempt number from response
        setCurrentAttempt(data.data.attemptNumber);
        
        // Check if it's read-only mode (max attempts reached)
        if (data.data.readOnly) {
          logger.debug('📖 Quiz opened in READ-ONLY mode');
          logger.debug('📖 Last attempt answers:', data.data.lastAttemptAnswers);
          setReadOnlyMode(true);
          setReadOnlyMessage(data.data.message || 'You have used all attempts. Viewing in read-only mode.');
          setLastAttemptAnswers(data.data.lastAttemptAnswers || {}); // Store user's previous answers
          setTimerActive(false); // No timer in read-only mode
        } else {
          logger.debug('✏️ Quiz opened in INTERACTIVE mode');
          
          // Check if this is the last attempt
          if (data.data.isLastAttempt) {
            logger.debug('⚠️ WARNING: This is the last attempt!');
            setIsLastAttempt(true);
            setLastAttemptWarning(data.data.message || 'This is your last attempt!');
          }
          
          setQuizStartTime(Date.now());
          setTimerActive(true);
        }
        
        logger.debug('🎯 ========== QUIZ INITIALIZATION COMPLETE ==========');
      } catch (error: any) {
        logger.error('❌ ========== QUIZ INITIALIZATION FAILED ==========');
        logger.error('❌ Error:', error);
        logger.error('❌ Error message:', error.message);
        logger.error('❌ Error stack:', error.stack);
        setInitError(error.message || 'Failed to start quiz. Please try again.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeQuiz();
  }, [lessonId, courseId]);

  // Countdown timer
  useEffect(() => {
    if (!timerActive || submitted || showResults) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, submitted, showResults]);

  // Handle browser close/refresh - save progress using sendBeacon
  useEffect(() => {
    if (readOnlyMode || submitted || showResults) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Prepare data to send
      const token = tokenManager.getAccessToken();
      if (!token) return;

      const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
      const BACKEND_API = process.env.NEXT_PUBLIC_API_URL as string;

      // Use sendBeacon for reliable data transmission during page unload
      const data = JSON.stringify({
        lessonId,
        courseId,
        answers: selectedAnswers,
        timeSpent,
      });

      const blob = new Blob([data], { type: 'application/json' });
      const url = `${BACKEND_API}/quiz/submit`;

      // Note: sendBeacon doesn't support custom headers, so we append token to URL
      navigator.sendBeacon(`${url}?token=${encodeURIComponent(token)}`, blob);

      // Show confirmation dialog
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [readOnlyMode, submitted, showResults, selectedAnswers, lessonId, courseId, quizStartTime]);

  const handleTimeUp = async () => {
    setTimerActive(false);
    setSubmitted(true);
    
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    
    try {
      // Get access token
      const token = tokenManager.getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Call backend API directly
      const BACKEND_API = process.env.NEXT_PUBLIC_API_URL as string;
      
      const response = await fetch(`${BACKEND_API}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId,
          courseId,
          answers: selectedAnswers,
          timeSpent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowResults(true);
        onComplete?.(data.data.correctAnswers, data.data.totalQuestions);
      } else {
        logger.error('Failed to submit quiz:', data.message);
        setShowResults(true);
      }
    } catch (error) {
      logger.error('Error submitting quiz:', error);
      // Still show results locally even if submission fails
      setShowResults(true);
      const correctAnswers = quizData.questions.filter(q => 
        selectedAnswers[q.id] === q.correctAnswer
      ).length;
      onComplete?.(correctAnswers, quizData.questions.length);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div style={{ 
        minHeight: '100%', 
        backgroundColor: '#f3f4f6',
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '32rem',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '3rem 2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1.5rem',
            animation: 'spin 1s linear infinite'
          }}>
            ⏳
          </div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '0.75rem'
          }}>
            Starting Quiz...
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Please wait while we prepare your quiz attempt
          </p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initError) {
    return (
      <div style={{ 
        minHeight: '100%', 
        backgroundColor: '#f3f4f6',
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '32rem',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '3rem 2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            ❌
          </div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#991b1b',
            marginBottom: '0.75rem'
          }}>
            Failed to Start Quiz
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '1.5rem' }}>
            {initError}
          </p>
          <button
            onClick={() => window.location.reload()}
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
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (submitted || readOnlyMode) return; // Disable selection in read-only mode
    
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

  const handleSubmit = async () => {
    setSubmitted(true);
    setTimerActive(false);
    
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    
    try {
      // Get access token
      const token = tokenManager.getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Call backend API directly
      const BACKEND_API = process.env.NEXT_PUBLIC_API_URL as string;
      
      const response = await fetch(`${BACKEND_API}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId,
          courseId,
          answers: selectedAnswers,
          timeSpent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowResults(true);
        onComplete?.(data.data.correctAnswers, data.data.totalQuestions);
      } else {
        logger.error('Failed to submit quiz:', data.message);
        setShowResults(true);
      }
    } catch (error) {
      logger.error('Error submitting quiz:', error);
      // Still show results locally even if submission fails
      setShowResults(true);
      const correctAnswers = quizData.questions.filter(q => 
        selectedAnswers[q.id] === q.correctAnswer
      ).length;
      onComplete?.(correctAnswers, quizData.questions.length);
    }
  };

  const handleRetake = () => {
    if (quizData.maxAttempts > 0 && currentAttempt >= quizData.maxAttempts) {
      return; // Don't allow retake if max attempts reached
    }
    
    // Reload the page to restart the quiz (will trigger new start API call)
    window.location.reload();
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
              const isAnswered = !!selectedOptionId;
              const isCorrect = selectedOptionId === question.correctAnswer;
              const correctOption = question.options.find(opt => opt.id === question.correctAnswer);

              return (
                <div key={question.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem', 
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                      
                      {/* Show status message */}
                      {!isAnswered && (
                        <div style={{ 
                          padding: '0.75rem', 
                          backgroundColor: '#dbeafe', 
                          border: '1px solid #93c5fd',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <p style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '500' }}>
                            ℹ️ You didn't answer this question
                          </p>
                        </div>
                      )}
                      {isAnswered && isCorrect && (
                        <div style={{ 
                          padding: '0.75rem', 
                          backgroundColor: '#d1fae5', 
                          border: '1px solid #6ee7b7',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <p style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: '500' }}>
                            ✓ Correct!
                          </p>
                        </div>
                      )}
                      {isAnswered && !isCorrect && (
                        <div style={{ 
                          padding: '0.75rem', 
                          backgroundColor: '#fee2e2', 
                          border: '1px solid #fca5a5',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <p style={{ fontSize: '0.875rem', color: '#991b1b', fontWeight: '500' }}>
                            ✗ Incorrect
                          </p>
                        </div>
                      )}
                      
                      {/* Show options */}
                      <div style={{ marginBottom: '1rem' }}>
                        {question.options.map(option => {
                          const isSelected = option.id === selectedOptionId;
                          const isCorrectOption = option.id === question.correctAnswer;
                          
                          // Only show options that are relevant
                          const shouldShow = isCorrectOption || isSelected;
                          if (!shouldShow) return null;
                          
                          // Color coding logic
                          let bgColor = '#f9fafb';
                          let borderColor = '#e5e7eb';
                          let textColor = '#374151';
                          let label = '';
                          
                          if (!isAnswered && isCorrectOption) {
                            // Not answered - show correct in BLUE
                            bgColor = '#dbeafe';
                            borderColor = '#3b82f6';
                            textColor = '#1e40af';
                            label = '✓ Correct Answer';
                          } else if (isCorrectOption) {
                            // Correct answer - show in GREEN
                            bgColor = '#d1fae5';
                            borderColor = '#10b981';
                            textColor = '#065f46';
                            label = '✓ Correct Answer';
                          } else if (isSelected && !isCorrect) {
                            // Wrong answer - show in RED
                            bgColor = '#fee2e2';
                            borderColor = '#ef4444';
                            textColor = '#991b1b';
                            label = '✗ Your Answer';
                          }

                          return (
                            <div
                              key={option.id}
                              style={{
                                padding: '0.75rem 1rem',
                                border: `2px solid ${borderColor}`,
                                borderRadius: '0.5rem',
                                backgroundColor: bgColor,
                                marginBottom: '0.5rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: textColor, fontWeight: '500', flex: 1 }}>
                                  {option.text}
                                </span>
                                <span style={{ 
                                  color: textColor, 
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  marginLeft: '1rem'
                                }}>
                                  {label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Always show explanation */}
                      {question.explanation && (
                        <div style={{ 
                          backgroundColor: '#f3f4f6', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '0.5rem', 
                          padding: '1rem'
                        }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                            💡 Explanation:
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {(quizData.maxAttempts === 0 || currentAttempt < quizData.maxAttempts) && (
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
                Retake Quiz {quizData.maxAttempts > 0 && `(${currentAttempt}/${quizData.maxAttempts})`}
              </button>
            )}
            {quizData.maxAttempts > 0 && currentAttempt >= quizData.maxAttempts && (
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '0.5rem' 
              }}>
                <p style={{ color: '#374151', fontWeight: '500' }}>
                  Maximum attempts reached ({quizData.maxAttempts})
                </p>
              </div>
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
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>{title}</h2>
              {quizData.maxAttempts > 0 && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  Attempt {currentAttempt}/{quizData.maxAttempts}
                </p>
              )}
              {quizData.maxAttempts === 0 && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  Attempt {currentAttempt} (Unlimited attempts)
                </p>
              )}
            </div>
            {!readOnlyMode && (
              <div style={{ 
                fontSize: '1.125rem', 
                fontFamily: 'monospace',
                fontWeight: '700',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: timeRemaining < 300 ? '#fee2e2' : '#dbeafe',
                color: timeRemaining < 300 ? '#991b1b' : '#1e40af'
              }}>
                ⏱️ {formatTime(timeRemaining)}
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

        {/* Last Attempt Warning Banner */}
        {!readOnlyMode && isLastAttempt && lastAttemptWarning && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '1.5rem' }}>
              ⚠️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.25rem' }}>
                Last Attempt Warning
              </p>
              <p style={{ fontSize: '0.875rem', color: '#78350f' }}>
                {lastAttemptWarning}
              </p>
            </div>
          </div>
        )}

        {/* Read-Only Mode Banner */}
        {readOnlyMode && (
          <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.25rem' }}>
                Read-Only Mode
              </p>
              <p style={{ fontSize: '0.875rem', color: '#78350f' }}>
                {readOnlyMessage}
              </p>
            </div>
          </div>
        )}

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
              const isCorrect = option.id === currentQuestion.correctAnswer;
              const userAnswer = lastAttemptAnswers[currentQuestion.id]; // What user selected in last attempt
              const userSelectedThis = userAnswer === option.id; // Did user select this option?
              
              // In read-only mode, determine styling based on correctness
              let optionStyle = {
                width: '100%',
                padding: '1rem',
                textAlign: 'left' as const,
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                marginBottom: '0.75rem',
                cursor: 'not-allowed',
                opacity: 1,
                transition: 'all 0.2s'
              };

              let labelText = '';
              let labelColor = '#374151';

              if (readOnlyMode) {
                // Read-only mode: show color coding
                if (!userAnswer) {
                  // User didn't answer - show correct answer in BLUE
                  if (isCorrect) {
                    optionStyle.backgroundColor = '#dbeafe';
                    optionStyle.border = '2px solid #3b82f6';
                    labelText = '✓ Correct Answer';
                    labelColor = '#1e40af';
                  } else {
                    // Hide other options when user didn't answer
                    return null;
                  }
                } else if (isCorrect) {
                  // Correct answer - always show in GREEN
                  optionStyle.backgroundColor = '#d1fae5';
                  optionStyle.border = '2px solid #10b981';
                  labelText = '✓ Correct Answer';
                  labelColor = '#065f46';
                } else if (userSelectedThis) {
                  // User's wrong answer - show in RED
                  optionStyle.backgroundColor = '#fee2e2';
                  optionStyle.border = '#ef4444';
                  labelText = '✗ Your Answer';
                  labelColor = '#991b1b';
                } else {
                  // Other options - hide them
                  return null;
                }
              } else {
                // Interactive mode
                if (isSelected) {
                  optionStyle.backgroundColor = '#eff6ff';
                  optionStyle.border = '#2563eb';
                }
                optionStyle.cursor = submitted ? 'not-allowed' : 'pointer';
                optionStyle.opacity = readOnlyMode ? 0.6 : 1;
              }
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  disabled={submitted || readOnlyMode}
                  style={optionStyle}
                  onMouseOver={(e) => {
                    if (!submitted && !readOnlyMode && !isSelected) {
                      e.currentTarget.style.border = '2px solid #93c5fd';
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!submitted && !readOnlyMode && !isSelected) {
                      e.currentTarget.style.border = '2px solid #e5e7eb';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {!readOnlyMode && (
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
                    )}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: '500', color: readOnlyMode ? labelColor : (isSelected ? '#1e3a8a' : '#374151') }}>
                        {option.text}
                      </span>
                      {readOnlyMode && labelText && (
                        <span style={{ 
                          marginLeft: '0.75rem', 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          color: labelColor 
                        }}>
                          {labelText}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            
            {/* Show message if user didn't answer this question in read-only mode */}
            {readOnlyMode && !lastAttemptAnswers[currentQuestion.id] && (
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#dbeafe',
                border: '2px solid #3b82f6',
                borderRadius: '0.5rem',
                marginTop: '0.5rem'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '500', margin: 0 }}>
                  ℹ️ You didn't answer this question in your last attempt
                </p>
              </div>
            )}
            
            {/* Show explanation in read-only mode */}
            {readOnlyMode && currentQuestion.explanation && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem'
              }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  💡 Explanation:
                </p>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
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
            readOnlyMode ? (
              <div style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                backgroundColor: '#f3f4f6',
                color: '#9ca3af',
                textAlign: 'center'
              }}>
                View Only
              </div>
            ) : (
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
            )
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
