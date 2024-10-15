// client\js\users.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }


  function decodeToken(token) {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token'); 
    if (!token) {
      window.location.href = './login.html';
      return; 
    }

    const currentUser = decodeToken(token);
    
    const usersGrid = document.getElementById('users-grid');
    const userSearch = document.getElementById('user-search');
    const searchBtn = document.getElementById('search-btn');

    // Fetch users from API
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                const filteredUsers = data.users.filter(user => user._id !== currentUser.userId);
                const usersWithFollowStatus = await Promise.all(filteredUsers.map(async user => {
                    const isFollowing = await checkFollowingStatus(user._id);
                    return { ...user, isFollowing };
                }));
                renderUsers(usersWithFollowStatus);
            } else {
                const errorText = await response.text(); 
                console.error('Failed to fetch users:', errorText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Render users
    function renderUsers(usersToRender) {
        usersGrid.innerHTML = '';
        usersToRender.forEach(user => {
            const userCard = createUserCard(user);
            usersGrid.appendChild(userCard);
        });
    }

    // Create user card
    function createUserCard(user) {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <img src="${user.avatar || './assets/placeholder.svg'}" alt="${user.names}" class="user-avatar">
            <h3 class="user-name">${user.names}</h3>
            <p class="user-username">@${user.username}</p>
            <button class="follow-btn ${user.isFollowing ? 'following' : ''}" data-user-id="${user._id}">
                ${user.isFollowing ? 'Following' : 'Follow'}
            </button>
        `;

        const followBtn = userCard.querySelector('.follow-btn');
        followBtn.addEventListener('click', () => toggleFollow(user._id, user.isFollowing, followBtn));

        // Add click event to redirect to user.html with username parameter
        userCard.addEventListener('click', () => {
            window.location.href = `/client/user.html?username=${encodeURIComponent(user.username)}`;
        });

        return userCard;
    }


    // Toggle follow/unfollow status
    async function toggleFollow(userId, isFollowing, followBtn) {
        try {
            const url = `http://localhost:8080/api/follow/${userId}`;
            const method = isFollowing ? 'DELETE' : 'POST'; 

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            const responseData = await response.json(); 

            if (response.ok) {
                // Toggle the button class and text dynamically after a successful follow/unfollow
                followBtn.classList.toggle('following'); // Toggle the 'following' class
                followBtn.textContent = isFollowing ? 'Follow' : 'Following'; // Update button text
            } else {
                console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user: ${responseData.message}`);
            }
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    }

    // Check if the current user is following a specific user
    async function checkFollowingStatus(followingId) {
        try {
            const response = await fetch(`http://localhost:8080/api/follow/is-following/${followingId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json(); 
            return data.isFollowing; 
        } catch (error) {
            console.error(`Error checking follow status for user ${followingId}:`, error);
            return false;
        }
    }

    // Search users
    function searchUsers(query, users) {
        return users.filter(user =>
            user.names.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Handle search
    searchBtn.addEventListener('click', () => {
        const query = userSearch.value.trim();
        const filteredUsers = searchUsers(query);
        renderUsers(filteredUsers);
    });

    // Handle search on enter key
    userSearch.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const query = userSearch.value.trim();
            const filteredUsers = searchUsers(query);
            renderUsers(filteredUsers);
        }
    });

    // Initial fetch and render
    fetchUsers();

    // Initialize Lucide icons
    lucide.createIcons();
});
