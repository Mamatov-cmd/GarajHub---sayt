// db.js - MongoDB Atlas bilan ishlash uchun funksiyalar

const MONGODB_URI = "mongodb+srv://ozod:ozod@cluster0.pcabdl3.mongodb.net/?appName=Cluster0";

// ⚠️ MUHIM: Yuqoridagi URI ni o'zgartiring:
// 1. <username> va <password> ni o'z MongoDB Atlas ma'lumotlaringiz bilan almashtiring
// 2. cluster0.xxxxx ni o'z cluster manzilingiz bilan almashtiring
// 3. garajhub - bu database nomi (o'zgartirishingiz mumkin)

// MongoDB bilan ishlash uchun asosiy funksiyalar
class DatabaseAPI {
  constructor() {
    this.baseURL = '/api'; // Backend API endpoint
  }

  // Umumiy request funksiyasi
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Database request error:', error);
      throw error;
    }
  }

  // === USERS ===
  async getUsers() {
    return this.request('/users');
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // === STARTUPS ===
  async getStartups(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/startups?${params}`);
  }

  async getStartupById(startupId) {
    return this.request(`/startups/${startupId}`);
  }

  async createStartup(startupData) {
    return this.request('/startups', {
      method: 'POST',
      body: JSON.stringify(startupData),
    });
  }

  async updateStartup(startupId, startupData) {
    return this.request(`/startups/${startupId}`, {
      method: 'PUT',
      body: JSON.stringify(startupData),
    });
  }

  async deleteStartup(startupId) {
    return this.request(`/startups/${startupId}`, {
      method: 'DELETE',
    });
  }

  async approveStartup(startupId) {
    return this.request(`/startups/${startupId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectStartup(startupId, reason) {
    return this.request(`/startups/${startupId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  // === JOIN REQUESTS ===
  async getJoinRequests(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/join-requests?${params}`);
  }

  async createJoinRequest(requestData) {
    return this.request('/join-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async acceptJoinRequest(requestId) {
    return this.request(`/join-requests/${requestId}/accept`, {
      method: 'PATCH',
    });
  }

  async rejectJoinRequest(requestId) {
    return this.request(`/join-requests/${requestId}/reject`, {
      method: 'PATCH',
    });
  }

  // === NOTIFICATIONS ===
  async getNotifications(userId) {
    return this.request(`/notifications?userId=${userId}`);
  }

  async createNotification(notificationData) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async markAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllAsRead(userId) {
    return this.request(`/notifications/read-all?userId=${userId}`, {
      method: 'PATCH',
    });
  }

  // === TASKS ===
  async getTasks(startupId) {
    return this.request(`/startups/${startupId}/tasks`);
  }

  async createTask(startupId, taskData) {
    return this.request(`/startups/${startupId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(startupId, taskId, taskData) {
    return this.request(`/startups/${startupId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(startupId, taskId) {
    return this.request(`/startups/${startupId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async moveTask(startupId, taskId, newStatus) {
    return this.request(`/startups/${startupId}/tasks/${taskId}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
  }

  // === AUTHENTICATION ===
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }
}

// Export qilish
export const db = new DatabaseAPI();

// localStorage bilan ishlash uchun yordamchi funksiyalar (fallback)
export const localStorageDB = {
  getUsers: () => JSON.parse(localStorage.getItem('gh_users_v8') || '[]'),
  setUsers: (users) => localStorage.setItem('gh_users_v8', JSON.stringify(users)),
  
  getCurrentUser: () => JSON.parse(localStorage.getItem('gh_current_v8') || 'null'),
  setCurrentUser: (user) => localStorage.setItem('gh_current_v8', JSON.stringify(user)),
  
  getStartups: () => JSON.parse(localStorage.getItem('gh_startups_v8') || '[]'),
  setStartups: (startups) => localStorage.setItem('gh_startups_v8', JSON.stringify(startups)),
  
  getRequests: () => JSON.parse(localStorage.getItem('gh_requests_v8') || '[]'),
  setRequests: (requests) => localStorage.setItem('gh_requests_v8', JSON.stringify(requests)),
  
  getNotifications: () => JSON.parse(localStorage.getItem('gh_notifs_v8') || '[]'),
  setNotifications: (notifs) => localStorage.setItem('gh_notifs_v8', JSON.stringify(notifs)),
};

export default db;