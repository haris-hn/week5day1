'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import CommentBox from './components/CommentBox';
import CommentList from './components/CommentList';
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      window.location.href = '/login';
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    socket.connect();

    // LOAD COMMENTS
    socket.on('load_comments', (data) => {
      console.log('DEBUG: Received load_comments:', data);
      setComments(Array.isArray(data) ? data : []);
    });

    // NEW COMMENT
    socket.on('new_comment', (comment) => {
      console.log('DEBUG: Received new_comment:', comment);
      setComments((prev) => {
        const next = Array.isArray(prev) ? [...prev, comment] : [comment];
        console.log('DEBUG: Updating state with new comment. Next state count:', next.length);
        return next;
      });

      if (comment.userId !== parsedUser.username) {
        toast.success(`New comment from ${comment.userId}`);
      }
    });

    // EDIT COMMENT
    socket.on('updated_comment', (updated) => {
      console.log('DEBUG: Received updated_comment:', updated);
      setComments((prev) =>
        Array.isArray(prev) ? prev.map((c) => (c.id === updated.id ? updated : c)) : []
      );
    });

    // DELETE COMMENT
    socket.on('deleted_comment', (id) => {
      console.log('DEBUG: Received deleted_comment:', id);
      setComments((prev) => Array.isArray(prev) ? prev.filter((c) => c.id !== id) : []);
    });

    // LIKE COMMENT
    socket.on('liked_comment', (updated) => {
      console.log('DEBUG: Received liked_comment:', updated);
      setComments((prev) =>
        Array.isArray(prev) ? prev.map((c) => (c.id === updated.id ? updated : c)) : []
      );
    });

    return () => {
      socket.off('load_comments');
      socket.off('new_comment');
      socket.off('updated_comment');
      socket.off('deleted_comment');
      socket.off('liked_comment');
      socket.disconnect();
    };
  }, []);


  // ACTION FUNCTIONS


  const sendComment = (text: string) => {
    if (!user) return;

    socket.emit('add_comment', {
      text,
      username: user.username,
    });
  };

  const likeComment = (id: number) => {
    socket.emit('like_comment', id);
  };

  const deleteComment = (id: number) => {
    socket.emit('delete_comment', id);
  };

  const editComment = (id: number, text: string) => {
    socket.emit('edit_comment', { id, text });
  };

  const replyComment = (text: string, parentId: number) => {
    if (!user) return;

    socket.emit('add_comment', {
      text,
      username: user.username,
      parentId,
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Toaster position="bottom-right" />

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">
            Team <span className="text-red-500">Discussions</span>
          </h1>

          <p className="text-gray-400">
            Logged in as {user.username}
          </p>

          <button
            onClick={logout}
            className="text-red-500 text-sm hover:underline"
          >
            Logout
          </button>
        </div>

        {/* COMMENT INPUT */}
        <CommentBox onSend={sendComment} />

        {/* COMMENT LIST */}
        <CommentList
          comments={comments}
          userId={user.username}
          onLike={likeComment}
          onDelete={deleteComment}
          onEdit={editComment}
          onReply={replyComment}
        />
      </main>
    </div>
  );
}