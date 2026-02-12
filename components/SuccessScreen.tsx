import React, { useState, useEffect } from 'react';
import { generateLoveNote, generateValentineImage } from '../services/geminiService';
import { Sparkles, RefreshCw, Heart, Share2, Copy, Image as ImageIcon, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SuccessScreen: React.FC = () => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  // Image Generation State
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Auto generate image
    const initImage = async () => {
        setImageLoading(true);
        const img = await generateValentineImage();
        if (img) setGeneratedImage(img);
        setImageLoading(false);
    };
    initImage();

    return () => clearInterval(interval);
  }, []);

  const handleGenerateNote = async () => {
    setLoading(true);
    const generatedNote = await generateLoveNote({
      partnerName: partnerName || "My Love",
      tone: 'romantic'
    });
    setNote(generatedNote);
    setLoading(false);
    setShowInput(false);
  };

  const handleShare = async () => {
    if (!note) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Valentine Note',
          text: `"${note}"\n\n- Sent from 'Be My Valentine' ❤️`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`"${note}"`);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen z-10 relative p-6 text-center max-w-2xl mx-auto">
      
      {/* Image Section */}
      <div className="mb-8 flex flex-col items-center animate-float">
        <div className="relative mb-4">
          {imageLoading ? (
            <div className="w-64 h-64 rounded-xl flex flex-col items-center justify-center bg-pink-50 border-4 border-white shadow-lg relative overflow-hidden group">
               {/* Moving shimmer gradient */}
               <div 
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                 style={{
                   transform: 'skewX(-20deg) translateX(-150%)',
                   animation: 'shimmer 2s infinite linear'
                 }}
               />
               
               <div className="z-10 flex flex-col items-center justify-center h-full w-full">
                 <Heart className="text-pink-300 drop-shadow-sm mb-3 animate-heartbeat" size={64} fill="currentColor" />
                 <span className="text-pink-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                    Dreaming up...
                 </span>
               </div>

               <style>{`
                 @keyframes shimmer {
                   0% { transform: skewX(-20deg) translateX(-150%); }
                   100% { transform: skewX(-20deg) translateX(150%); }
                 }
               `}</style>
            </div>
          ) : (
            <img 
              src={generatedImage || "https://cdn.pixabay.com/photo/2023/01/27/05/10/teddy-7747803_1280.png"} 
              alt="Bears hugging" 
              className="rounded-xl shadow-lg w-64 h-64 object-cover mx-auto transition-all duration-500 border-4 border-white bg-white animate-breathe"
            />
          )}
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-pink-600 mb-4 flex items-center justify-center gap-3 flex-wrap drop-shadow-sm">
        Yay!!! I knew it! <Heart className="text-red-500 animate-heartbeat" fill="currentColor" />
      </h1>
      
      <p className="text-xl text-pink-800 mb-8 font-medium">
        Best day ever. You've made me the happiest person alive!
      </p>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full border border-pink-200 max-w-lg">
        <h2 className="text-2xl font-bold text-pink-500 mb-4 flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-400" /> A Special Note for You
        </h2>

        {!note && showInput && (
          <div className="flex flex-col gap-4 mb-4">
            <label className="text-gray-600 text-sm">Enter your name for a custom poem (optional):</label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Your Name"
                    className="flex-1 px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-600 placeholder-pink-300"
                />
                <button 
                    onClick={handleGenerateNote}
                    disabled={loading}
                    className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : "Generate"}
                </button>
            </div>
          </div>
        )}

        {loading && (
             <div className="text-pink-400 italic animate-pulse py-4 flex flex-col items-center">
                <Heart className="animate-bounce mb-2" size={20} fill="currentColor" />
                Asking Cupid for the perfect words...
             </div>
        )}

        {note && (
            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 relative mt-2 animate-fade-in">
                 <p className="text-lg text-gray-700 italic font-serif leading-relaxed">
                    "{note}"
                 </p>
                 
                 <div className="flex items-center justify-center gap-4 mt-6">
                    <button 
                        onClick={() => { setNote(""); setShowInput(true); }}
                        className="text-xs text-pink-400 hover:text-pink-600 underline flex items-center gap-1"
                    >
                        <RefreshCw size={12} /> Write another
                    </button>

                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        {copyFeedback ? <Copy size={16} /> : <Share2 size={16} />}
                        {copyFeedback ? "Copied!" : "Share Love"}
                    </button>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};