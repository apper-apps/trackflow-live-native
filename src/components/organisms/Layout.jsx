import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import issueService from "@/services/api/issueService";
import userService from "@/services/api/userService";
import labelService from "@/services/api/labelService";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    loadUsers();
    loadLabels();
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await userService.getAll();
      setUsers(userData);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadLabels = async () => {
    try {
      const labelData = await labelService.getAll();
      setLabels(labelData);
    } catch (error) {
      console.error("Error loading labels:", error);
    }
  };

  const handleCreateIssue = async (issueData) => {
    try {
      await issueService.create({
        ...issueData,
        status: "open",
        description: ""
      });
    } catch (error) {
      console.error("Error creating issue:", error);
      throw error;
    }
  };

  const handleGlobalSearch = (searchTerm) => {
    // Global search functionality can be implemented here
    console.log("Global search:", searchTerm);
  };

return (
    <div className="min-h-screen bg-background">
      <Header
        onCreateIssue={handleCreateIssue}
        onGlobalSearch={handleGlobalSearch}
        users={users}
        labels={labels}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;