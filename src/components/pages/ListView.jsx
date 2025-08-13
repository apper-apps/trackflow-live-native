import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import FilterBar from "@/components/molecules/FilterBar";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import issueService from "@/services/api/issueService";
import userService from "@/services/api/userService";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const ListView = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [issues, statusFilter, priorityFilter, assigneeFilter, searchTerm, sortField, sortDirection]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [issueData, userData] = await Promise.all([
        issueService.getAll(),
        userService.getAll()
      ]);
      setIssues(issueData);
      setUsers(userData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];

    // Apply filters
    if (statusFilter) {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }
if (assigneeFilter) {
      filtered = filtered.filter(issue => issue.assignee == assigneeFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term) ||
        issue.id.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "priority") {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      }

      if (sortField === "updatedAt" || sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredIssues(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectIssue = (issueId) => {
    setSelectedIssues(prev => {
      if (prev.includes(issueId)) {
        return prev.filter(id => id !== issueId);
      } else {
        return [...prev, issueId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIssues.length === filteredIssues.length) {
      setSelectedIssues([]);
    } else {
      setSelectedIssues(filteredIssues.map(issue => issue.id));
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      const updatePromises = selectedIssues.map(issueId =>
        issueService.update(issueId, { status: newStatus })
      );
      const updatedIssues = await Promise.all(updatePromises);
      
      setIssues(prev => prev.map(issue => {
        const updatedIssue = updatedIssues.find(updated => updated.id === issue.id);
        return updatedIssue || issue;
      }));
      
      setSelectedIssues([]);
      toast.success(`${selectedIssues.length} issues updated successfully`);
    } catch (error) {
      console.error("Error updating issues:", error);
      toast.error("Failed to update issues");
    }
  };

  const handleUpdateIssue = async (issueId, updateData) => {
    try {
      const updatedIssue = await issueService.update(issueId, updateData);
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? updatedIssue : issue
      ));
    } catch (error) {
      console.error("Error updating issue:", error);
      throw error;
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      await issueService.delete(issueId);
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
    } catch (error) {
      console.error("Error deleting issue:", error);
      throw error;
    }
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

  const clearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setAssigneeFilter("");
    setSearchTerm("");
  };

  if (loading) {
    return <Loading message="Loading issues list..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const SortHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          <ApperIcon 
            name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
            size={14}
            className="text-primary" 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header and Filters */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Issues List
              </h1>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600 font-medium">
                {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}
              </span>
            </div>
            
            {selectedIssues.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedIssues.length} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkStatusChange("open")}>
                    <ApperIcon name="CircleDot" size={14} className="mr-1" />
                    Open
                  </Button>
                  <Button size="sm" onClick={() => handleBulkStatusChange("in-progress")}>
                    <ApperIcon name="Play" size={14} className="mr-1" />
                    In Progress
                  </Button>
                  <Button size="sm" onClick={() => handleBulkStatusChange("closed")}>
                    <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-600">Manage and track all issues in a detailed table view</p>
        </div>

        <FilterBar
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          assigneeFilter={assigneeFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onAssigneeChange={setAssigneeFilter}
          onSearch={setSearchTerm}
          onClearFilters={clearFilters}
          users={users}
        />
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-hidden px-6">
        {filteredIssues.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Empty
              title="No issues to display"
              message={issues.length === 0 
                ? "Get started by creating your first issue to track bugs and tasks."
                : "No issues match your current filters. Try adjusting your search criteria."
              }
              icon="List"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIssues.length === filteredIssues.length && filteredIssues.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <SortHeader field="title">Issue</SortHeader>
                    <SortHeader field="status">Status</SortHeader>
                    <SortHeader field="priority">Priority</SortHeader>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <SortHeader field="updatedAt">Updated</SortHeader>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIssues.map((issue) => {
                    const priorityConfig = getPriorityConfig(issue.priority);
                    const statusConfig = getStatusConfig(issue.status);
const assignedUser = users.find(user => user.Id == issue.assignee);
                    
                    return (
                      <tr 
                        key={issue.id}
                        className={cn(
                          "hover:bg-gray-50 transition-colors",
                          selectedIssues.includes(issue.id) && "bg-primary/5"
                        )}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIssues.includes(issue.id)}
                            onChange={() => handleSelectIssue(issue.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 font-medium">
                                #{issue.id.slice(-6)}
                              </span>
                            </div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {issue.title}
                            </div>
                            {issue.description && (
                              <div className="text-sm text-gray-600 line-clamp-1">
                                {issue.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={priorityConfig.variant} className="font-semibold">
                            <ApperIcon name={priorityConfig.icon} size={12} className="mr-1" />
                            {issue.priority.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {assignedUser ? (
                            <div className="flex items-center gap-3">
                              <Avatar 
                                name={assignedUser.name}
                                src={assignedUser.avatar}
                                size="sm"
                              />
                              <span className="text-sm text-gray-900 font-medium">
                                {assignedUser.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {format(new Date(issue.updatedAt), "MMM d, yyyy")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedIssue(issue)}
                          >
                            <ApperIcon name="Edit" size={14} className="mr-1" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdate={handleUpdateIssue}
        onDelete={handleDeleteIssue}
        users={users}
      />
    </div>
  );
};

export default ListView;