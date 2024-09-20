import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/UserPosts.css";

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    fetchPosts();
  }, [username]);

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/users/${username}/posts/`);
      setPosts(response.data.results);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="post-list">
      <h2>Posts by {username}</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-summary">
            <h3>
              <Link to={`/post/${post.id}`} className="post-title">
                {post.title}
              </Link>
            </h3>
            <p className="post-meta">
              By {username} on {new Date(post.date_posted).toLocaleDateString()}
            </p>
            <p className="post-content">{post.content.substring(0, 200)}...</p>
            <Link to={`/post/${post.id}`} className="read-more">
              Read more
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default UserPosts;
