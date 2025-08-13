import { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuickCreateForm = ({ onSubmit, onCancel, users = [], className }) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    assignee: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim()
      });
      setFormData({ title: "", priority: "medium", assignee: "" });
      toast.success("Issue created successfully");
    } catch (error) {
      toast.error("Failed to create issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-3">
        <div>
          <Input
            type="text"
            placeholder="Enter issue title..."
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-white border-gray-300 focus:border-primary focus:ring-primary"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-3">
          <Select
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>

          <Select
            value={formData.assignee}
            onChange={(e) => handleChange("assignee", e.target.value)}
            className="flex-1"
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

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <ApperIcon name="X" size={16} className="mr-1" />
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-1 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={16} className="mr-1" />
              Create Issue
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuickCreateForm;