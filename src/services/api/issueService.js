import issuesData from "@/services/mockData/issues.json";

class IssueService {
  constructor() {
    this.issues = [...issuesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.issues];
  }

  async getById(id) {
    await this.delay(200);
    const issue = this.issues.find(issue => issue.id === id);
    if (!issue) {
      throw new Error("Issue not found");
    }
    return { ...issue };
  }

  async create(issueData) {
    await this.delay(400);
    const newIssue = {
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: issueData.title,
      description: issueData.description || "",
      status: issueData.status || "open",
      priority: issueData.priority || "medium",
      assignee: issueData.assignee || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.issues.push(newIssue);
    return { ...newIssue };
  }

  async update(id, updateData) {
    await this.delay(300);
    const issueIndex = this.issues.findIndex(issue => issue.id === id);
    if (issueIndex === -1) {
      throw new Error("Issue not found");
    }
    
    const updatedIssue = {
      ...this.issues[issueIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.issues[issueIndex] = updatedIssue;
    return { ...updatedIssue };
  }

  async delete(id) {
    await this.delay(250);
    const issueIndex = this.issues.findIndex(issue => issue.id === id);
    if (issueIndex === -1) {
      throw new Error("Issue not found");
    }
    
    this.issues.splice(issueIndex, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new IssueService();