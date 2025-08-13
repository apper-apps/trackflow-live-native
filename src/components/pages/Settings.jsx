import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("team");
  
  // Form states
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "developer"
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // App settings
  const [appSettings, setAppSettings] = useState({
    projectName: "TrackFlow Project",
    defaultPriority: "medium",
    defaultStatus: "open",
    autoAssign: false,
    emailNotifications: true,
    theme: "light"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const userData = await userService.getAll();
      setUsers(userData);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await userService.create({
        ...newUserForm,
        name: newUserForm.name.trim(),
        email: newUserForm.email.trim(),
        avatar: ""
      });
      
      setUsers(prev => [...prev, newUser]);
      setNewUserForm({ name: "", email: "", role: "developer" });
      toast.success("User created successfully");
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userId, updateData) => {
    try {
      const updatedUser = await userService.update(userId, updateData);
      setUsers(prev => prev.map(user => 
        user.Id === userId ? updatedUser : user
      ));
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await userService.delete(userId);
      setUsers(prev => prev.filter(user => user.Id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  const handleSettingsChange = (field, value) => {
    setAppSettings(prev => ({ ...prev, [field]: value }));
    // In a real app, you would save these to a backend
    toast.success("Settings updated");
  };

  if (loading) {
    return <Loading message="Loading settings..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUsers} />;
  }

  const tabs = [
    { id: "team", label: "Team Management", icon: "Users" },
    { id: "project", label: "Project Settings", icon: "Settings" },
    { id: "preferences", label: "Preferences", icon: "Sliders" }
  ];

  const getRoleBadgeVariant = (role) => {
    const variants = {
      admin: "error",
      manager: "warning", 
      developer: "info",
      tester: "success"
    };
    return variants[role] || "default";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-600">Manage your project settings and team members</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* Add New User */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Team Member</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <Select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                    disabled={isSubmitting}
                  >
                    <option value="developer">Developer</option>
                    <option value="tester">Tester</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" size={16} />
                    Add Team Member
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Team Members List */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <Avatar name={user.name} src={user.avatar} size="lg" />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="mt-1">
                        <Badge variant={getRoleBadgeVariant(user.role || "developer")} className="text-xs">
                          {(user.role || "developer").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      <ApperIcon name="Edit" size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.Id)}
                      className="text-error hover:text-error"
                    >
                      <ApperIcon name="Trash2" size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "project" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <Input
                  type="text"
                  value={appSettings.projectName}
                  onChange={(e) => handleSettingsChange("projectName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Priority
                  </label>
                  <Select
                    value={appSettings.defaultPriority}
                    onChange={(e) => handleSettingsChange("defaultPriority", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Status
                  </label>
                  <Select
                    value={appSettings.defaultStatus}
                    onChange={(e) => handleSettingsChange("defaultStatus", e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates for assigned issues</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appSettings.emailNotifications}
                    onChange={(e) => handleSettingsChange("emailNotifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Auto-assign Issues</p>
                  <p className="text-sm text-gray-500">Automatically assign new issues to team members</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appSettings.autoAssign}
                    onChange={(e) => handleSettingsChange("autoAssign", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Theme
                </label>
                <Select
                  value={appSettings.theme}
                  onChange={(e) => handleSettingsChange("theme", e.target.value)}
                  className="w-48"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-error/20 bg-gradient-to-r from-error/5 to-red-50">
            <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Reset All Settings</p>
                  <p className="text-sm text-gray-500">Reset all settings to their default values</p>
                </div>
                <Button variant="outline" className="border-error text-error hover:bg-error hover:text-white">
                  Reset Settings
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Delete All Data</p>
                  <p className="text-sm text-gray-500">Permanently delete all issues and data</p>
                </div>
                <Button variant="error">
                  Delete All Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;