import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "./Button";
import { authAPI } from "../api/services";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      showToast("Logged out successfully", "success");
      navigate("/login");
    } catch (error) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-xl font-bold text-gray-900">UserManage</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="ghost" fullWidth>
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link to="/profile" onClick={() => setOpen(false)}>
                <Button variant="ghost" fullWidth>
                  Profile
                </Button>
              </Link>

              <div className="border-t pt-3">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" fullWidth>
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)}>
                <Button variant="primary" fullWidth>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
