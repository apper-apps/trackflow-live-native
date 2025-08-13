import mockLabels from '@/services/mockData/labels.json';

let labels = [...mockLabels];
let nextId = Math.max(...labels.map(l => l.Id)) + 1;

const labelService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...labels]), 100);
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const label = labels.find(l => l.Id === parseInt(id));
        if (label) {
          resolve({ ...label });
        } else {
          reject(new Error('Label not found'));
        }
      }, 100);
    });
  },

  create: async (labelData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLabel = {
          Id: nextId++,
          name: labelData.name,
          color: labelData.color,
          description: labelData.description || ''
        };
        labels.push(newLabel);
        resolve({ ...newLabel });
      }, 200);
    });
  },

  update: async (id, labelData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = labels.findIndex(l => l.Id === parseInt(id));
        if (index !== -1) {
          labels[index] = {
            ...labels[index],
            name: labelData.name,
            color: labelData.color,
            description: labelData.description
          };
          resolve({ ...labels[index] });
        } else {
          reject(new Error('Label not found'));
        }
      }, 200);
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = labels.findIndex(l => l.Id === parseInt(id));
        if (index !== -1) {
          labels.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error('Label not found'));
        }
      }, 100);
    });
  }
};

export default labelService;