import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const Home = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            User Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A production-ready authentication and role-based access control
            system with modern security practices
          </p>

          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome back, {user?.fullName}!
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-semibold capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        user?.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Link to="/profile">
                  <Button variant="primary" size="lg">
                    View Profile
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button variant="secondary" size="lg">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Secure Authentication"
            description="JWT-based authentication with bcrypt password hashing and rate limiting"
            icon="🔐"
          />
          <FeatureCard
            title="Role-Based Access"
            description="Admin and user roles with protected routes and granular permissions"
            icon="👥"
          />
          <FeatureCard
            title="Modern Stack"
            description="Built with React, Node.js, Express, MongoDB, and Tailwind CSS"
            icon="⚡"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;
