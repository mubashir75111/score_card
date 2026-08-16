import { Outlet, Link, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import "./MainLayout.css";

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove login information
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to Login
    navigate("/");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🏏 ScoreCard</h2>

        <ul className="menu">
          <li>
            <Link to="/home">Home</Link>
          </li>

          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>Matches</li>

          <li>Teams</li>

          <li>Players</li>

          <li>
            <Link to="/match">Match</Link>
          </li>

          <li>Tournament</li>

          <li>Score Entry</li>

          <li>Reports</li>
        </ul>

        {/* Logout Button */}
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Area */}
      <div className="main">
        {/* Navbar */}
        <header className="navbar">
          <FaBars className="icon" />

          <div className="right">
            <FaBell className="icon" />

            <FaUserCircle className="user" />
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
