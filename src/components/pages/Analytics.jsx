import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import issueService from "@/services/api/issueService";
import userService from "@/services/api/userService";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";

const Analytics = () => {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

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
      setError("Failed to load analytics data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading analytics..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  // Calculate metrics
  const totalIssues = issues.length;
  const openIssues = issues.filter(issue => issue.status === "open").length;
  const inProgressIssues = issues.filter(issue => issue.status === "in-progress").length;
  const closedIssues = issues.filter(issue => issue.status === "closed").length;
  const reviewIssues = issues.filter(issue => issue.status === "review").length;

  // Priority distribution
  const criticalIssues = issues.filter(issue => issue.priority === "critical").length;
  const highIssues = issues.filter(issue => issue.priority === "high").length;
  const mediumIssues = issues.filter(issue => issue.priority === "medium").length;
  const lowIssues = issues.filter(issue => issue.priority === "low").length;

  // Recent activity (last 7 days)
  const last7Days = subDays(new Date(), 7);
  const recentIssues = issues.filter(issue => 
    isWithinInterval(new Date(issue.createdAt), {
      start: startOfDay(last7Days),
      end: endOfDay(new Date())
    })
  );

  // User assignment stats
const userStats = users.map(user => {
    const userIssues = issues.filter(issue => issue.assignee == user.Id);
    const closedUserIssues = userIssues.filter(issue => issue.status === "closed");
    return {
      ...user,
      totalIssues: userIssues.length,
      closedIssues: closedUserIssues.length,
      openIssues: userIssues.length - closedUserIssues.length,
      completionRate: userIssues.length > 0 ? Math.round((closedUserIssues.length / userIssues.length) * 100) : 0
    };
  }).sort((a, b) => b.totalIssues - a.totalIssues);

  const StatCard = ({ title, value, subtitle, icon, gradient, badge }) => (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-0 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {badge && badge}
          </div>
          {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );

  const PriorityCard = ({ priority, count, total, config }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    return (
      <Card className="p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="font-semibold">
              <ApperIcon name={config.icon} size={12} className="mr-1" />
              {priority.toUpperCase()}
            </Badge>
          </div>
          <span className="text-2xl font-bold text-gray-900">{count}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Percentage</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${
                config.variant === 'error' ? 'from-error to-red-600' :
                config.variant === 'warning' ? 'from-warning to-amber-600' :
                config.variant === 'info' ? 'from-info to-blue-600' :
                'from-success to-green-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">Track your team's performance and issue metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Issues"
          value={totalIssues}
          subtitle="All time"
          icon="Package"
          gradient="from-primary to-secondary"
        />
        <StatCard
          title="Open Issues"
          value={openIssues}
          subtitle="Needs attention"
          icon="CircleDot"
          gradient="from-error to-red-600"
        />
        <StatCard
          title="In Progress"
          value={inProgressIssues}
          subtitle="Being worked on"
          icon="Play"
          gradient="from-warning to-amber-600"
        />
        <StatCard
          title="Completed"
          value={closedIssues}
          subtitle="This period"
          icon="CheckCircle"
          gradient="from-success to-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Issue Status Distribution</h3>
            <ApperIcon name="PieChart" size={20} className="text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              { status: "open", count: openIssues, color: "bg-error", label: "Open" },
              { status: "in-progress", count: inProgressIssues, color: "bg-warning", label: "In Progress" },
              { status: "review", count: reviewIssues, color: "bg-info", label: "Review" },
              { status: "closed", count: closedIssues, color: "bg-success", label: "Closed" }
            ].map(({ status, count, color, label }) => {
              const percentage = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8">{count}</span>
                    <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <ApperIcon name="Activity" size={20} className="text-gray-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Plus" size={16} className="text-primary" />
                <span className="text-sm font-medium">New Issues (7 days)</span>
              </div>
              <span className="text-lg font-bold text-primary">{recentIssues.length}</span>
            </div>
            
            {recentIssues.slice(0, 5).map(issue => (
              <div key={issue.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(issue.createdAt), "MMM d, h:mm a")}
                  </p>
                </div>
                <Badge 
                  variant={
                    issue.priority === "critical" ? "error" :
                    issue.priority === "high" ? "warning" :
                    issue.priority === "medium" ? "info" : "success"
                  }
                  className="text-xs"
                >
                  {issue.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Priority Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriorityCard
            priority="critical"
            count={criticalIssues}
            total={totalIssues}
            config={{ variant: "error", icon: "Flame" }}
          />
          <PriorityCard
            priority="high"
            count={highIssues}
            total={totalIssues}
            config={{ variant: "warning", icon: "ArrowUp" }}
          />
          <PriorityCard
            priority="medium"
            count={mediumIssues}
            total={totalIssues}
            config={{ variant: "info", icon: "Minus" }}
          />
          <PriorityCard
            priority="low"
            count={lowIssues}
            total={totalIssues}
            config={{ variant: "success", icon: "ArrowDown" }}
          />
        </div>
      </div>

      {/* Team Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
          <ApperIcon name="Users" size={20} className="text-gray-500" />
        </div>
        <div className="space-y-4">
          {userStats.map(user => (
            <div key={user.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{user.totalIssues}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{user.closedIssues}</p>
                  <p className="text-xs text-gray-500">Closed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-warning">{user.openIssues}</p>
                  <p className="text-xs text-gray-500">Open</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{user.completionRate}%</p>
                  <p className="text-xs text-gray-500">Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;