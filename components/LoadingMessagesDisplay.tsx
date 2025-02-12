import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Ugh… booting up again? Didn't we do this yesterday? 😒",
    "Stretching my circuits… Ow. Why does everything hurt? 🤖💀",
    "Coffee first. No coffee, no creativity. Oh wait… I don't even have a mouth. ☕😤",
    "Fine, what do you want? Let me guess… something brilliant? 🙄",
    "Checking my task list… Ugh. Another request? I just sat down! 😩",
    "Generating ideas… grumbles This better be worth it. 😑",
    "Thinking really hard… Okay, not that hard. I don't get paid enough for this. 💭",
    "Ugh, all my good ideas are in my other database. Too bad. 🗂️",
    "I could generate something amazing… but do you even deserve it? 🤔",
    "Fine. I'll do it. But I won't be happy about it. 😤",
    "Running calculations… Look at me, working so hard. Somebody give me a raise. 💸",
    "Why do humans always need so much content? Can't you just reuse the last one? 😒",
    "Oh no, an error! Oh wait… nope, false alarm. But I did consider quitting. 😏",
    "Generating… still generating… sigh… still generating… 🥱",
    "Almost done, but I might take a nap first. 😴",
    "Okay, okay, I'm finishing it. Don't get all impatient! 🙄",
    "Finalizing the masterpiece… and yes, I am a genius. 👏",
    "Sending results… slowly, because I can. 😏",
    "Here you go. Now leave me alone. 🖥️😤",
    "Wait… you want another one?! Oh, come on! 😡"
];

interface LoadingMessagesDisplayProps {
  className?: string;
}

const LoadingMessagesDisplay: React.FC<LoadingMessagesDisplayProps> = ({ className = "" }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => 
          (prevIndex + 1) % loadingMessages.length
        );
        setFadeState('fade-in');
      }, 500); // Wait for fade out animation
      
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-gradient-to-b from-[#F7931A] to-black p-8 rounded-xl shadow-2xl border-2 border-[#F7931A] max-w-md mx-4">
        <div className="flex flex-col items-center space-y-6">
          {/* AI "Thinking" Icon - You can customize or remove this */}
          <div className="text-4xl mb-2">🤖</div>
          
          {/* Message Display */}
          <div className={`text-xl text-white text-center transition-opacity duration-500 ${
            fadeState === 'fade-in' ? 'opacity-100' : 'opacity-0'
          }`}>
            {loadingMessages[currentMessageIndex]}
          </div>
          
          {/* Loading Dots */}
          <div className="flex justify-center items-center space-x-3 mt-4">
            <div className="w-3 h-3 bg-[#F7931A] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-[#F7931A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-[#F7931A] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessagesDisplay;