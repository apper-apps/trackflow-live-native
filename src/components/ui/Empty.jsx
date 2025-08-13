import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No issues found",
  message = "Get started by creating your first issue to track bugs and tasks.",
  actionLabel = "Create Issue",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      <div className="text-center space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;