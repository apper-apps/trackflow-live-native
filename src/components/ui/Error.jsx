import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Oops! Something went wrong"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-error/10 to-red-100 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" size={40} className="text-error" />
      </div>
      <div className="text-center space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;