import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/api";
import "../styles/PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      });
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="post-list">
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="post-summary">
          <h2>
            <Link to={`/post/${post.id}`} className="post-title">
              {post.title}
            </Link>
          </h2>
          <p className="post-meta">
            By{" "}
            <Link to={`/user/${post.author.username}/posts`}>
              {post.author.username}
            </Link>{" "}
            on {new Date(post.date_posted).toLocaleDateString()}
          </p>
          <p className="post-content">{post.content.substring(0, 200)}...</p>
          <Link to={`/post/${post.id}`} className="read-more">
            Read more
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PostList;
