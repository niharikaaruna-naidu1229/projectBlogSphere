import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Posts
  const fetchPosts = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const url = searchValue
        ? `/posts?search=${encodeURIComponent(searchValue)}`
        : "/posts";

      const response = await api.get(url);

      setPosts(response.data.posts || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchPosts();
  };

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">

          <Link to="/" className="logo">
            BlogSphere
          </Link>

          <div className="nav-links">

            <Link to="/">Home</Link>

            {user ? (
              <>
                <Link to="/dashboard">
                  Dashboard
                </Link>

                <Link to="/create-post">
                  Create Post
                </Link>

                {user.role === "admin" && (
                  <Link to="/admin/users">
                    Manage Users
                  </Link>
                )}

                <div className="user-profile">
                  <span>
                    👋 Hi, {user.name}
                  </span>

                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  Login
                </Link>

                <Link to="/register">
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </nav>

            {/* HERO SECTION */}

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            🚀 Welcome to BlogSphere
          </span>

          <h1>
            Discover.
            <span> Write.</span>
            Inspire.
          </h1>

          <p>
            Publish your thoughts, explore amazing blogs,
            and connect with thousands of passionate writers.
          </p>

          <div className="hero-buttons">

            <Link
              to="/create-post"
              className="hero-btn"
            >
              ✍ Start Writing
            </Link>

            <Link
              to="/dashboard"
              className="hero-btn-outline"
            >
              📊 Dashboard
            </Link>

          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="stats-section">

        <div className="stat-card">
          <h2>{posts.length}+</h2>
          <p>Published Blogs</p>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <p>Happy Readers</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Community Support</p>
        </div>

      </section>


      {/* SEARCH */}

      <section className="search-section">

        <div className="search-box">

          <h2>🔍 Explore Blogs</h2>

          <p>
            Search articles by title, tag or keyword
          </p>

          <form onSubmit={handleSearch}>

            <div className="search-input-wrapper">

              <span className="search-icon">
                🔎
              </span>

              <input
                type="text"
                placeholder="Search amazing blogs..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="search-btn"
            >
              Search
            </button>

            {search && (

              <button
                type="button"
                className="clear-btn"
                onClick={handleClearSearch}
              >
                Clear
              </button>

            )}

          </form>

        </div>

      </section>

            {/* POSTS */}

      <main className="posts-container">

        <div className="section-title">

          <h2>
            {search
              ? `🔍 Results for "${search}"`
              : "✨ Latest Articles"}
          </h2>

          <p>
            Read trending blogs from our community.
          </p>

        </div>

        {loading && (
          <p className="loading">
            Loading amazing blogs...
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          posts.length === 0 && (
            <div className="empty-state">

              <h3>No Blogs Found 😔</h3>

              <p>
                Try another keyword.
              </p>

            </div>
          )}

        <div className="posts-grid">

          {posts.map((post) => (

            <article
              key={post._id}
              className="post-card"
            >

              {post.coverImage ? (

                <img
                  src={`http://localhost:5000${post.coverImage}`}
                  alt={post.title}
                  className="post-cover"
                />

              ) : (

                <div className="post-cover-placeholder">

                  📖 BlogSphere

                </div>

              )}

              <div className="post-card-content">

                <div className="post-meta">

                  <span>
                    👤 {post.author?.name || "Unknown"}
                  </span>

                  <span>
                    ⏱ {post.readTime || 1} min read
                  </span>

                </div>

                <h3>
                  {post.title}
                </h3>

                <p>

                  {(post.excerpt ||
                    post.content?.substring(0, 140))}

                  ...

                </p>

                {post.tags?.length > 0 && (

                  <div className="post-tags">

                    {post.tags.map((tag, index) => (

                      <span
                        key={index}
                        className="tag"
                      >
                        #{tag}
                      </span>

                    ))}

                  </div>

                )}

                <Link
                  to={`/posts/${post._id}`}
                  className="read-more"
                >
                  Read Full Article →
                </Link>

              </div>

            </article>

          ))}

        </div>
<footer className="footer">

  <div className="footer-container">

    <div>

      <h2>BlogSphere</h2>

      <p>
        A modern blogging platform built with
        React, Node.js, Express and MongoDB.
      </p>

    </div>

    <div className="footer-links">

      <Link to="/">Home</Link>

      <Link to="/dashboard">Dashboard</Link>

      <Link to="/create-post">Create Post</Link>

    </div>

    <div>

      <h3>Made with ❤️</h3>

      <p>By Niharika Naidu</p>

    </div>

  </div>

  <div className="footer-bottom">

    © 2026 BlogSphere • All Rights Reserved

  </div>

</footer>
      </main>
        </div>
  );
};

export default Home;