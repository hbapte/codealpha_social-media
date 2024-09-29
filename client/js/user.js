document.addEventListener('DOMContentLoaded', () => {
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userUsername = document.getElementById('user-username');
    const userBio = document.getElementById('user-bio');
    const postsCount = document.getElementById('posts-count');
    const followersCount = document.getElementById('followers-count');
    const followingCount = document.getElementById('following-count');
    const followBtn = document.getElementById('follow-btn');
    const postsContainer = document.getElementById('posts-container');

    // Simulated user data
    const userData = {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: './assets/placeholder.svg',
        bio: 'Passionate photographer and travel enthusiast. Capturing moments and exploring the world one click at a time. 📸✈️',
        postsCount: 42,
        followersCount: 1234,
        followingCount: 567,
        isFollowing: false
    };

    // Simulated user posts
    const userPosts = [
        {
            id: 1,
            content: 'Just captured this amazing sunset! 🌅 #photography #nature',
            likes: 89,
            comments: 12,
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 2,
            content: 'Exploring the streets of Tokyo. So much inspiration everywhere! 🗼🏙️ #travel #japan',
            likes: 134,
            comments: 23,
            timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 3,
            content: 'New camera day! Can\'t wait to test it out this weekend. 📷 #photography #gear',
            likes: 56,
            comments: 8,
            timestamp: new Date(Date.now() - 172800000).toISOString()
        }
    ];

    // Render user profile
    function renderUserProfile() {
        userAvatar.src = userData.avatar;
        userAvatar.alt = `${userData.name}'s avatar`;
        userName.textContent = userData.name;
        userUsername.textContent = `@${userData.username}`;
        userBio.textContent = userData.bio;
        postsCount.textContent = userData.postsCount;
        followersCount.textContent = userData.followersCount;
        followingCount.textContent = userData.followingCount;
        updateFollowButton();
    }

    // Render user posts
    function renderUserPosts() {
        postsContainer.innerHTML = '';
        userPosts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }

    // Create post element
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <p class="post-content">${post.content}</p>
            <div class="post-actions">
                <span class="post-action">
                    <i data-lucide="heart"></i> ${post.likes}
                </span>
                <span class="post-action">
                    <i data-lucide="message-circle"></i> ${post.comments}
                </span>
                <span class="post-action">
                    ${formatTimestamp(post.timestamp)}
                </span>
            </div>
        `;
        lucide.createIcons();
        return postElement;
    }

    // Update follow button
    function updateFollowButton() {
        followBtn.textContent = userData.isFollowing ? 'Following' : 'Follow';
        followBtn.classList.toggle('following', userData.isFollowing);
    }

    // Handle follow button click
    followBtn.addEventListener('click', () => {
        userData.isFollowing = !userData.isFollowing;
        userData.followersCount += userData.isFollowing ? 1 : -1;
        followersCount.textContent = userData.followersCount;
        updateFollowButton();
    });

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

    // Initialize page
    renderUserProfile();
    renderUserPosts();
});