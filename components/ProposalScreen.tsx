import React, { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { generateProposalImage } from '../services/geminiService';

interface ProposalScreenProps {
  onSuccess: () => void;
}

const NO_PHRASES = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely certain?",
  "This could be a mistake!",
  "Have a heart!",
  "Don't be so cold!",
  "Change of heart?",
  "Wouldn't you reconsider?",
  "Is that your final answer?",
  "You're breaking my heart ;(",
];

export const ProposalScreen: React.FC<ProposalScreenProps> = ({ onSuccess }) => {
  const [noCount, setNoCount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // The 'Yes' button grows as the user clicks 'No'
  const yesButtonSize = noCount * 20 + 16; 

  useEffect(() => {
    const init = async () => {
      const url = await generateProposalImage();
      if (url) {
        setImageUrl(url);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  const getNoText = () => {
    return NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen z-10 relative p-4 text-center">
      <div className="mb-8 relative flex items-center justify-center">
         {/* Display loader or generated image */}
         {loading ? (
           <div className="w-64 h-64 rounded-xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm border-4 border-white shadow-lg">
             <Loader2 className="animate-spin text-pink-500 mb-2" size={40} />
             <p className="text-pink-600 font-bold animate-pulse text-sm">Preparing cuteness...</p>
           </div>
         ) : (
          <img 
            src={imageUrl || "https://cdn.pixabay.com/photo/2020/07/06/07/08/teddy-bear-5376378_1280.png"} 
            alt="Cute bear asking question" 
            className="rounded-xl shadow-lg w-64 h-64 object-cover mx-auto border-4 border-white bg-white p-1 animate-fade-in"
          />
         )}
        <Heart className="absolute -top-4 -right-4 text-red-500 animate-bounce" fill="currentColor" size={40} />
        <Heart className="absolute -bottom-4 -left-4 text-pink-500 animate-pulse" fill="currentColor" size={32} />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-8 drop-shadow-sm">
        Will you be my Valentine?
      </h1>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={onSuccess}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
          style={{ fontSize: `${yesButtonSize}px` }}
        >
          Yes
        </button>

        <button
          onClick={handleNoClick}
          className="bg-red-400 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all duration-200 min-w-[150px]"
        >
          <span key={noCount} className="inline-block animate-pop-in">
             {noCount === 0 ? "No" : getNoText()}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};