interface LockedModuleProps {
  title: string;
  isLocked: boolean;
  children?: React.ReactNode;
}

export function LockedModule({ title, isLocked, children }: LockedModuleProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative opacity-60 pointer-events-none">
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-2">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span className="text-2xl">🔒</span>
      </div>
      
      {children && (
        <div className="pl-4 border-l-2 border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}

interface LockedLessonProps {
  title: string;
  duration?: string;
  isLocked: boolean;
}

export function LockedLesson({ title, duration, isLocked }: LockedLessonProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          {isLocked ? (
            <span className="text-sm">🔒</span>
          ) : (
            <span className="text-sm">▶️</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{title}</p>
          {duration && (
            <p className="text-xs text-slate-500">{duration}</p>
          )}
        </div>
      </div>
      
      {isLocked && (
        <span className="text-lg">🔒</span>
      )}
    </div>
  );
}
