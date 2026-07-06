import React from 'react';
import { Smile } from 'lucide-react';

const COMMON_EMOJIS = [
  "😀","😂","🤣","😊","😍","🥰","😎","🤩","🥳","😏",
  "😒","😔","😢","😭","😡","🤯","😱","🤔","🤫","🙄",
  "👍","👎","👏","🙌","🤝","🙏","💪","🧠","👀","🔥",
  "✨","🌟","💯","🎉","🎈","🏆","🚀","💡","📚","✏️"
];

export default function EmojiPicker({ onSelectEmoji }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
        title="Insert Emoji"
      >
        <Smile size={24} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute bottom-full mb-2 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-72 z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-8 gap-2">
              {COMMON_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onSelectEmoji(emoji);
                    setIsOpen(false);
                  }}
                  className="hover:scale-125 transition-transform text-lg flex items-center justify-center p-1 rounded hover:bg-slate-50"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
