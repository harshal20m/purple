import { useState, useEffect } from "react";
import { adminAPI } from "../api/services";
import { useToast } from "../context/ToastContext";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { useDebounce } from "../hooks/useDebounce";

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage, debouncedSearch]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers(page, 10);
      const { users: fetchedUsers, pagination: paginationData } =
        response.data.data;

      // Filter users based on search term (client-side filtering)
      let filteredUsers = fetchedUsers;
      if (debouncedSearch) {
        filteredUsers = fetchedUsers.filter(
          (user) =>
            user.fullName
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }

      setUsers(filteredUsers);
      setPagination({
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        totalUsers: paginationData.totalUsers,
      });
    } catch (error) {
      showToast(error.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const openModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setModalAction("");
  };

  const handleUserAction = async () => {
    if (!selectedUser) return;

    setActionLoading(true);

    try {
      if (modalAction === "activate") {
        await adminAPI.activateUser(selectedUser._id);
        showToast("User activated successfully", "success");
      } else if (modalAction === "deactivate") {
        await adminAPI.deactivateUser(selectedUser._id);
        showToast("User deactivated successfully", "success");
      }

      // Refresh the user list
      fetchUsers(pagination.currentPage);
      closeModal();
    } catch (error) {
      showToast(error.message || "Action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage all users and their access
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {pagination.totalUsers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {users.filter((u) => u.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">
              Inactive Users
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {users.filter((u) => u.status === "inactive").length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                {user.fullName.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.fullName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin
                            ? formatDate(user.lastLogin)
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.status === "active" ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openModal(user, "deactivate")}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => openModal(user, "activate")}
                            >
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`${modalAction === "activate" ? "Activate" : "Deactivate"} User`}
        onConfirm={handleUserAction}
        confirmText={modalAction === "activate" ? "Activate" : "Deactivate"}
        confirmVariant={modalAction === "activate" ? "primary" : "destructive"}
        loading={actionLoading}
      >
        <p>
          Are you sure you want to {modalAction}{" "}
          <strong>{selectedUser?.fullName}</strong>?
        </p>
        {modalAction === "deactivate" && (
          <p className="mt-2 text-sm text-red-600">
            This user will no longer be able to access their account.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
