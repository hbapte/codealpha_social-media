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

    const avatarElement = document.getElementById('avatar');
    const namesElement = document.getElementById('names');
    const usernameElement = document.getElementById('username');
    const bioElement = document.getElementById('bio');
    const emailElement = document.getElementById('email');
    const followersCountElement = document.getElementById('followers-count');
    const followingCountElement = document.getElementById('following-count');
    const postsCountElement = document.getElementById('posts-count');
    const joinedAtElement = document.getElementById('joined-at');

    // Fetch user profile data from the API
    async function fetchUserProfile() {
         try {
            const response = await fetch('http://localhost:8080/api/user/profile', {
                method: 'GET',
                headers: {
                     Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            populateUserProfile(data.user);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    // Populate user profile
    function populateUserProfile(user) {
        namesElement.textContent = user.names;
        usernameElement.textContent = '@' + user.username;
        bioElement.textContent = user.bio || 'No bio available'; // Fallback for empty bio
        emailElement.textContent = user.email;
        avatarElement.src = user.avatar || './assets/placeholder.svg'; // Fallback for avatar
       
        followersCountElement.textContent = user.followers.length;
        followingCountElement.textContent = user.following.length;
        postsCountElement.textContent = user.posts.length;
        joinedAtElement.textContent = new Date(user.createdAt).toLocaleDateString();


        renderPosts(user.posts);
    }

    function renderPosts(posts) {
        postsContainer.innerHTML = ''; // Clear existing posts
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post'; // You can add styles in CSS for this class
            postElement.innerHTML = `
                <p>${post.content}</p>
                <p class="post-date">${new Date(post.createdAt).toLocaleDateString()}</p>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Initialize Lucide icons
    lucide.createIcons();

    // Fetch user profile when the page loads
    fetchUserProfile();
});
