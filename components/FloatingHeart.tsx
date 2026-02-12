import React from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeartProps {
  delay: number;
  left: number;
  size: number;
  duration: number;
}

export const FloatingHeart: React.FC<FloatingHeartProps> = ({ delay, left, size, duration }) => {
  return (
    <div
      className="absolute text-pink-300 opacity-40 animate-float"
      style={{
        left: `${left}%`,
        top: '100%',
        animation: `float-up ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Heart fill="currentColor" size={size} />
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
