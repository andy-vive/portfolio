/**
 * Centralized API Module
 * Handles all communication with backend REST API
 */

// Helper to build query strings
function buildQueryString(params) {
  const queryParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

// API Module
const API = {
  // Authentication endpoints
  auth: {
    async login(username, password) {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      return data.data; // Returns { accessToken, refreshToken }
    },

    async logout() {
      // Use apiCall if available (admin pages), otherwise use fetch
      const makeRequest = typeof window.apiCall === 'function'
        ? window.apiCall
        : fetch;

      const response = await makeRequest('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Logout failed' }));
        throw new Error(error.message || 'Logout failed');
      }

      return true;
    },
  },

  // Projects endpoints
  projects: {
    async list(filters = {}) {
      const queryString = buildQueryString(filters);
      const response = await fetch(`/api/projects${queryString}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch projects' }));
        throw new Error(error.message || 'Failed to fetch projects');
      }

      const data = await response.json();
      return data.data; // Returns { projects, pagination }
    },

    async get(id) {
      const response = await fetch(`/api/projects/${id}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch project' }));
        throw new Error(error.message || 'Failed to fetch project');
      }

      const data = await response.json();
      return data.data; // Returns project object
    },

    async create(projectData) {
      // Use apiCall for authentication (admin only)
      const response = await window.apiCall(`/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to create project' }));
        throw new Error(error.message || 'Failed to create project');
      }

      const data = await response.json();
      return data.data; // Returns created project
    },

    async update(id, projectData) {
      // Use apiCall for authentication (admin only)
      const response = await window.apiCall(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to update project' }));
        throw new Error(error.message || 'Failed to update project');
      }

      const data = await response.json();
      return data.data; // Returns updated project
    },

    async delete(id) {
      // Use apiCall for authentication (admin only)
      const response = await window.apiCall(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to delete project' }));
        throw new Error(error.message || 'Failed to delete project');
      }

      return true;
    },
  },

  // Achievements endpoints
  achievements: {
    async list(filters = {}) {
      const queryString = buildQueryString(filters);
      const response = await fetch(`/api/achievements${queryString}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch achievements' }));
        throw new Error(error.message || 'Failed to fetch achievements');
      }

      const data = await response.json();
      return data.data; // Returns { achievements, pagination }
    },

    async get(id) {
      const response = await fetch(`/api/achievements/${id}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch achievement' }));
        throw new Error(error.message || 'Failed to fetch achievement');
      }

      const data = await response.json();
      return data.data; // Returns achievement object
    },

    async create(achievementData) {
      // Use apiCall for authentication (admin only)
      const response = await window.apiCall(`/api/achievements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievementData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to create achievement' }));
        throw new Error(error.message || 'Failed to create achievement');
      }

      const data = await response.json();
      return data.data; // Returns created achievement
    },

    async update(id, achievementData) {
      // Use apiCall for authentication (admin only)
      const response = await window.apiCall(`/api/achievements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievementData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to update achievement' }));
        throw new Error(error.message || 'Failed to update achievement');
      }

      const data = await response.json();
      return data.data; // Returns updated achievement
    },

    async delete(id) {
      // Use apiCall for authentication (admin only)
      const response = await window.apiCall(`/api/achievements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to delete achievement' }));
        throw new Error(error.message || 'Failed to delete achievement');
      }

      return true;
    },
  },
};

// Export to window for global access
window.API = API;
