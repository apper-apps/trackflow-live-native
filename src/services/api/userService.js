class UserService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'user_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "role_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database format to UI format
      return response.data?.map(user => ({
        Id: user.Id,
        name: user.Name,
        email: user.email_c || "",
        avatar: user.avatar_c || "",
        role: user.role_c || "developer"
      })) || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "role_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const user = response.data;
      return {
        Id: user.Id,
        name: user.Name,
        email: user.email_c || "",
        avatar: user.avatar_c || "",
        role: user.role_c || "developer"
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async create(userData) {
    try {
      const params = {
        records: [{
          Name: userData.name,
          email_c: userData.email,
          avatar_c: userData.avatar || "",
          role_c: userData.role || "developer"
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
          console.error(`Failed to create user: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to create user');
        }
        
        const newUser = result.data;
        return {
          Id: newUser.Id,
          name: newUser.Name,
          email: newUser.email_c || "",
          avatar: newUser.avatar_c || "",
          role: newUser.role_c || "developer"
        };
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updateRecord = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (updateData.name !== undefined) updateRecord.Name = updateData.name;
      if (updateData.email !== undefined) updateRecord.email_c = updateData.email;
      if (updateData.avatar !== undefined) updateRecord.avatar_c = updateData.avatar;
      if (updateData.role !== undefined) updateRecord.role_c = updateData.role;
      
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
          console.error(`Failed to update user: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to update user');
        }
        
        const updatedUser = result.data;
        return {
          Id: updatedUser.Id,
          name: updatedUser.Name,
          email: updatedUser.email_c || "",
          avatar: updatedUser.avatar_c || "",
          role: updatedUser.role_c || "developer"
        };
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating user:", error);
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
          console.error(`Failed to delete user: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to delete user');
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export default new UserService();