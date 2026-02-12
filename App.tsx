import React, { useState } from 'react';
import { ProposalScreen } from './components/ProposalScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { FloatingHeart } from './components/FloatingHeart';
import { AppState } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.PROPOSAL);

  // Generate background hearts
  const hearts = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5,
    left: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 5 + 5,
  }));

  return (
    <div className="min-h-screen bg-pink-100 overflow-hidden relative selection:bg-pink-300 selection:text-white">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((heart) => (
          <FloatingHeart
            key={heart.id}
            delay={heart.delay}
            left={heart.left}
            size={heart.size}
            duration={heart.duration}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4">
        {appState === AppState.PROPOSAL ? (
          <ProposalScreen onSuccess={() => setAppState(AppState.SUCCESS)} />
        ) : (
          <SuccessScreen />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-2 w-full text-center text-pink-300 text-xs font-semibold pointer-events-none z-0">
        Made with ❤️ using Gemini
      </footer>
    </div>
  );
}

export default App;