class IssueService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'issue_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "label_ids_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database format to UI format
      return response.data?.map(issue => ({
        id: issue.Id,
        title: issue.title_c || issue.Name,
        description: issue.description_c || "",
        status: issue.status_c || "open",
        priority: issue.priority_c || "medium",
        assignee: issue.assignee_c?.Id || issue.assignee_c || "",
        labelIds: issue.label_ids_c ? issue.label_ids_c.split(',').map(id => parseInt(id)) : [],
        createdAt: issue.created_at_c || issue.CreatedOn || new Date().toISOString(),
        updatedAt: issue.updated_at_c || issue.ModifiedOn || new Date().toISOString()
      })) || [];
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "label_ids_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const issue = response.data;
      return {
        id: issue.Id,
        title: issue.title_c || issue.Name,
        description: issue.description_c || "",
        status: issue.status_c || "open",
        priority: issue.priority_c || "medium",
        assignee: issue.assignee_c?.Id || issue.assignee_c || "",
        labelIds: issue.label_ids_c ? issue.label_ids_c.split(',').map(id => parseInt(id)) : [],
        createdAt: issue.created_at_c || issue.CreatedOn || new Date().toISOString(),
        updatedAt: issue.updated_at_c || issue.ModifiedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching issue:", error);
      throw error;
    }
  }

  async create(issueData) {
    try {
      const params = {
        records: [{
          Name: issueData.title,
          title_c: issueData.title,
          description_c: issueData.description || "",
          status_c: issueData.status || "open",
          priority_c: issueData.priority || "medium",
          assignee_c: issueData.assignee ? parseInt(issueData.assignee) : null,
          label_ids_c: issueData.labelIds ? issueData.labelIds.join(',') : "",
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error(`Failed to create issue: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to create issue');
        }
        
        const newIssue = result.data;
        return {
          id: newIssue.Id,
          title: newIssue.title_c || newIssue.Name,
          description: newIssue.description_c || "",
          status: newIssue.status_c || "open",
          priority: newIssue.priority_c || "medium",
          assignee: newIssue.assignee_c?.Id || newIssue.assignee_c || "",
          labelIds: newIssue.label_ids_c ? newIssue.label_ids_c.split(',').map(id => parseInt(id)) : [],
          createdAt: newIssue.created_at_c || newIssue.CreatedOn || new Date().toISOString(),
          updatedAt: newIssue.updated_at_c || newIssue.ModifiedOn || new Date().toISOString()
        };
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating issue:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updateRecord = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (updateData.title !== undefined) {
        updateRecord.Name = updateData.title;
        updateRecord.title_c = updateData.title;
      }
      if (updateData.description !== undefined) updateRecord.description_c = updateData.description;
      if (updateData.status !== undefined) updateRecord.status_c = updateData.status;
      if (updateData.priority !== undefined) updateRecord.priority_c = updateData.priority;
      if (updateData.assignee !== undefined) {
        updateRecord.assignee_c = updateData.assignee ? parseInt(updateData.assignee) : null;
      }
      if (updateData.labelIds !== undefined) {
        updateRecord.label_ids_c = updateData.labelIds.join(',');
      }
      updateRecord.updated_at_c = new Date().toISOString();
      
      const params = {
        records: [updateRecord]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error(`Failed to update issue: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to update issue');
        }
        
        const updatedIssue = result.data;
        return {
          id: updatedIssue.Id,
          title: updatedIssue.title_c || updatedIssue.Name,
          description: updatedIssue.description_c || "",
          status: updatedIssue.status_c || "open",
          priority: updatedIssue.priority_c || "medium",
          assignee: updatedIssue.assignee_c?.Id || updatedIssue.assignee_c || "",
          labelIds: updatedIssue.label_ids_c ? updatedIssue.label_ids_c.split(',').map(id => parseInt(id)) : [],
          createdAt: updatedIssue.created_at_c || updatedIssue.CreatedOn || new Date().toISOString(),
          updatedAt: updatedIssue.updated_at_c || updatedIssue.ModifiedOn || new Date().toISOString()
        };
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating issue:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error(`Failed to delete issue: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to delete issue');
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting issue:", error);
      throw error;
    }
  }
}

export default new IssueService();
export default new IssueService();