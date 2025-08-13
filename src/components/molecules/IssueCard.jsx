import { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const IssueCard = ({ 
  issue, 
  onEdit, 
  onStatusChange, 
  draggable = true,
  className,
  users = []
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { 
        variant: "error", 
        icon: "Flame", 
        color: "border-l-error",
        bgColor: "bg-gradient-to-br from-error/5 to-red-50"
      },
      high: { 
        variant: "warning", 
        icon: "ArrowUp", 
        color: "border-l-warning",
        bgColor: "bg-gradient-to-br from-warning/5 to-orange-50"
      },
      medium: { 
        variant: "info", 
        icon: "Minus", 
        color: "border-l-info",
        bgColor: "bg-gradient-to-br from-info/5 to-blue-50"
      },
      low: { 
        variant: "success", 
        icon: "ArrowDown", 
        color: "border-l-success",
        bgColor: "bg-gradient-to-br from-success/5 to-green-50"
      }
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

  const priorityConfig = getPriorityConfig(issue.priority);
  const statusConfig = getStatusConfig(issue.status);
  const assignedUser = users.find(user => user.Id === issue.assignee);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", JSON.stringify(issue));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer issue-card border-l-4 transition-all duration-200",
        priorityConfig.color,
        priorityConfig.bgColor,
        isDragging && "opacity-50 scale-95",
        className
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit?.(issue)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={priorityConfig.variant} className="text-xs font-semibold">
              <ApperIcon name={priorityConfig.icon} size={12} className="mr-1" />
              {issue.priority.toUpperCase()}
            </Badge>
            <span className="text-xs text-gray-500 font-medium">#{issue.id.slice(-6)}</span>
          </div>
          {draggable && (
            <ApperIcon 
              name="GripVertical" 
              size={16} 
              className="text-gray-400 drag-handle flex-shrink-0" 
            />
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-5">
          {issue.title}
        </h3>

        {/* Description */}
        {issue.description && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-4">
            {issue.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <Badge variant={statusConfig.variant} className="text-xs">
            {statusConfig.label}
          </Badge>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {format(new Date(issue.updatedAt), "MMM d")}
            </span>
            {assignedUser && (
              <Avatar 
                name={assignedUser.name}
                src={assignedUser.avatar}
                size="sm"
                className="border border-white shadow-sm"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IssueCard;