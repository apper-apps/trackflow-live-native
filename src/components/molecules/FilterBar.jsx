import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({
  statusFilter,
  priorityFilter,
  assigneeFilter,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onSearch,
  onClearFilters,
  users
}) => {
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "closed", label: "Closed" }
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const hasActiveFilters = statusFilter || priorityFilter || assigneeFilter;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm backdrop-blur-sm bg-gradient-to-r from-white to-gray-50">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full sm:w-auto">
          <SearchBar onSearch={onSearch} className="w-full" />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-40"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-40"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            value={assigneeFilter}
            onChange={(e) => onAssigneeChange(e.target.value)}
            className="w-40"
          >
            <option value="">All Assignees</option>
            {users.map(user => (
              <option key={user.Id} value={user.Id}>
                {user.name}
              </option>
            ))}
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <ApperIcon name="X" size={16} />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;