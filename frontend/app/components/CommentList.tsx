'use client';

import React from 'react';
import CommentItem from './CommentItem';
import { MessageSquare } from 'lucide-react';

interface Comment {
  _id: string;
  text: string;
  userId: string;
  createdAt: string;
  likes?: number;
  parentId?: string | null;
}

interface Props {
  comments: Comment[];
  userId: string;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onReply: (text: string, parentId: string) => void;
}

export default function CommentList({
  comments,
  userId,
  onLike,
  onDelete,
  onEdit,
  onReply,
}: Props) {
  const safeComments = Array.isArray(comments) ? comments : [];
  const commentCount = safeComments.length;

  console.log('DEBUG: Frontend Safe Comments:', safeComments);

  // 🧵 Separate root + replies
  const rootComments = safeComments.filter((c) => {
    const isRoot = !c.parentId;
    if (!isRoot) console.log(`DEBUG: Comment ${c.id} is a reply to ${c.parentId}`);
    return isRoot;
  });
  const replies = safeComments.filter((c) => !!c.parentId);

  console.log('DEBUG: Root counts:', rootComments.length, 'Replies count:', replies.length);

  return (
    <div className="mt-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#262626]">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white">Comments</h3>
          <span className="bg-[#1A1A1A] text-gray-400 text-xs px-2.5 py-1 rounded-md border border-[#262626]">
            {commentCount}
          </span>
        </div>
      </div>

      {/* Empty */}
      {commentCount === 0 ? (
        <div className="flex flex-col items-center py-20 bg-[#141414] rounded-2xl border border-dashed border-[#262626]">
          <MessageSquare size={48} className="text-[#262626] mb-4" />
          <p className="text-gray-500">No comments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rootComments.map((c, i) => (
            <div key={c._id || c.id || `root-${i}`}>
              
              {/* MAIN COMMENT */}
              <CommentItem
                comment={c}
                currentUser={userId}
                onLike={onLike}
                onDelete={onDelete}
                onEdit={onEdit}
                onReply={onReply}
              />

              {/* REPLIES */}
              <div className="ml-12 mt-2 space-y-2 border-l border-[#262626] pl-4">
                {replies
                  .filter((r) => r.parentId === (c._id || c.id))
                  .map((r, ri) => (
                    <CommentItem
                      key={r._id || r.id || `reply-${ri}`}
                      comment={r}
                      currentUser={userId}
                      onLike={onLike}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onReply={onReply}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}