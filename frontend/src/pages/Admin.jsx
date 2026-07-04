import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../main";

const Admin = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEdits, setUserEdits] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${serverUrl}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(data.users || []);
      const edits = (data.users || []).reduce((acc, user) => {
        acc[user._id] = {
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          role: user.role || "user",
          imageFile: null,
        };
        return acc;
      }, {});
      setUserEdits(edits);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [userData]);

  const handleChange = (id, field, value) => {
    setUserEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (id, file) => {
    handleChange(id, "imageFile", file);
  };

  const handleUpdate = async (id) => {
    try {
      const edit = userEdits[id];
      if (!edit) return;
      const formData = new FormData();
      formData.append("name", edit.name);
      formData.append("username", edit.username);
      formData.append("email", edit.email);
      formData.append("role", edit.role);
      if (edit.imageFile) {
        formData.append("image", edit.imageFile);
      }

      const { data } = await axios.put(
        `${serverUrl}/api/admin/users/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.status) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      const { data } = await axios.delete(
        `${serverUrl}/api/admin/users/${id}`,
        {
          withCredentials: true,
        },
      );
      if (data.status) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-[100vh] bg-[#f4f7fb] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage users, update roles and remove accounts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Back to chat
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Users</h2>
            {loading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>

          <div className="grid gap-4">
            {users.length === 0 && !loading ? (
              <div className="text-center py-16 text-gray-500">
                No users found.
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="rounded-3xl border border-gray-200 p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg capitalize truncate">
                        {user.name || user.username || "Unnamed"}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        ID: {user._id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(user._id)}
                        disabled={user._id === userData?._id}
                        className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="grid gap-3">
                      <label className="text-sm text-gray-600">Name</label>
                      <input
                        value={userEdits[user._id]?.name || ""}
                        onChange={(e) =>
                          handleChange(user._id, "name", e.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                      />
                    </div>
                    <div className="grid gap-3">
                      <label className="text-sm text-gray-600">Email</label>
                      <input
                        value={userEdits[user._id]?.email || ""}
                        onChange={(e) =>
                          handleChange(user._id, "email", e.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                      />
                    </div>
                    <div className="grid gap-3">
                      <label className="text-sm text-gray-600">Username</label>
                      <input
                        value={userEdits[user._id]?.username || ""}
                        onChange={(e) =>
                          handleChange(user._id, "username", e.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                      />
                    </div>
                    <div className="grid gap-3">
                      <label className="text-sm text-gray-600">Role</label>
                      <select
                        value={userEdits[user._id]?.role || "user"}
                        onChange={(e) =>
                          handleChange(user._id, "role", e.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="grid gap-3">
                      <label className="text-sm text-gray-600">
                        Profile Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(user._id, e.target.files[0])
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleUpdate(user._id)}
                      className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                    >
                      Update
                    </button>
                    <span className="text-xs text-gray-400">
                      {user._id === userData?._id &&
                        "You cannot delete yourself."}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
