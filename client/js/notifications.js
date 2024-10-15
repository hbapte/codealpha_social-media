// client\js\notifications.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Function to get the cookie value (if needed for authentication)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to decode JWT and extract userId
function getUserIdFromToken(token) {
    if (!token) return null;

    const payloadBase64 = token.split('.')[1]
    const payloadJson = atob(payloadBase64); 
    const payload = JSON.parse(payloadJson); 

    return payload.userId; 
}

// Socket initialization


document.addEventListener('DOMContentLoaded', async () => {
    const token = getCookie('token'); 
    if (!token) {
      window.location.href = './login.html';
      return; 
    }

    const socket = io('http://localhost:8080');
    
    const userId = getUserIdFromToken(token); 
    if (!userId) {
        alert('Invalid token. Unable to get user ID.');
        return;
    }

    

    socket.emit('join', userId); 

    const notificationsList = document.getElementById('notifications-list');
    async function fetchNotifications() {
        try {
            const response = await fetch('http://localhost:8080/api/notification', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.notifications;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            return [];
        }
    }

    // Render notifications
    async function renderNotifications() {
        const notifications = await fetchNotifications();
        notificationsList.innerHTML = ''; // Clear the list before adding new notifications

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p>No notifications found.</p>';
            return;
        }

        notifications.forEach(notification => {
            const notificationElement = createNotificationElement(notification);
            notificationsList.appendChild(notificationElement);
        });
    }

    // Create notification element
    function createNotificationElement(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';

        const iconName = getIconName(notification.type);

        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">
                    ${notification.content}
                </div>
                <div class="notification-timestamp">
                    ${formatTimestamp(notification.createdAt)}
                </div>
            </div>
            ${getActionButton(notification)}
        `;

        lucide.createIcons(); // Reinitialize icons
        return notificationElement;
    }

    // Get icon name based on notification type
    function getIconName(type) {
        switch (type) {
            case 'like': return 'heart';
            case 'comment': return 'message-circle';
            case 'follow': return 'user-plus';
            default: return 'bell';
        }
    }

    // Get action button based on notification type
    function getActionButton(notification) {
        return `<a href="${notification.link}" class="notification-action">View</a>`;
    }

    // Format timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            });
        }
    }

    // Initialize page by fetching and rendering notifications
    renderNotifications();
});
