import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading issues..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-900">{message}</p>
        <p className="text-sm text-gray-500">Please wait while we fetch your data</p>
      </div>
    </div>
  );
};

export default Loading;