import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import FilterBar from "@/components/molecules/FilterBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import issueService from "@/services/api/issueService";
import userService from "@/services/api/userService";

const BoardView = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  
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
  }, [issues, statusFilter, priorityFilter, assigneeFilter, searchTerm]);

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

    setFilteredIssues(filtered);
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const updatedIssue = await issueService.update(issueId, { status: newStatus });
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? updatedIssue : issue
      ));
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast.error("Failed to update issue status");
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

  const clearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setAssigneeFilter("");
    setSearchTerm("");
  };

  if (loading) {
    return <Loading message="Loading your kanban board..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Filters */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Issue Board
            </h1>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-sm text-gray-600 font-medium">
              {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}
            </span>
          </div>
          <p className="text-gray-600">Track and manage your team's issues through their lifecycle</p>
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

      {/* Board Content */}
      <div className="flex-1 overflow-hidden px-6">
        {filteredIssues.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Empty
              title="No issues to display"
              message={issues.length === 0 
                ? "Get started by creating your first issue to track bugs and tasks."
                : "No issues match your current filters. Try adjusting your search criteria."
              }
              icon="Kanban"
            />
          </div>
        ) : (
          <KanbanBoard
            issues={filteredIssues}
            onStatusChange={handleStatusChange}
            onEdit={setSelectedIssue}
            users={users}
            className="h-full"
          />
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

export default BoardView;