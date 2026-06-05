'use client';

import React, { useState } from 'react';
import { SendHorizontal, MessageSquare } from 'lucide-react';

export default function CommentBox({ onSend }: any) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);

    try {
      await onSend(text); // supports async
      setText('');
    } catch (err) {
      console.error('Failed to send comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative bg-[#141414] border border-[#262626] rounded-2xl p-4 transition-all focus-within:border-[#333333] focus-within:shadow-[0_0_20px_rgba(229,0,0,0.05)]">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <MessageSquare size={16} className="text-[#E50000]" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Post a comment
          </span>
        </div>

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="hidden sm:block w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(229,0,0,0.2),transparent)]"></div>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts about this project..."
              className="w-full bg-transparent text-white placeholder-gray-600 resize-none py-2 focus:outline-none min-h-[80px] text-sm lg:text-base leading-relaxed"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#262626]">
              <p className="text-[10px] text-gray-600 font-medium">
                Press Enter to post
              </p>

              <button
                onClick={handleSend}
                disabled={!text.trim() || loading}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 
                  ${
                    text.trim() && !loading
                      ? 'bg-[#E50000] text-white hover:bg-[#ff1a1a] shadow-lg shadow-[#e5000015]'
                      : 'bg-[#1A1A1A] text-gray-600 cursor-not-allowed border border-[#262626]'
                  }`}
              >
                <span>{loading ? 'Sending...' : 'Send'}</span>
                <SendHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}