import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import QuickCreateForm from "@/components/molecules/QuickCreateForm";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ 
  onCreateIssue, 
  onGlobalSearch, 
  users = [], 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: "/board", label: "Board", icon: "Kanban" },
    { path: "/list", label: "List", icon: "List" },
    { path: "/analytics", label: "Analytics", icon: "BarChart3" },
    { path: "/settings", label: "Settings", icon: "Settings" }
  ];

  const handleQuickCreate = async (issueData) => {
    await onCreateIssue(issueData);
    setShowQuickCreate(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="Bug" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TrackFlow
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 mx-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <ApperIcon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-64">
              <SearchBar 
                onSearch={onGlobalSearch} 
                placeholder="Search issues..."
                className="bg-gradient-to-r from-gray-50 to-white"
              />
            </div>

            <div className="relative">
              <Button
                onClick={() => setShowQuickCreate(!showQuickCreate)}
                size="sm"
                className="flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ApperIcon name="Plus" size={16} />
                <span className="hidden sm:inline">Quick Add</span>
              </Button>

              {/* Quick Create Dropdown */}
              {showQuickCreate && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Create New Issue</h3>
                    <button
                      onClick={() => setShowQuickCreate(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                  <QuickCreateForm
                    onSubmit={handleQuickCreate}
                    onCancel={() => setShowQuickCreate(false)}
                    users={users}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <SearchBar 
                onSearch={onGlobalSearch} 
                placeholder="Search issues..."
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;