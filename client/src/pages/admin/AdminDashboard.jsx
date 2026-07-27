import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersResponse, postsResponse] = await Promise.all([
        api.get("/users"),
        api.get("/posts"),
      ]);

      setUsers(usersResponse.data.users || usersResponse.data || []);
      setPosts(postsResponse.data.posts || postsResponse.data || []);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingPosts = posts.filter(
    (post) => post.status === "pending" || post.status === "pending_review"
  );

  const publishedPosts = posts.filter(
    (post) => post.status === "published"
  );

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      alert("User deleted successfully");
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      alert("User role updated successfully");
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update role"
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users, posts, and platform activity.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <strong>{users.length}</strong>
        </div>

        <div className="stat-card">
          <h3>Total Posts</h3>
          <strong>{posts.length}</strong>
        </div>

        <div className="stat-card">
          <h3>Pending Reviews</h3>
          <strong>{pendingPosts.length}</strong>
        </div>

        <div className="stat-card">
          <h3>Published Posts</h3>
          <strong>{publishedPosts.length}</strong>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>User Management</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id || user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id || user.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="author">Author</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="danger-btn"
                        onClick={() =>
                          handleDeleteUser(user._id || user.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Post Moderation</h2>

        {pendingPosts.length === 0 ? (
          <p>No posts pending review.</p>
        ) : (
          <div className="admin-post-list">
            {pendingPosts.map((post) => (
              <div
                className="admin-post-card"
                key={post._id || post.id}
              >
                <h3>{post.title}</h3>

                <p>
                  {post.excerpt ||
                    post.content?.substring(0, 150)}
                </p>

                <span className="status-badge">
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;