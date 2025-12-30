import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { userAPI } from "../api/services";
import Input from "../components/Input";
import Button from "../components/Button";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data.data.user);
      showToast("Profile updated successfully", "success");
      setIsEditing(false);
    } catch (error) {
      showToast(error.message || "Failed to update profile", "error");
      if (error.errors) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)
    ) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setChangingPassword(true);

    try {
      const { confirmPassword, ...changePasswordPayload } = passwordData;
      await userAPI.changePassword(changePasswordPayload);
      showToast("Password changed successfully", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      showToast(error.message || "Failed to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="space-y-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">{user?.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="text-lg text-gray-900 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user?.status}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <div className="flex space-x-3">
                  <Button type="submit" variant="primary" loading={loading}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: user?.fullName || "",
                        email: user?.email || "",
                      });
                      setErrors({});
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
                required
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                required
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                required
              />
              <Button
                type="submit"
                variant="primary"
                loading={changingPassword}
              >
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
