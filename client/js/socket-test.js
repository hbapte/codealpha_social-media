// Function to get the cookie value (if needed for authentication)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function getUserIdFromToken(token) {
    if (!token) return null;

    const payloadBase64 = token.split('.')[1]
    const payloadJson = atob(payloadBase64); 
    const payload = JSON.parse(payloadJson); 

    return payload.userId; 
}

const socket = io('http://localhost:8080'); 

document.addEventListener('DOMContentLoaded', () => {
    const joinButton = document.getElementById('join-button');
    const notificationsList = document.getElementById('notifications-list');

    // Join socket room with user ID
    joinButton.addEventListener('click', () => {
        const token = getCookie('token'); // Get the user token (if needed)
        if (!token) {
            alert('You need to be logged in to join the socket.');
            return;
        }

        const userId = getUserIdFromToken(token); 
        if (!userId) {
            alert('Invalid token. Unable to get user ID.');
            return;
        }

        socket.emit('join', userId); 

        // Display message
        notificationsList.innerHTML += `<div>You have joined the socket as user: ${userId}</div>`;
    });

    // Listen for incoming notifications
    socket.on('receiveNotification', (notification) => {
        const notificationElement = createNotificationElement(notification);
        notificationsList.appendChild(notificationElement);
    });
});

// Create a notification element for display
function createNotificationElement(notification) {
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';

    notificationElement.innerHTML = `
        <div class="notification-content">
            <div class="notification-title">
                ${notification.content}
            </div>
            <div class="notification-timestamp">
                ${new Date(notification.createdAt).toLocaleString()} <!-- Format timestamp as needed -->
            </div>
        </div>
    `;
    return notificationElement;
}
