document.addEventListener('DOMContentLoaded', () => {
    const usersGrid = document.getElementById('users-grid');
    const userSearch = document.getElementById('user-search');
    const searchBtn = document.getElementById('search-btn');

    // Simulated users data
    const users = [
        { id: 1, name: 'John Doe', username: 'johndoe', avatar: './assets/placeholder.svg', isFollowing: false },
        { id: 2, name: 'Jane Smith', username: 'janesmith', avatar: './assets/placeholder.svg', isFollowing: true },
        { id: 3, name: 'Alice Johnson', username: 'alicej', avatar: './assets/placeholder.svg', isFollowing: false },
        { id: 4, name: 'Bob Wilson', username: 'bobwilson', avatar: './assets/placeholder.svg', isFollowing: false },
        { id: 5, name: 'Emma Brown', username: 'emmab', avatar: './assets/placeholder.svg', isFollowing: true },
        { id: 6, name: 'Michael Lee', username: 'michaell', avatar: './assets/placeholder.svg', isFollowing: false },
    ];

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
            <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
            <h3 class="user-name">${user.name}</h3>
            <p class="user-username">@${user.username}</p>
            <button class="follow-btn ${user.isFollowing ? 'following' : ''}" data-user-id="${user.id}">
                ${user.isFollowing ? 'Following' : 'Follow'}
            </button>
        `;

        const followBtn = userCard.querySelector('.follow-btn');
        followBtn.addEventListener('click', () => toggleFollow(user.id));

        return userCard;
    }

    // Toggle follow status
    function toggleFollow(userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.isFollowing = !user.isFollowing;
            renderUsers(users);
        }
    }

    // Search users
    function searchUsers(query) {
        return users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
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

    // Initial render
    renderUsers(users);

    // Initialize Lucide icons
    lucide.createIcons();
});