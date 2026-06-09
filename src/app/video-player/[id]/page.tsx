'use client';

import { useParams } from 'next/navigation';
import VideoPlayerPage from '@/_pages-legacy/video-player/VideoPlayer.page';

export default function VideoPlayerRoute() {
  const params = useParams();
  const lessonId = params?.id as string;

  if (!lessonId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Invalid lesson ID</div>
      </div>
    );
  }

  return <VideoPlayerPage lessonId={lessonId} />;
}
