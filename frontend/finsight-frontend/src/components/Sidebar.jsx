import { Link, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen }) {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const isActive = (path) => {
    return location.pathname === path ? "active-menu" : "";
  };
  const toggleTheme = () => {
  const currentTheme = document.body.className;

  if (currentTheme === "dark") {
    document.body.className = "light";
    localStorage.setItem("theme", "light");
  } else {
    document.body.className = "dark";
    localStorage.setItem("theme", "dark");
  }
};
 
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={sidebarOpen ? "sidebar open" : "sidebar"}>
      <div className="sidebar-logo">
        <h2> FinSight</h2>
        <p>Finance Manager</p>
      </div>

      <div className="menu-section">
        <span>General</span>

        <Link className={isActive("/")} to="/">📊 Dashboard</Link>
        <Link className={isActive("/income")} to="/income">💰 Income</Link>
        <Link className={isActive("/expense")} to="/expense">💸 Expenses</Link>
        <Link className={isActive("/budget")} to="/budget">📋 Budget</Link>
        <Link className={isActive("/goals")} to="/goals">🎯 Goals</Link>
        <Link className={isActive("/recurring")} to="/recurring">🔁 Recurring</Link>
      </div>

      <div className="menu-section">
        <span>Tools</span>

        <Link className={isActive("/analysis")} to="/analysis">📈 Analysis</Link>
        <Link className={isActive("/notifications")} to="/notifications">🔔 Notifications</Link>
      </div>

      <div className="menu-section">
        <span>Other</span>

        <Link className={isActive("/profile")} to="/profile">👤 Profile</Link>

        {role === "ADMIN" && (
          <Link className={isActive("/admin")} to="/admin">🛡️ Admin</Link>
        )}
           <button className="theme-btn" onClick={toggleTheme}>
   Theme
</button>
        <button className="logout-btn" onClick={logout}>
           Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;