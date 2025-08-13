class LabelService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'label_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "description_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database format to UI format
      return response.data?.map(label => ({
        Id: label.Id,
        name: label.Name,
        color: label.color_c || "#3B82F6",
        description: label.description_c || ""
      })) || [];
    } catch (error) {
      console.error("Error fetching labels:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "description_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const label = response.data;
      return {
        Id: label.Id,
        name: label.Name,
        color: label.color_c || "#3B82F6",
        description: label.description_c || ""
      };
    } catch (error) {
      console.error("Error fetching label:", error);
      throw error;
    }
  }

  async create(labelData) {
    try {
      const params = {
        records: [{
          Name: labelData.name,
          color_c: labelData.color || "#3B82F6",
          description_c: labelData.description || ""
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
          console.error(`Failed to create label: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to create label');
        }
        
        const newLabel = result.data;
        return {
          Id: newLabel.Id,
          name: newLabel.Name,
          color: newLabel.color_c || "#3B82F6",
          description: newLabel.description_c || ""
        };
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating label:", error);
      throw error;
    }
  }

  async update(id, labelData) {
    try {
      const updateRecord = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (labelData.name !== undefined) updateRecord.Name = labelData.name;
      if (labelData.color !== undefined) updateRecord.color_c = labelData.color;
      if (labelData.description !== undefined) updateRecord.description_c = labelData.description;
      
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
          console.error(`Failed to update label: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to update label');
        }
        
        const updatedLabel = result.data;
        return {
          Id: updatedLabel.Id,
          name: updatedLabel.Name,
          color: updatedLabel.color_c || "#3B82F6",
          description: updatedLabel.description_c || ""
        };
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating label:", error);
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
          console.error(`Failed to delete label: ${JSON.stringify([result])}`);
          throw new Error(result.message || 'Failed to delete label');
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting label:", error);
      throw error;
    }
  }
}

const labelService = new LabelService();

export default labelService;