'use client';

import { HLSVideoPlayer } from './HLSVideoPlayer';
import { YouTubePlayer } from './YouTubePlayer';

interface VideoPlayerWrapperProps {
  videoType?: 'UPLOAD' | 'YOUTUBE';
  hlsMasterPlaylist?: string;
  hlsQualities?: Record<string, string>;
  videoUrls?: Record<string, string>;
  videoUrl?: string;
  thumbnail?: string;
  title: string;
  autoplay?: boolean;
  className?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function VideoPlayerWrapper({
  videoType = 'UPLOAD',
  hlsMasterPlaylist,
  hlsQualities,
  videoUrls,
  videoUrl,
  thumbnail,
  title,
  autoplay = false,
  className = '',
  onNext,
  onPrevious
}: VideoPlayerWrapperProps) {
  if (videoType === 'YOUTUBE' && videoUrl) {
    return (
      <YouTubePlayer
        videoUrl={videoUrl}
        title={title}
        className={className}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    );
  }

  return (
    <HLSVideoPlayer
      hlsMasterPlaylist={hlsMasterPlaylist}
      hlsQualities={hlsQualities}
      videoUrls={videoUrls}
      thumbnail={thumbnail}
      title={title}
      autoplay={autoplay}
      className={className}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
}
