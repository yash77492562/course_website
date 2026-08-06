'use client';

import { logger } from '@/lib/utils/logger';
import { useState, useEffect } from 'react';

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
        
        // Auth is the httpOnly access-token cookie; a 401 below means not logged in.
        // Call backend API directly
        const BACKEND_API = process.env.NEXT_PUBLIC_API_URL as string;
        const url = `${BACKEND_API}/quiz/start`;

        logger.debug('📡 Step 2: Calling backend API...');
        logger.debug('📡 Backend URL:', BACKEND_API);
        logger.debug('📡 Full endpoint:', url);
        logger.debug('📡 Request body:', { lessonId, courseId });

        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonId, courseId }),
        });

        if (response.status === 401) {
          throw new Error('You must be logged in to take this quiz');
        }

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
          
          const previousAnswers = data.data.lastAttemptAnswers || {};
          setLastAttemptAnswers(previousAnswers); 
          setSelectedAnswers(previousAnswers); // Populate selected answers so score calculates correctly
          setTimerActive(false); 
          setShowResults(true); // Show results screen immediately
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

      // Auth: sendBeacon can't set headers, but the browser attaches the
      // httpOnly access-token cookie automatically (same-site) — no ?token= hack.
      navigator.sendBeacon(url, blob);

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
      // Call backend API directly — the httpOnly cookie authenticates.
      const BACKEND_API = process.env.NEXT_PUBLIC_API_URL as string;

      const response = await fetch(`${BACKEND_API}/quiz/submit`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
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
      <div className="min-h-full py-8 px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-primary/10 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(37,99,235,0.15)] relative overflow-hidden py-16 px-10 text-center">
          <div className="text-5xl mb-6 animate-spin">
            ⏳
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Preparing your Quiz...
          </h3>
          <p className="text-slate-600 text-[17px]">
            Loading questions and checking attempts
          </p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="min-h-full py-8 px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-primary/10 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(37,99,235,0.15)] relative overflow-hidden py-16 px-10 text-center">
          <div className="text-5xl mb-6">
            ❌
          </div>
          <h3 className="text-2xl font-semibold text-red-800 mb-3">
            Failed to Start Quiz
          </h3>
          <p className="text-slate-600 text-[17px] mb-8">
            {initError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="py-3 px-8 bg-primary hover:bg-primary/90 text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
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
      // Call backend API directly — the httpOnly cookie authenticates.
      const BACKEND_API = process.env.NEXT_PUBLIC_API_URL as string;

      const response = await fetch(`${BACKEND_API}/quiz/submit`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
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
      <div className="min-h-full py-8 px-6">
        <div className="max-w-4xl mx-auto bg-white border border-primary/10 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(37,99,235,0.15)] p-8 md:p-14 relative overflow-hidden">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Quiz Results
            </h2>
            <div className={`text-7xl md:text-8xl font-bold mb-6 tracking-tighter ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
              {score}%
            </div>
            <p className="text-xl font-medium text-slate-600 mb-4">
              You got {correctCount} out of {totalQuestions} questions correct
            </p>
            {quizData.passingScore && (
              <p className="text-slate-400">
                Passing score required: {quizData.passingScore}%
              </p>
            )}
            
            {passed ? (
              <div className="mt-8 inline-block px-6 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <p className="text-emerald-800 font-medium m-0 flex items-center gap-2">
                  <span className="text-xl">🎉</span> Congratulations! You passed!
                </p>
              </div>
            ) : (
              <div className="mt-8 inline-block px-6 py-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-800 font-medium m-0">
                  {quizData.maxAttempts > 0 && currentAttempt >= quizData.maxAttempts 
                    ? 'You did not pass and have reached the maximum number of attempts.'
                    : 'Keep trying! You can retake the quiz.'}
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Review Your Answers
            </h3>
            {quizData.questions.map((question, index) => {
              const selectedOptionId = selectedAnswers[question.id];
              const isAnswered = !!selectedOptionId;
              const isCorrect = selectedOptionId === question.correctAnswer;

              return (
                <div key={question.id} className="border border-slate-200 rounded-lg p-6 mb-6">
                  <div className="flex gap-3">
                    <span className="shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-slate-700">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-900 mb-4">
                        {question.question}
                      </p>
                      
                      {/* Show status message */}
                      {!isAnswered && (
                        <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg mb-4">
                          <p className="text-sm text-blue-800 font-medium">
                            ℹ️ You didn't answer this question
                          </p>
                        </div>
                      )}
                      {isAnswered && isCorrect && (
                        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg mb-4">
                          <p className="text-sm text-emerald-800 font-medium">
                            ✓ Correct!
                          </p>
                        </div>
                      )}
                      {isAnswered && !isCorrect && (
                        <div className="p-3 bg-red-100 border border-red-300 rounded-lg mb-4">
                          <p className="text-sm text-red-800 font-medium">
                            ✗ Incorrect
                          </p>
                        </div>
                      )}
                      
                      {/* Show options */}
                      <div className="mb-4">
                        {question.options.map(option => {
                          const isSelected = option.id === selectedOptionId;
                          const isCorrectOption = option.id === question.correctAnswer;
                          
                          // Only show options that are relevant
                          const shouldShow = isCorrectOption || isSelected;
                          if (!shouldShow) return null;
                          
                          let bgClass = 'bg-gray-50';
                          let borderClass = 'border-slate-200';
                          let textClass = 'text-slate-700';
                          let label = '';
                          
                          if (!isAnswered && isCorrectOption) {
                            bgClass = 'bg-blue-100';
                            borderClass = 'border-blue-500';
                            textClass = 'text-blue-800';
                            label = '✓ Correct Answer';
                          } else if (isCorrectOption) {
                            bgClass = 'bg-emerald-100';
                            borderClass = 'border-emerald-500';
                            textClass = 'text-emerald-800';
                            label = '✓ Correct Answer';
                          } else if (isSelected && !isCorrect) {
                            bgClass = 'bg-red-100';
                            borderClass = 'border-red-500';
                            textClass = 'text-red-800';
                            label = '✗ Your Answer';
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-3 px-4 border-2 rounded-lg mb-2 ${bgClass} ${borderClass}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`${textClass} font-medium flex-1`}>
                                  {option.text}
                                </span>
                                <span className={`${textClass} font-semibold text-sm ml-4`}>
                                  {label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Always show explanation */}
                      {question.explanation && (
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                          <p className="text-sm font-semibold text-slate-700 mb-1">
                            💡 Explanation:
                          </p>
                          <p className="text-sm text-gray-600">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-12">
            {(quizData.maxAttempts === 0 || currentAttempt < quizData.maxAttempts) && (
              <button
                onClick={handleRetake}
                className="py-4 px-10 bg-primary text-white text-[17px] font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Retake Quiz {quizData.maxAttempts > 0 && `(${currentAttempt}/${quizData.maxAttempts})`}
              </button>
            )}
            {quizData.maxAttempts > 0 && currentAttempt >= quizData.maxAttempts && (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-slate-700 font-medium">
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
    <div className="min-h-full py-8 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-primary/10 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(37,99,235,0.15)] p-8 md:p-14 relative overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{title}</h2>
              {quizData.maxAttempts > 0 && (
                <p className="text-[15px] text-slate-500 font-semibold tracking-wide uppercase">
                  Attempt {currentAttempt}/{quizData.maxAttempts}
                </p>
              )}
              {quizData.maxAttempts === 0 && (
                <p className="text-[15px] text-slate-500 font-semibold tracking-wide uppercase">
                  Attempt {currentAttempt} (Unlimited attempts)
                </p>
              )}
            </div>
            {!readOnlyMode && (
              <div className={`text-[17px] font-mono font-bold border border-primary/20 shadow-sm py-2 px-4 rounded-lg ${timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-primary/10 text-primary'}`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2">
              <div
                className="bg-primary h-2 shadow-[0_0_10px_rgba(37,99,235,0.5)] rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
        </div>

        {/* Last Attempt Warning Banner */}
        {!readOnlyMode && isLastAttempt && lastAttemptWarning && (
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-500 rounded-lg flex items-center gap-3">
            <div className="text-2xl">
              ⚠️
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">
                Last Attempt Warning
              </p>
              <p className="text-sm text-amber-900">
                {lastAttemptWarning}
              </p>
            </div>
          </div>
        )}

        {/* Read-Only Mode Banner */}
        {readOnlyMode && (
          <div className="p-4 bg-amber-50 border-2 border-amber-500 rounded-lg mb-6 flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">
                Read-Only Mode
              </p>
              <p className="text-sm text-amber-900">
                {readOnlyMessage}
              </p>
            </div>
          </div>
        )}

        {/* Question */}
        <div className="mb-8">
          <div className="flex gap-3 mb-6">
            <span className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
              {currentQuestionIndex + 1}
            </span>
            <p className="text-2xl font-bold text-slate-900 pt-1.5 leading-snug">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div>
            {currentQuestion.options.map(option => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === currentQuestion.correctAnswer;
              const userAnswer = lastAttemptAnswers[currentQuestion.id];
              const userSelectedThis = userAnswer === option.id;
              
              let baseClass = "w-full p-5 text-left border-2 rounded-2xl mb-4 opacity-100 transition-all duration-300 group ";
              let extraClass = "";
              let labelText = '';
              let labelClass = 'text-slate-700';

              if (readOnlyMode) {
                baseClass += "cursor-not-allowed ";
                if (!userAnswer) {
                  if (isCorrect) {
                    extraClass = "bg-blue-100 border-blue-500 text-blue-800";
                    labelText = '✓ Correct Answer';
                    labelClass = 'text-blue-800';
                  } else {
                    return null;
                  }
                } else if (isCorrect) {
                  extraClass = "bg-emerald-100 border-emerald-500 text-emerald-800";
                  labelText = '✓ Correct Answer';
                  labelClass = 'text-emerald-800';
                } else if (userSelectedThis) {
                  extraClass = "bg-red-100 border-red-500 text-red-800";
                  labelText = '✗ Your Answer';
                  labelClass = 'text-red-800';
                } else {
                  return null;
                }
              } else {
                baseClass += submitted ? "cursor-not-allowed " : "cursor-pointer hover:bg-primary/[0.02] hover:border-primary/40 ";
                if (isSelected) {
                  extraClass = "bg-primary/[0.04] border-primary shadow-sm";
                } else {
                  extraClass = "bg-white border-slate-200";
                }
              }
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  disabled={submitted || readOnlyMode}
                  className={`${baseClass} ${extraClass}`}
                >
                  <div className="flex items-center gap-3">
                    {!readOnlyMode && (
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary shadow-sm' : 'border-slate-300 bg-transparent group-hover:border-primary/50'}`}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <span className={`font-medium ${readOnlyMode ? labelClass : (isSelected ? 'text-primary font-bold' : 'text-slate-700')}`}>
                        {option.text}
                      </span>
                      {readOnlyMode && labelText && (
                        <span className={`ml-3 text-sm font-semibold ${labelClass}`}>
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
              <div className="p-3 px-4 bg-blue-100 border-2 border-blue-500 rounded-lg mt-2">
                <p className="text-sm text-blue-800 font-medium m-0">
                  ℹ️ You didn't answer this question in your last attempt
                </p>
              </div>
            )}
            
            {/* Show explanation in read-only mode */}
            {readOnlyMode && currentQuestion.explanation && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  💡 Explanation:
                </p>
                <p className="text-sm text-gray-600 m-0">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`py-3 px-8 rounded-xl font-semibold tracking-wide transition-colors duration-200 border-none ${currentQuestionIndex === 0 ? 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed' : 'bg-slate-100 text-slate-700 cursor-pointer hover:bg-gray-300'}`}
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {quizData.questions.map((_, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isAnswered = selectedAnswers[quizData.questions[index].id];
              let btnClass = "w-8 h-8 rounded-full text-sm font-medium border-none cursor-pointer transition-all duration-200 ";
              
              if (isCurrent) {
                btnClass += "bg-blue-600 text-foreground";
              } else if (isAnswered) {
                btnClass += "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
              } else {
                btnClass += "bg-gray-100 text-gray-500 hover:bg-slate-100";
              }
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={btnClass}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {isLastQuestion ? (
            readOnlyMode ? (
              <div className="py-3 px-8 rounded-xl font-semibold tracking-wide bg-slate-50 text-slate-400 border border-slate-100 text-center">
                View Only
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== totalQuestions}
                className={`py-3 px-8 rounded-xl font-semibold tracking-wide border-none transition-colors duration-200 ${Object.keys(selectedAnswers).length === totalQuestions ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 shadow-[0_4px_14px_rgba(5,150,105,0.25)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.35)] hover:-translate-y-0.5' : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'}`}
              >
                Submit Quiz
              </button>
            )
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className={`py-3 px-8 rounded-xl font-semibold tracking-wide border-none transition-colors duration-200 ${hasAnswered ? 'bg-primary text-white cursor-pointer hover:bg-primary/90 shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5' : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'}`}
            >
              Next →
            </button>
          )}
        </div>

        {/* Answer count indicator */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {Object.keys(selectedAnswers).length} of {totalQuestions} questions answered
        </div>
      </div>
    </div>
  );
}
