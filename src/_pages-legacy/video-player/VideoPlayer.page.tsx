'use client';

import { logger } from '@/lib/utils/logger';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCourseAccess } from '@/hooks/course/useCourseAccess';
import { fetchWithAuth } from '@/lib/utils/apiInterceptor';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { useAlert } from '@/hooks/useAlert';

const VideoPlayerWrapper = dynamic(
  () => import('@/components/features/VideoPlayer').then(mod => ({ default: mod.VideoPlayerWrapper })),
  { ssr: false }
);

const PDFViewerSimple = dynamic(
  () => import('@/components/features/PDFViewer/PDFViewerSimple').then(mod => ({ default: mod.PDFViewerSimple })),
  { ssr: false }
);

const QuizViewer = dynamic(
  () => import('@/components/features/QuizViewer/QuizViewer').then(mod => ({ default: mod.QuizViewer })),
  { ssr: false }
);

interface LessonData {
  id: string;
  title: string;
  description?: string;
  contentType: 'VIDEO' | 'PDF' | 'QUIZ';
  videoType?: 'UPLOAD' | 'YOUTUBE';
  videoUrl?: string;
  videoUrls?: Record<string, string>;
  hlsMasterPlaylist?: string;
  hlsQualities?: Record<string, string>;
  thumbnail?: string;
  pdfUrl?: string;
  pdfPassword?: string;
  quizData?: {
    questions: Array<{
      id: string;
      question: string;
      options: Array<{ id: string; text: string }>;
      correctAnswer: string;
      explanation?: string;
      points?: number;
    }>;
    passingScore?: number;
    timeLimit?: number;
    allowRetake?: boolean;
  };
  order: number;
  module: {
    id: string;
    title: string;
    order: number;
    course: {
      id: string;
      title: string;
      modules: Array<{
        id: string;
        title: string;
        order: number;
        lessons: Array<{
          id: string;
          title: string;
          order: number;
          contentType: 'VIDEO' | 'PDF' | 'QUIZ';
        }>;
      }>;
    };
    lessons: Array<{
      id: string;
      title: string;
      order: number;
    }>;
  };
  previousLesson?: { id: string; title: string } | null;
  nextLesson?: { id: string; title: string } | null;
  // Access flags set by the backend (GET /lessons/:id):
  // `locked` = paid lesson the viewer hasn't unlocked (media stripped);
  // `isFree` = the free first-lesson preview.
  locked?: boolean;
  isFree?: boolean;
}

interface VideoPlayerPageProps {
  lessonId: string;
}

export default function VideoPlayerPage({ lessonId }: VideoPlayerPageProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [courseId, setCourseId] = useState<string | null>(null);
  
  // Use the new centralized access hook
  const { hasAccess: hasPurchased, isLoading: checkingPurchase } = useCourseAccess(courseId);

  // Set courseId when lesson data loads
  useEffect(() => {
    if (lessonData?.module?.course?.id) {
      setCourseId(lessonData.module.course.id);
    }
  }, [lessonData?.module?.course?.id]);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        // Fetch via fetchWithAuth so the access token (if any) reaches the
        // backend — it decides whether this lesson is unlocked for the viewer.
        const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
        const response = await fetchWithAuth(`${apiUrl}/lessons/${lessonId}`);
        const result = await response.json();
        
        logger.debug('API Response:', result);
        
        if (result.success && result.data) {
          logger.debug('Lesson Data Structure:', {
            hasModule: !!result.data.module,
            hasCourse: !!result.data.module?.course,
            hasModules: !!result.data.module?.course?.modules,
            moduleCount: result.data.module?.course?.modules?.length || 0,
            contentType: result.data.contentType
          });
          setLessonData(result.data);
          if (result.data.module?.id) {
            setExpandedModules(new Set([result.data.module.id]));
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load lesson:', error);
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId]);

  const isFirstLesson = (checkLessonId: string) => {
    const allLessons = getAllLessonsInOrder();
    if (allLessons.length === 0) return false;
    return allLessons[0].id === checkLessonId;
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const navigateToLesson = (newLessonId: string) => {
    // Don't block navigation if still checking purchase
    if (checkingPurchase) {
      logger.debug('Still checking purchase, please wait...');
      return;
    }
    
    // Check if user can access this lesson
    if (!hasPurchased && !isFirstLesson(newLessonId)) {
      showAlert({
        variant: 'warning',
        title: 'Lesson Locked',
        message: 'This lesson is locked. Please purchase the course to access all lessons.',
        duration: 5000,
      });
      return;
    }
    router.push(`/video-player/${newLessonId}`);
  };

  const getAllLessonsInOrder = () => {
    if (!lessonData?.module?.course?.modules) return [];
    
    const allLessons: Array<{ id: string; moduleId: string; order: number; moduleOrder: number }> = [];
    
    lessonData.module.course.modules.forEach(module => {
      if (module.lessons) {
        module.lessons.forEach(lesson => {
          allLessons.push({
            id: lesson.id,
            moduleId: module.id,
            order: lesson.order,
            moduleOrder: module.order
          });
        });
      }
    });
    
    return allLessons.sort((a, b) => {
      if (a.moduleOrder !== b.moduleOrder) {
        return a.moduleOrder - b.moduleOrder;
      }
      return a.order - b.order;
    });
  };

  const handleNext = () => {
    if (!lessonData) return;
    
    // Don't allow navigation if still checking purchase
    if (checkingPurchase) {
      logger.debug('Still checking purchase, please wait...');
      return;
    }
    
    const allLessons = getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextLessonId = allLessons[currentIndex + 1].id;
      
      // Check if user can access next lesson
      if (!hasPurchased && !isFirstLesson(nextLessonId)) {
        showAlert({
          variant: 'warning',
          title: 'Lesson Locked',
          message: 'This lesson is locked. Please purchase the course to access all lessons.',
          duration: 5000,
        });
        return;
      }
      
      navigateToLesson(nextLessonId);
    }
  };

  const handlePrevious = () => {
    if (!lessonData) return;
    
    const allLessons = getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    
    if (currentIndex > 0) {
      navigateToLesson(allLessons[currentIndex - 1].id);
    }
  };

  const hasNext = () => {
    if (!lessonData) return false;
    
    const allLessons = getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    
    return currentIndex >= 0 && currentIndex < allLessons.length - 1;
  };

  const hasPrevious = () => {
    if (!lessonData) return false;
    
    const allLessons = getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    
    return currentIndex > 0;
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    logger.debug(`Quiz completed: ${score}/${totalQuestions} correct`);
    // TODO: Save quiz results to backend
  };

  if (loading || checkingPurchase) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center" style={{ paddingTop: '68px' }}>
          <div className="text-white text-xl">Loading content...</div>
        </div>
      </>
    );
  }

  if (!lessonData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center" style={{ paddingTop: '68px' }}>
          <div className="text-red-400 text-xl">Content not available</div>
        </div>
      </>
    );
  }

  // Backend-enforced paywall: a locked (paid, un-purchased) lesson comes back
  // with its media stripped. Show an upgrade prompt instead of a broken player.
  if (lessonData.locked) {
    const lockedCourseId = lessonData.module?.course?.id;
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen flex items-center justify-center px-4"
          style={{
            paddingTop: '68px',
            background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)',
          }}
        >
          <div className="text-center max-w-md">
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
            <h1
              style={{
                color: 'white',
                fontFamily: 'Syne, sans-serif',
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              This lesson is locked
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
              Purchase <strong>{lessonData.module?.course?.title || 'this course'}</strong> to unlock all
              lessons. The first lesson is free to preview.
            </p>
            <button
              onClick={() => router.push(lockedCourseId ? `/course/${lockedCourseId}` : '/courses')}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                color: 'white',
                padding: '14px 30px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 4px 24px rgba(14,165,233,.35)',
              }}
            >
              View course & purchase →
            </button>
          </div>
        </div>
      </>
    );
  }

  logger.debug('Lesson Data:', lessonData);
  logger.debug('Content Type:', lessonData.contentType);

  const contentType = lessonData.contentType || 'VIDEO';
  const hasFullNavigation = !!(lessonData.module?.course?.modules && lessonData.module.course.modules.length > 0);

  // Render sidebar for navigation
  const renderSidebar = () => (
    // Hidden on phones so the 320px lesson list doesn't crush the video; shows from md up.
    <div className="hidden md:block w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-white text-lg font-semibold mb-4">
          {lessonData.module.course.title}
        </h2>
        
        <div className="space-y-2">
          {lessonData.module.course.modules
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <div key={module.id} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-4 py-3 bg-gray-750 hover:bg-gray-700 text-left flex items-center justify-between transition-colors"
                >
                  <span className="text-white font-medium text-sm">{module.title}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedModules.has(module.id) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedModules.has(module.id) && module.lessons && (
                  <div className="bg-gray-800">
                    {module.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => {
                        const isLocked = !hasPurchased && !isFirstLesson(lesson.id);
                        const icon = lesson.contentType === 'PDF' ? '📄' : 
                                   lesson.contentType === 'QUIZ' ? '📝' : '🎥';
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(lesson.id)}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors ${lesson.id === lessonId ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{icon}</span>
                              <span className="truncate">{lesson.title}</span>
                              {isLocked && <span className="text-xs">🔒</span>}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Render navigation header
  const renderHeader = () => (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">{lessonData.title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious()}
            className={`px-4 py-2 rounded-lg transition-colors ${hasPrevious() ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          >
            &larr; Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNext()}
            className={`px-4 py-2 rounded-lg transition-colors ${hasNext() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );

  // QUIZ CONTENT TYPE
  if (contentType === 'QUIZ') {
    if (!lessonData.quizData || !lessonData.quizData.questions || lessonData.quizData.questions.length === 0) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">No quiz available</div>
            <div className="text-gray-400 text-sm">This lesson does not have a quiz configured yet.</div>
          </div>
        </div>
      );
    }

    if (hasFullNavigation) {
      return (
        <>
          <Navbar />
          <div className="video-player-page flex bg-gray-900" style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}>
            {renderSidebar()}
            <div className="flex-1 flex flex-col">
              {renderHeader()}
              <div className="flex-1 bg-white overflow-y-auto">
                <QuizViewer
                  quizData={{ timeLimit: 0, maxAttempts: 0, ...lessonData.quizData }}
                  title={lessonData.title}
                  lessonId={lessonData.id}
                  courseId={lessonData.module.course.id}
                  onComplete={handleQuizComplete}
                />
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Navbar />
        <div className="flex flex-col bg-gray-900" style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}>
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <h1 className="text-white text-xl font-semibold">{lessonData.title}</h1>
          </div>
          <div className="flex-1 bg-white overflow-y-auto">
            <QuizViewer
              quizData={{ timeLimit: 0, maxAttempts: 0, ...lessonData.quizData }}
              title={lessonData.title}
              lessonId={lessonData.id}
              courseId={lessonData.module.course.id}
              onComplete={handleQuizComplete}
            />
          </div>
        </div>
      </>
    );
  }

  // PDF CONTENT TYPE
  if (contentType === 'PDF') {
    if (!lessonData.pdfUrl) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">No PDF available</div>
            <div className="text-gray-400 text-sm">This lesson does not have a PDF uploaded yet.</div>
          </div>
        </div>
      );
    }

    if (hasFullNavigation) {
      return (
        <>
          <Navbar />
          <div className="video-player-page flex bg-gray-900" style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}>
            {renderSidebar()}
            <div className="flex-1 flex flex-col">
              {renderHeader()}
              <div className="flex-1 bg-white overflow-hidden">
                <PDFViewerSimple
                  pdfUrl={lessonData.pdfUrl}
                  password={lessonData.pdfPassword}
                  title={lessonData.title}
                />
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Navbar />
        <div className="flex flex-col bg-gray-900" style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}>
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <h1 className="text-white text-xl font-semibold">{lessonData.title}</h1>
          </div>
          <div className="flex-1 bg-white overflow-hidden">
            <PDFViewerSimple
              pdfUrl={lessonData.pdfUrl}
              password={lessonData.pdfPassword}
              title={lessonData.title}
            />
          </div>
        </div>
      </>
    );
  }

  // VIDEO CONTENT TYPE (default)
  const isYouTube = lessonData.videoType === 'YOUTUBE';
  const hasHLS = lessonData.hlsMasterPlaylist || (lessonData.hlsQualities && Object.keys(lessonData.hlsQualities).length > 0);
  const hasMP4 = lessonData.videoUrls && Object.keys(lessonData.videoUrls).length > 0;
  
  if (isYouTube && !lessonData.videoUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">No YouTube URL available</div>
          <div className="text-gray-400 text-sm">Please add the YouTube URL from the course editor.</div>
        </div>
      </div>
    );
  }
  
  if (!isYouTube && !hasHLS && !hasMP4) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">No video source available</div>
          <div className="text-gray-400 text-sm">Please upload and publish the video from the course editor.</div>
        </div>
      </div>
    );
  }

  if (hasFullNavigation) {
    return (
      <>
        <Navbar />
        <div className="video-player-page flex bg-gray-900" style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}>
          {renderSidebar()}
          <div className="flex-1 flex flex-col">
            {renderHeader()}
            <div className="flex-1 bg-black flex items-center justify-center p-6">
              <div className="w-full max-w-6xl">
                <VideoPlayerWrapper
                  videoType={lessonData.videoType || 'UPLOAD'}
                  hlsMasterPlaylist={lessonData.hlsMasterPlaylist}
                  hlsQualities={lessonData.hlsQualities}
                  videoUrls={lessonData.videoUrls}
                  videoUrl={lessonData.videoUrl}
                  thumbnail={lessonData.thumbnail}
                  title={lessonData.title}
                  autoplay={false}
                  className="rounded-lg overflow-hidden"
                />
              </div>
            </div>
            {lessonData.description && (
              <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
                <p className="text-gray-300">{lessonData.description}</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-gray-900" style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}>
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <h1 className="text-white text-xl font-semibold">{lessonData.title}</h1>
        </div>
        <div className="flex-1 bg-black flex items-center justify-center p-6">
          <div className="w-full max-w-6xl">
            <VideoPlayerWrapper
              videoType={lessonData.videoType || 'UPLOAD'}
              hlsMasterPlaylist={lessonData.hlsMasterPlaylist}
              hlsQualities={lessonData.hlsQualities}
              videoUrls={lessonData.videoUrls}
              videoUrl={lessonData.videoUrl}
              thumbnail={lessonData.thumbnail}
              title={lessonData.title}
              autoplay={false}
              className="rounded-lg overflow-hidden"
            />
          </div>
        </div>
        {lessonData.description && (
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
            <p className="text-gray-300">{lessonData.description}</p>
          </div>
        )}
      </div>
    </>
  );
}
