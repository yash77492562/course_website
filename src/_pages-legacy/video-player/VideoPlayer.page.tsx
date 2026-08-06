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
        const response = await fetchWithAuth(`${apiUrl}/lessons/${lessonId}`, {
          cache: 'no-store'
        });
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
        <div className="min-h-screen bg-black flex items-center justify-center pt-[68px]">
          <div className="text-foreground text-xl">Loading content...</div>
        </div>
      </>
    );
  }

  if (!lessonData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center pt-[68px]">
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
            background: 'var(--color-background)',
          }}
        >
          <div className="text-center max-w-md">
            <div className="text-[64px] mb-[24px]">🔒</div>
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
            <p className="text-foreground/70 text-[15px] mb-[32px] leading-[1.6]">
              Purchase <strong>{lessonData.module?.course?.title || 'this course'}</strong> to unlock all
              lessons. The first lesson is free to preview.
            </p>
            <button
              onClick={() => router.push(lockedCourseId ? `/course/${lockedCourseId}` : '/courses')}
              style={{
                background: 'var(--color-primary)',
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
  const renderSidebar = (isMobile = false) => (
    <div className={`${isMobile ? 'block md:hidden w-full border-t border-slate-200/60 bg-white/30' : 'hidden md:block w-[320px] bg-transparent border-r border-slate-200/60 overflow-y-auto shrink-0 z-10'}`}>
      <div className={isMobile ? "p-4" : "p-6"}>
        <h2 className="text-[#0f172a] text-lg font-bold mb-4 md:mb-6 font-display tracking-tight">
          {isMobile ? 'Course Content' : lessonData.module.course.title}
        </h2>
        
        <div className="space-y-3">
          {lessonData.module.course.modules
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <div key={module.id} className="border border-slate-200/60 rounded-xl overflow-hidden bg-white/40 shadow-sm backdrop-blur-sm transition-all duration-300">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-5 py-4 hover:bg-white/50 text-left flex items-center justify-between transition-colors"
                >
                  <span className="text-[#0f172a] font-semibold text-sm">{module.title}</span>
                  <svg
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedModules.has(module.id) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedModules.has(module.id) && module.lessons && (
                  <div className="bg-white/40 border-t border-white/30">
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
                            className={`w-full px-5 py-3 text-left text-sm transition-all duration-200 ${lesson.id === lessonId ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 border-l-4 border-transparent'}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{icon}</span>
                              <span className="truncate flex-1">{lesson.title}</span>
                              {isLocked && <span className="text-xs opacity-60">🔒</span>}
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
    <div 
      className="backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between z-10 sticky top-0 shadow-sm"
      style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
    >
      <h1 className="text-[#0f172a] text-lg md:text-xl font-bold font-display tracking-tight truncate pr-4">{lessonData.title}</h1>
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious()}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${hasPrevious() ? 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200 hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent'}`}
        >
          &larr; Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNext()}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${hasNext() ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_4px_14px_rgba(13,148,136,0.25)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.35)] hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent'}`}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );

  // Render mobile navigation controls
  const renderMobileNavControls = () => (
    <div className="md:hidden flex items-center justify-between gap-3 px-4 py-4 bg-white/40 border-t border-slate-200/60">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevious()}
        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-[0.95rem] transition-all duration-300 flex items-center justify-center gap-2 ${hasPrevious() ? 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent'}`}
      >
        &larr; Previous
      </button>
      <button
        onClick={handleNext}
        disabled={!hasNext()}
        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-[0.95rem] transition-all duration-300 flex items-center justify-center gap-2 ${hasNext() ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_4px_14px_rgba(13,148,136,0.25)]' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent'}`}
      >
        Next &rarr;
      </button>
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
          <div className="video-player-page flex h-[calc(100vh-68px)] mt-[68px]" style={{ background: 'var(--color-background)' }}>
            {renderSidebar()}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
              {renderHeader()}
              <div className="flex-1 bg-transparent overflow-y-auto">
                <QuizViewer
                  quizData={{ timeLimit: 0, maxAttempts: 0, ...lessonData.quizData }}
                  title={lessonData.title}
                  lessonId={lessonData.id}
                  courseId={lessonData.module.course.id}
                  onComplete={handleQuizComplete}
                />
                {renderMobileNavControls()}
                {renderSidebar(true)}
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Navbar />
        <div className="flex flex-col h-[calc(100vh-68px)] mt-[68px]" style={{ background: 'var(--color-background)' }}>
          <div 
            className="backdrop-blur-md border-b border-white/60 px-8 py-5"
            style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
          >
            <h1 className="text-[#0f172a] text-xl font-bold font-display tracking-tight">{lessonData.title}</h1>
          </div>
          <div className="flex-1 bg-transparent overflow-y-auto">
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
          <div className="video-player-page flex h-[calc(100vh-68px)] mt-[68px]" style={{ background: 'var(--color-background)' }}>
            {renderSidebar()}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
              {renderHeader()}
              <div className="flex-1 bg-transparent overflow-y-auto flex flex-col">
                <div className="flex-1 min-h-[50vh]">
                  <PDFViewerSimple
                    pdfUrl={lessonData.pdfUrl}
                    password={lessonData.pdfPassword}
                    title={lessonData.title}
                  />
                </div>
                {renderMobileNavControls()}
                {renderSidebar(true)}
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Navbar />
        <div className="flex flex-col h-[calc(100vh-68px)] mt-[68px]" style={{ background: 'var(--color-background)' }}>
          <div 
            className="backdrop-blur-md border-b border-white/60 px-8 py-5"
            style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
          >
            <h1 className="text-[#0f172a] text-xl font-bold font-display tracking-tight">{lessonData.title}</h1>
          </div>
          <div className="flex-1 bg-transparent overflow-hidden">
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
        <div className="video-player-page flex h-[calc(100vh-68px)] mt-[68px]" style={{ background: 'var(--color-background)' }}>
          {renderSidebar()}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
            {renderHeader()}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-center justify-center p-0 md:p-6 lg:p-10">
                <div className="w-full max-w-[1400px]">
                  {(!checkingPurchase && !hasPurchased && !isFirstLesson(lessonId)) ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-md rounded-none md:rounded-2xl border-y md:border border-white/60 shadow-lg">
                      <div className="text-5xl mb-6">🔒</div>
                      <h3 className="text-2xl font-bold text-[#0f172a] mb-3 font-display">Lesson Locked</h3>
                      <p className="text-slate-600 mb-8 text-center max-w-md text-lg px-4">
                        This lesson is locked. Please purchase the course to access all lessons and materials.
                      </p>
                      <button 
                        onClick={() => router.push(`/course/${lessonData.module?.course?.id}`)}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl transition-all duration-300 font-bold text-lg shadow-[0_4px_20px_rgba(13,148,136,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(13,148,136,0.4)]"
                      >
                        View Course
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-none md:rounded-2xl overflow-hidden shadow-none md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-0 md:ring-1 ring-black/5 bg-black">
                      <VideoPlayerWrapper
                        key={lessonData.id}
                        videoType={lessonData.videoType || 'UPLOAD'}
                        hlsMasterPlaylist={lessonData.hlsMasterPlaylist}
                        hlsQualities={lessonData.hlsQualities}
                        videoUrls={lessonData.videoUrls}
                        videoUrl={lessonData.videoUrl}
                        thumbnail={lessonData.thumbnail}
                        title={lessonData.title}
                        autoplay={false}
                        className="w-full aspect-video"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {renderMobileNavControls()}
              
              {lessonData.description && (
                <div className="bg-transparent border-t border-slate-200/60 px-5 md:px-8 py-6 md:py-8 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                  <h3 className="text-[#0f172a] font-bold text-lg mb-3 font-display">About this lesson</h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed max-w-4xl">{lessonData.description}</p>
                </div>
              )}
              
              {renderSidebar(true)}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-68px)] mt-[68px]" style={{ background: 'var(--color-background)' }}>
        <div 
          className="backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 z-10 sticky top-0 shadow-sm"
          style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
        >
          <h1 className="text-[#0f172a] text-xl font-bold font-display tracking-tight">{lessonData.title}</h1>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex items-center justify-center p-0 md:p-6 lg:p-10">
            <div className="w-full max-w-[1400px]">
              {(!checkingPurchase && !hasPurchased && !isFirstLesson(lessonId)) ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-md rounded-none md:rounded-2xl border-y md:border border-white/60 shadow-lg">
                  <div className="text-5xl mb-6">🔒</div>
                  <h3 className="text-2xl font-bold text-[#0f172a] mb-3 font-display">Lesson Locked</h3>
                  <p className="text-slate-600 mb-8 text-center max-w-md text-lg px-4">
                    This lesson is locked. Please purchase the course to access all lessons and materials.
                  </p>
                  <button 
                    onClick={() => router.push(`/course/${lessonData.module?.course?.id}`)}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl transition-all duration-300 font-bold text-lg shadow-[0_4px_20px_rgba(13,148,136,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(13,148,136,0.4)]"
                  >
                    View Course
                  </button>
                </div>
              ) : (
                <div className="rounded-none md:rounded-2xl overflow-hidden shadow-none md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-0 md:ring-1 ring-black/5 bg-black">
                  <VideoPlayerWrapper
                    key={lessonData.id}
                    videoType={lessonData.videoType || 'UPLOAD'}
                    hlsMasterPlaylist={lessonData.hlsMasterPlaylist}
                    hlsQualities={lessonData.hlsQualities}
                    videoUrls={lessonData.videoUrls}
                    videoUrl={lessonData.videoUrl}
                    thumbnail={lessonData.thumbnail}
                    title={lessonData.title}
                    autoplay={false}
                    className="w-full aspect-video"
                  />
                </div>
              )}
            </div>
          </div>
          {lessonData.description && (
            <div className="bg-transparent border-t border-slate-200/60 px-8 py-8 mt-auto z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              <h3 className="text-[#0f172a] font-bold text-lg mb-3 font-display">About this lesson</h3>
              <p className="text-slate-600 text-[15px] leading-relaxed max-w-4xl">{lessonData.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
