import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import IssueCard from "@/components/molecules/IssueCard";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const KanbanBoard = ({ 
  issues = [], 
  onStatusChange, 
  onEdit,
  users = [],
  className 
}) => {
  const [draggedIssue, setDraggedIssue] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: "open", title: "Open", color: "from-error/10 to-red-50", count: 0 },
    { id: "in-progress", title: "In Progress", color: "from-warning/10 to-orange-50", count: 0 },
    { id: "review", title: "Review", color: "from-info/10 to-blue-50", count: 0 },
    { id: "closed", title: "Closed", color: "from-success/10 to-green-50", count: 0 }
  ];

  // Calculate issue counts per column
  const columnsWithCounts = columns.map(column => ({
    ...column,
    count: issues.filter(issue => issue.status === column.id).length
  }));

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    // Only remove drag over state if leaving the column container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);

    try {
      const issueData = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (issueData.status !== columnId) {
        await onStatusChange(issueData.id, columnId);
        toast.success(`Issue moved to ${columnsWithCounts.find(col => col.id === columnId)?.title}`);
      }
    } catch (error) {
      console.error("Error handling drop:", error);
      toast.error("Failed to move issue");
    }
  };

  const getColumnIssues = (columnId) => {
    return issues.filter(issue => issue.status === columnId);
  };

  return (
    <div className={cn("flex gap-6 h-full overflow-x-auto pb-6", className)}>
      {columnsWithCounts.map((column) => (
        <div
          key={column.id}
          className={cn(
            "flex-shrink-0 w-80 bg-gradient-to-br rounded-lg border border-gray-200 shadow-sm",
            column.color,
            dragOverColumn === column.id && "drag-over scale-105"
          )}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <Badge variant="default" className="text-xs font-bold">
                  {column.count}
                </Badge>
              </div>
              <ApperIcon 
                name="MoreHorizontal" 
                size={16} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer" 
              />
            </div>
          </div>

          {/* Column Content */}
          <div className="flex-1 p-4 space-y-3 min-h-[200px]">
            {getColumnIssues(column.id).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onEdit={onEdit}
                users={users}
                draggable
                className="transform transition-transform hover:scale-[1.02]"
              />
            ))}
            
            {getColumnIssues(column.id).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ApperIcon name="Package" size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No issues</p>
                <p className="text-xs text-gray-400">Drag issues here or create new ones</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;