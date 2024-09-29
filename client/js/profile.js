document.addEventListener('DOMContentLoaded', () => {
    // Simulated user data (in a real app, this would come from an API)
    const userData = {
        names: "John Doe",
        email: "john.doe@example.com",
        username: "johndoe123",
        bio: "Web developer and coffee enthusiast. Passionate about creating beautiful and functional user interfaces.",
        avatar: "./assets/placeholder.svg?height=128&width=128",
        followers: Array(1234),
        following: Array(567),
        posts: Array(89),
        emailVerified: true
    };

    // Populate user profile
    function populateUserProfile(user) {
        document.getElementById('names').textContent = user.names;
        document.getElementById('username').textContent = '@' + user.username;
        document.getElementById('bio').textContent = user.bio;
        document.getElementById('email').textContent = user.email;
        document.getElementById('avatar').src = user.avatar;
        
        document.getElementById('followers-count').textContent = user.followers.length;
        document.getElementById('following-count').textContent = user.following.length;
        document.getElementById('posts-count').textContent = user.posts.length;
        
        if (!user.emailVerified) {
            document.getElementById('verified-badge').style.display = 'none';
        }
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

    // Populate the profile when the page loads
    populateUserProfile(userData);
});