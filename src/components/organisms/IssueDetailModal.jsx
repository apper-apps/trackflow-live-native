import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const IssueDetailModal = ({ 
  issue, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete,
  users = [] 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    assignee: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        status: issue.status || "open",
        priority: issue.priority || "medium",
        assignee: issue.assignee || ""
      });
    }
  }, [issue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(issue.id, {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      toast.success("Issue updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(issue.id);
      toast.success("Issue deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete issue");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { variant: "error", icon: "Flame" },
      high: { variant: "warning", icon: "ArrowUp" },
      medium: { variant: "info", icon: "Minus" },
      low: { variant: "success", icon: "ArrowDown" }
    };
    return configs[priority] || configs.medium;
  };

  const getStatusConfig = (status) => {
    const configs = {
      open: { variant: "error", label: "Open" },
      "in-progress": { variant: "warning", label: "In Progress" },
      review: { variant: "info", label: "Review" },
      closed: { variant: "success", label: "Closed" }
    };
    return configs[status] || configs.open;
  };

const assignedUser = users.find(user => user.Id == issue?.assignee);
  const priorityConfig = getPriorityConfig(issue?.priority);
  const statusConfig = getStatusConfig(issue?.status);

  if (!isOpen || !issue) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Badge variant={priorityConfig?.variant} className="font-semibold">
                  <ApperIcon name={priorityConfig?.icon} size={12} className="mr-1" />
                  {issue.priority?.toUpperCase()}
                </Badge>
                <Badge variant={statusConfig?.variant}>
                  {statusConfig?.label}
                </Badge>
              </div>
              <span className="text-sm text-gray-500 font-medium">#{issue.id.slice(-6)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Issue Info */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Calendar" size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Created {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                {assignedUser && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="User" size={16} className="text-gray-500" />
                    <Avatar name={assignedUser.name} src={assignedUser.avatar} size="sm" />
                    <span className="text-sm text-gray-600">{assignedUser.name}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="text-base font-medium"
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 resize-none"
                  placeholder="Describe the issue..."
                  disabled={isSubmitting}
                />
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="closed">Closed</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Assignee
                  </label>
                  <Select
                    value={formData.assignee}
                    onChange={(e) => handleChange("assignee", e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.Id} value={user.Id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="error"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                  className="flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Trash2" size={16} />
                      Delete Issue
                    </>
                  )}
                </Button>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IssueDetailModal;