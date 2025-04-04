// src/components/programs/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import programService from '../../services/program.service';

const CommentSection = ({ programId, comments }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentList, setCommentList] = useState(comments || []);

  useEffect(() => {
    if (comments) {
      setCommentList(comments);
      setLoading(false);
    } else {
      fetchComments();
    }
  }, [programId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await programService.getProgram(programId);
      setCommentList(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await programService.addComment(programId, newComment);
      setCommentList([...commentList, data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Write a comment..."
            rows="3"
            required
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            disabled={loading}
          >
            Post Comment
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">Loading comments...</div>
      ) : commentList.length === 0 ? (
        <p className="text-center text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {commentList.map((comment) => (
            <div key={comment.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                <span className="font-semibold">{comment.user.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;