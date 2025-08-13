import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.users];
  }

  async getById(id) {
    await this.delay(200);
    const user = this.users.find(user => user.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await this.delay(400);
    const maxId = Math.max(...this.users.map(user => user.Id));
    const newUser = {
      Id: maxId + 1,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || "",
      role: userData.role || "developer"
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, updateData) {
    await this.delay(300);
    const userIndex = this.users.findIndex(user => user.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    const updatedUser = {
      ...this.users[userIndex],
      ...updateData,
      Id: parseInt(id)
    };
    
    this.users[userIndex] = updatedUser;
    return { ...updatedUser };
  }

  async delete(id) {
    await this.delay(250);
    const userIndex = this.users.findIndex(user => user.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    this.users.splice(userIndex, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new UserService();