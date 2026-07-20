import { useState, useEffect } from "react";
import api from "../../api/api";
import {
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiKey,
} from "react-icons/fi";
function StatusBadge({
  status,
}) {
  return (
    <span
      style={{
        background:
          status === "Active"
            ? "#DCFCE7"
            : "#FEE2E2",

        color:
          status === "Active"
            ? "#15803D"
            : "#DC2626",

        borderRadius: "20px",
        padding:
          "6px 12px",
        fontSize: "13px",
        fontWeight:
          "600",
      }}
    >
      {status}
    </span>
  );
}

export default function UserManagement() {

const [isEditing, setIsEditing] =
  useState(false);

const [editingUserId, setEditingUserId] =
  useState(null);

  const [showModal, setShowModal] =
  useState(false);
const [search, setSearch] =
  useState("");

const [supervisors, setSupervisors] = useState([]);

const [newUser, setNewUser] = useState({
  fullName: "",
  email: "",
  role: "requestor",
  department: "",
  supervisor: "",
  canCreateRequests: true,
});

const [users, setUsers] = useState([]);

const handleCreateUser =
  async () => {
    try {
      if (
            !newUser.fullName ||
            !newUser.email ||
            !newUser.department
          ) {
            alert(
              "Please complete all user details."
            );
            return;
          }

          if (
              newUser.role !== "national_director" &&
              !newUser.supervisor
            ) {
              alert(
                "Please select a supervisor."
              );
              return;
          }

const payload = {
  fullName: newUser.fullName,
  email: newUser.email,
  role: newUser.role,
  department: newUser.department,

  supervisor:
    newUser.role ===
    "national_director"
      ? null
      : newUser.supervisor,

  canCreateRequests:
    newUser.role ===
    "national_director"
      ? false
      : newUser.canCreateRequests,
};

if (isEditing) {

  await api.put(
    `/users/${editingUserId}`,
    payload
  );

  alert(
    "User updated successfully."
  );

} else {

  const response =
    await api.post(
      "/users",
      payload
    );

  alert(
    `User created successfully.\nTemporary Password: ${response.data.tempPassword}`
  );
}

      const usersResponse =
        await api.get(
          "/users"
        );

      setUsers(
        usersResponse.data
      );

        setNewUser({
  fullName: "",
  email: "",
  role: "requestor",
  department: "",
  supervisor: "",
  canCreateRequests: true,
});

setIsEditing(false);
setEditingUserId(null);

setShowModal(false);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to create user"
      );
    }
  };
const handleEditUser = (user) => {

  setIsEditing(true);

  setEditingUserId(user._id);

  setNewUser({
    fullName: user.fullName,
    email: user.email,

    role: user.role,

    department: user.department,

    supervisor:
      user.supervisor?._id || "",

    canCreateRequests:
      user.canCreateRequests !== false,
  });

  setShowModal(true);
};

const totalUsers = users.length;

const activeUsers = users.filter(
  (u) => u.isActive
).length;

const blockedUsers = users.filter(
  (u) => !u.isActive
).length;

const roles = [
  ...new Set(users.map((u) => u.role)),
].length;
const filteredUsers =
  users.filter(
    (u) =>
      (u.fullName || "")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      (u.email || "")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  const loadUsers = async () => {
  try {
    const response =
      await api.get("/users");

    setUsers(response.data);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  loadUsers();

  const loadSupervisors =
    async () => {
      try {
        const response =
          await api.get(
            "/users/supervisors"
          );

        setSupervisors(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  loadUsers();
  loadSupervisors();
}, []);

const handleResetPassword = async (
  id
) => {
  try {
    const response =
      await api.put(
        `/users/${id}/reset-password`
      );

    alert(
      `Password reset successfully.\nTemporary Password: ${response.data.tempPassword}`
    );

    await loadUsers();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data
        ?.message ||
        "Failed to reset password"
    );
  }
};

const handleBlockUser = async (
  id
) => {
  try {
    await api.put(
      `/users/${id}/block`
    );

    alert(
      "User blocked successfully."
    );

    await loadUsers();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data
        ?.message ||
        "Failed to block user"
    );
  }
};

const handleUnblockUser =
  async (id) => {
    try {
      await api.put(
        `/users/${id}/unblock`
      );

      alert(
        "User unblocked successfully."
      );

      await loadUsers();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to unblock user"
      );
    }
  };

  const handleDeleteUser = async (
  id
) => {
  const confirmed =
    window.confirm(
      "Are you sure you want to delete this user?"
    );

  if (!confirmed) return;

  try {
    await api.delete(
      `/users/${id}`
    );

    alert(
      "User deleted successfully."
    );

    await loadUsers();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data
        ?.message ||
        "Failed to delete user"
    );
  }
};

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#1F2937",
            }}
          >
            User Management
          </h1>
         
          <p
            style={{
              color: "#64748B",
            }}
          >
            Manage system users,
            roles and access.
          </p>
        </div>

                    <button
            style={primaryBtn}
            onClick={() =>
                setShowModal(true)
            }
            >
          <FiUserPlus />
          Create User
        </button>
      </div>
      <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "25px",
  }}
>
  <StatCard
    title="Total Users"
    value={totalUsers}
  />

  <StatCard
    title="Active Users"
    value={activeUsers}
  />

  <StatCard
    title="Blocked Users"
    value={blockedUsers}
  />

  <StatCard
    title="Roles"
    value={roles}
  />
</div>
<div
  style={{
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="Search users..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border:
        "1px solid #D1D5DB",
    }}
  />
</div>
      <div
  style={{
    ...cardStyle,
    overflowX: "auto",
  }}
>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Supervisor</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td style={tdStyle}>
                  {user.fullName}
                </td>

                <td style={tdStyle}>
                  {user.email}
                </td>
                <td style={tdStyle}>
                 {user.supervisor?.fullName || "N/A"}
                </td>
                <td style={tdStyle}>{user.department}</td>
                <td style={tdStyle}>
                  {user.role
                  .charAt(0)
                  .toUpperCase() +
                  user.role.slice(1)}
                </td>

                <td style={tdStyle}>
                <StatusBadge
                status={
                  user.isActive
                    ? "Active"
                    : "Blocked"
                }
                />
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      style={editBtn}
                      onClick={() =>
                        handleEditUser(user)
                      }
                    >
                      <FiEdit />
                    </button>

                                      <button
                      style={passwordBtn}
                      onClick={() =>
                        handleResetPassword(
                          user._id
                        )
                      }
                    >
                      <FiKey />
                    </button>

                       <button
                       style={blockBtn}
                       onClick={() =>
                       handleBlockUser(user._id)
                       }
                              >
                       <FiLock />
                       </button>

                    <button
                      style={unlockBtn}
                      onClick={() =>
                        handleUnblockUser(
                          user._id
                        )
                      }
                    >
                      <FiUnlock />
                    </button>

                    <button
                    style={deleteBtn}
                    onClick={() =>
                      handleDeleteUser(
                        user._id
                      )
                    }
                  >
                    <FiTrash2 />
                  </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
  <div style={overlayStyle}>
    <div style={modalStyle}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#1F2937",
        }}
      >
          {isEditing? "Edit User":
          "Create User"}
      </h2>

      <div
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={newUser.fullName}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              fullName:
                e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              email:
                e.target.value,
            })
          }
          style={inputStyle}
        />

<select
  value={newUser.department}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      department: e.target.value,
    })
  }
  style={inputStyle}
>
  <option value="">
    Select Department
  </option>

  <option value="Programs">
    Programs
  </option>

  <option value="Human Resource">
    Human Resource
  </option>
   <option value="Resource Mobilization">
    Resource Mobilization
  </option>
  <option value="Finance & Operations">
    Finance & Operations
  </option>
  <option value="Finance & Operations">
    Administration
    </option>
</select>

{newUser.role !== "national_director" && (
  <select
    value={newUser.supervisor}
    onChange={(e) =>
      setNewUser({
        ...newUser,
        supervisor: e.target.value,
      })
    }
    style={inputStyle}
  >
    <option value="">
      Select Supervisor
    </option>

    {supervisors.map(
      (supervisor) => (
        <option
          key={supervisor._id}
          value={supervisor._id}
        >
          {supervisor.fullName}
        </option>
      )
    )}
  </select>
)}
        <select
          value={newUser.role}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              role:
                e.target.value,
            })
          }
          style={inputStyle}
        >
          <option value="requestor">
            Requestor
          </option>

          <option value="finance">
            Finance
          </option>

          <option value="supervisor">
            Supervisor
          </option>

          <option value="procurement">
            Procurement
          </option>

          <option value="national_director">
            National Director
          </option>

          <option value="administrator">
            Administrator
          </option>
           </select>
           <div>
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <input
      type="checkbox"
      checked={newUser.canCreateRequests}
      onChange={(e) =>
        setNewUser({
          ...newUser,
          canCreateRequests:
            e.target.checked,
        })
      }
    />

    Can Create Requests
  </label>
</div>
          </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          style={cancelBtn}
          onClick={() =>
            setShowModal(false)
          }
        >
          Cancel
        </button>

        <button
          style={primaryBtn}
          onClick={
            handleCreateUser
          }
        >
          {isEditing
          ? "Update User"
          : "Create User"}

        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "20px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          color: "#64748B",
          margin: 0,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color: "#3DA5F4",
          marginTop: "10px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}
const cardStyle = {
  background: "#FFFFFF",
  borderRadius: "12px",
  padding: "25px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};

const thStyle = {
  textAlign: "left",
  padding: "15px",
  borderBottom: "1px solid #E5E7EB",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #E5E7EB",
};

const primaryBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#3DA5F4",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "12px 18px",
  cursor: "pointer",
};

const editBtn = {
  background: "#DBEAFE",
  color: "#2563EB",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};

const passwordBtn = {
  background: "#EDE9FE",
  color: "#7C3AED",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};

const blockBtn = {
  background: "#FEF3C7",
  color: "#B45309",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};

const unlockBtn = {
  background: "#DCFCE7",
  color: "#15803D",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#FEE2E2",
  color: "#DC2626",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#FFFFFF",
  padding: "30px",
  borderRadius: "12px",
  width: "500px",
  maxWidth: "90%",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border:
    "1px solid #D1D5DB",
  borderRadius: "8px",
  boxSizing: "border-box",
};

const cancelBtn = {
  background: "#E5E7EB",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};
