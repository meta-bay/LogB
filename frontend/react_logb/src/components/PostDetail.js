import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPost, deletePost, updatePost } from "../services/api";
import "../styles/PostDetail.css";

function PostDetail() {
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getPost(id)
      .then((response) => {
        setPost(response.data);
        setEditedPost(response.data);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setError("Failed to fetch post. Please try again later.");
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(id)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
          setError("Failed to delete post. Please try again later.");
        });
    }
  };

  const handleUpdate = () => {
    if (isEditing) {
      updatePost(id, editedPost)
        .then((response) => {
          setPost(response.data);
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Error updating post:", error);
          setError("Failed to update post. Please try again later.");
        });
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="loading-message">Loading...</div>;

  return (
    <div className="post-detail">
      {isEditing ? (
        <>
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleChange}
            className="edit-title"
          />
          <textarea
            name="content"
            value={editedPost.content}
            onChange={handleChange}
            className="edit-content"
          />
        </>
      ) : (
        <>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-author">By {post.author.username}</p>
          <p className="post-content">{post.content}</p>
        </>
      )}
      <div className="post-buttons">
        {user && post && user.id === post.author.id && (
          <>
            <button onClick={handleUpdate} className="update-button">
              {isEditing ? "Save" : "Edit"}
            </button>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
