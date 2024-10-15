function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }


document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token'); 
    if (!token) {
      window.location.href = './login.html';
      return; 
    }

    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userUsername = document.getElementById('user-username');
    const userBio = document.getElementById('user-bio');
    const postsCount = document.getElementById('posts-count');
    const followersCount = document.getElementById('followers-count');
    const followingCount = document.getElementById('following-count');
    const followBtn = document.getElementById('follow-btn');
    const postsContainer = document.getElementById('posts-container');

    // Get username from URL
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');

    // Fetch user data from API
    async function fetchUserData() {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                renderUserProfile(data.user);
                renderUserPosts(data.user.posts); // Assuming the posts are also in the user object
            } else {
                console.error('Failed to fetch user data:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Render user profile
    function renderUserProfile(user) {
        userAvatar.src = user.avatar || './assets/placeholder.svg'; // Use placeholder if avatar is not provided
        userAvatar.alt = `${user.names}'s avatar`;
        userName.textContent = user.names;
        userUsername.textContent = `@${user.username}`;
        userBio.textContent = user.bio || 'No bio available'; // Default message if no bio
        postsCount.textContent = user.posts.length; // Count posts from fetched data
        followersCount.textContent = user.followers.length; // Count followers from fetched data
        followingCount.textContent = user.following.length; // Count following from fetched data
        updateFollowButton(user.followers); // Pass followers to update button state
    }

    // Render user posts
    function renderUserPosts(posts) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
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
    function updateFollowButton(followers) {
        const isFollowing = followers.some(follower => follower.username === localStorage.getItem('username')); // Check if logged-in user is in followers
        followBtn.textContent = isFollowing ? 'Following' : 'Follow';
        followBtn.classList.toggle('following', isFollowing);
    }

    // Handle follow button click
    followBtn.addEventListener('click', () => {
        const isFollowing = followBtn.textContent === 'Following';
        const newFollowersCount = parseInt(followersCount.textContent) + (isFollowing ? -1 : 1);
        followersCount.textContent = newFollowersCount; // Update followers count
        followBtn.textContent = isFollowing ? 'Follow' : 'Following';
        followBtn.classList.toggle('following', !isFollowing);
        
        // Optionally, you can make API call to update follow status here.
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

    // Fetch user data when the page loads
    fetchUserData();
});
