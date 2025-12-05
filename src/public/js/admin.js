// Admin JavaScript utilities

// Check for stored auth token on admin pages
document.addEventListener('DOMContentLoaded', function() {
  // Get token from localStorage (will be set after login)
  const token = localStorage.getItem('accessToken');

  // Redirect to login if no token and not on login page
  if (!token && !window.location.pathname.includes('/admin/login')) {
    window.location.href = '/admin/login?error=Please login to continue';
  }
});

// Logout functionality
const logoutLinks = document.querySelectorAll('a[href="/admin/logout"]');
logoutLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    // Clear stored token
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Redirect to login
    window.location.href = '/admin/login';
  });
});

// Helper function for API calls
async function apiCall(url, options = {}) {
  const token = localStorage.getItem('accessToken');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  // Properly merge headers to avoid overwriting Authorization header
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, mergedOptions);

  // Handle unauthorized - redirect to login
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/admin/login?error=Session expired';
    return null;
  }

  return response;
}

// Export for use in other scripts
window.apiCall = apiCall;

// Form validation helper
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
  });

  return isValid;
}

// Show loading state on buttons
function setButtonLoading(button, loading = true) {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Loading...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 0.375rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  input.error,
  textarea.error,
  select.error {
    border-color: #ef4444 !important;
  }
`;
document.head.appendChild(style);

// Export utilities
window.validateForm = validateForm;
window.setButtonLoading = setButtonLoading;
window.showToast = showToast;
