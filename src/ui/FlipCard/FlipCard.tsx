'use client';

import { ReactNode } from 'react';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
}

export function FlipCard({ front, back, isFlipped }: FlipCardProps) {
  return (
    <div className="flip-card-container">
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-front">
          {front}
        </div>
        <div className="flip-card-back">
          {back}
        </div>
      </div>

      <style jsx>{`
        .flip-card-container {
          perspective: 1000px;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .flip-card {
          position: relative;
          width: 100%;
          min-height: 400px;
          transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .flip-card.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flip-card-front {
          transform: rotateY(0deg);
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
