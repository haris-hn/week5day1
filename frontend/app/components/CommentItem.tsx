'use client';

import React from 'react';
import { User, MoreVertical, Heart } from 'lucide-react';

export default function CommentItem({
  comment,
  currentUser,
  onLike,
  onDelete,
  onEdit,
  onReply,
}: any) {
  console.log('DEBUG: Rendering CommentItem for:', comment._id || comment.id);
  const isMine = comment.userId === currentUser;

  const username = comment.userId || 'User';
  const time = comment.createdAt
    ? new Date(comment.createdAt).toLocaleTimeString()
    : 'Just now';

  return (
    <div
      className={`group relative p-5 rounded-2xl border transition-all ${
        isMine
          ? 'bg-[#1A1A1A] border-[#E50000]/30'
          : 'bg-[#0F0F0F] border-[#262626]'
      } mb-4`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            isMine
              ? 'bg-[#E50000] border-[#E50000]'
              : 'bg-[#1A1A1A] border-[#262626]'
          }`}
        >
          <User size={20} className={isMine ? 'text-white' : 'text-gray-500'} />
        </div>

        <div className="flex-1 space-y-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">
                {username} {isMine && '(You)'}
              </span>

              <span className="text-[11px] text-gray-600">
                {time}
              </span>
            </div>

            {/* Actions Menu */}
            {isMine && (
              <button
                onClick={() => {
                  const newText = prompt('Edit your comment:', comment.text);
                  if (newText) onEdit(comment._id, newText);
                }}
                className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100"
              >
                <MoreVertical size={16} />
              </button>
            )}
          </div>

          {/* Text */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {comment.text}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 text-xs">
            
            {/* ❤️ LIKE */}
            <button
              onClick={() => onLike(comment._id)}
              className="flex items-center gap-1 text-gray-600 hover:text-[#E50000]"
            >
              <Heart size={14} />
              <span>{comment.likes || 0}</span>
            </button>

            {/* 💬 REPLY */}
            <button
              onClick={() => {
                const text = prompt('Write a reply...');
                if (text) onReply(text, comment._id);
              }}
              className="text-gray-600 hover:text-white"
            >
              Reply
            </button>

            {/* ✏️ EDIT */}
            {isMine && (
              <button
                onClick={() => {
                  const text = prompt('Edit comment:', comment.text);
                  if (text) onEdit(comment._id, text);
                }}
                className="text-gray-600 hover:text-yellow-400"
              >
                Edit
              </button>
            )}

            {/* ❌ DELETE */}
            {isMine && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-gray-600 hover:text-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}