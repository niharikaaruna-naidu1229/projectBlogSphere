import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AdminUsers = () => {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(false);


  // ==========================================
  // FETCH ALL USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get(
        "/users"
      );

      setUsers(
        response.data.users || []
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);


  // ==========================================
  // UPDATE USER ROLE
  // ==========================================

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    try {
      setActionLoading(true);

      await api.put(
        `/users/${userId}/role`,
        {
          role: newRole,
        }
      );

      alert(
        "User role updated successfully!"
      );

      await fetchUsers();

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update user role."
      );
    } finally {
      setActionLoading(false);
    }
  };


  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (
    userId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await api.delete(
        `/users/${userId}`
      );

      alert(
        "User deleted successfully!"
      );

      await fetchUsers();

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setActionLoading(false);
    }
  };


  // ==========================================
  // ACCESS DENIED
  // ==========================================

  if (!user) {
    return (
      <div className="page-center">

        <h2>
          Please login first.
        </h2>

        <Link to="/login">
          Go to Login
        </Link>

      </div>
    );
  }


  if (user.role !== "admin") {
    return (
      <div className="page-center">

        <h2>
          Access Denied
        </h2>

        <p>
          Only administrators can
          manage users.
        </p>

        <Link to="/">
          Back to Home
        </Link>

      </div>
    );
  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="admin-users-page">

      {/* ======================================
          NAVBAR
      ======================================= */}

      <nav className="navbar">

        <div className="navbar-container">

          <Link
            to="/"
            className="logo"
          >
            BlogSphere
          </Link>

          <div className="nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/admin/users">
              Manage Users
            </Link>

            <span>
              Admin: {user.name}
            </span>

            <button
              onClick={logout}
              className="logout-button"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* ======================================
          CONTENT
      ======================================= */}

      <main className="admin-container">

        <div className="admin-header">

          <div>

            <h1>
              User Management
            </h1>

            <p>
              Manage BlogSphere users
              and their roles.
            </p>

          </div>

          <div className="user-count">

            Total Users:{" "}
            {users.length}

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* LOADING */}

        {loading && (
          <div className="loading">
            Loading users...
          </div>
        )}


        {/* USERS TABLE */}

        {!loading &&
          !error &&
          users.length > 0 && (

          <div className="users-table-container">

            <table className="users-table">

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Current Role
                  </th>

                  <th>
                    Change Role
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map(
                  (currentUser) => (

                  <tr
                    key={
                      currentUser._id
                    }
                  >

                    <td>
                      {currentUser.name}
                    </td>

                    <td>
                      {currentUser.email}
                    </td>

                    <td>

                      <span
                        className={`role-badge role-${currentUser.role}`}
                      >
                        {
                          currentUser.role
                        }
                      </span>

                    </td>

                    <td>

                      <select
                        value={
                          currentUser.role
                        }
                        onChange={(e) =>
                          handleRoleChange(
                            currentUser._id,
                            e.target.value
                          )
                        }
                        disabled={
                          actionLoading ||
                          currentUser._id ===
                            user.id
                        }
                      >

                        <option value="author">
                          Author
                        </option>

                        <option value="editor">
                          Editor
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </td>

                    <td>

                      {currentUser._id ===
                      user.id ? (

                        <span>
                          Current User
                        </span>

                      ) : (

                        <button
                          onClick={() =>
                            handleDeleteUser(
                              currentUser._id
                            )
                          }
                          disabled={
                            actionLoading
                          }
                          className="delete-button"
                        >
                          Delete
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


        {!loading &&
          !error &&
          users.length === 0 && (

          <div className="empty-state">

            <h3>
              No users found
            </h3>

          </div>

        )}

      </main>

    </div>
  );
};

export default AdminUsers;