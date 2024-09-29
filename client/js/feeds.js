// client\js\feeds.js
document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('create-post-form');
    const feedsContainer = document.getElementById('feeds');
    const API_URL = 'http://localhost:8080/api/post';

    // Simulated user data for rendering posts
    const currentUser = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe123',
        avatar: './assets/placeholder.svg?height=40&width=40'
    };

    // Fetch posts from the API
    async function fetchPosts() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your actual bearer token
                }
            });

            const data = await response.json();
            return data.posts; // Assumes the API returns an array of posts under "posts"
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    // Handle post creation
    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('post-content').value.trim();
        
        if (content) {
            try {
                // Send the post to the API
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your actual bearer token
                    },
                    body: JSON.stringify({ content })
                });

                if (response.ok) {
                    const newPost = await response.json(); // Get the newly created post data from response
                    posts.unshift(newPost); // Add the new post to the beginning of the posts array
                    renderPosts(posts); // Re-render posts
                    createPostForm.reset(); // Reset the form after successful submission
                } else {
                    console.error('Error creating post:', response.statusText);
                }
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
    });

    // Render posts
    function renderPosts(posts) {
        feedsContainer.innerHTML = ''; // Clear previous posts
        posts.forEach(post => {
            const postElement = createPostElement(post);
            feedsContainer.appendChild(postElement);
        });
    }

    // Create post element for each post
    function createPostElement(post) {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.userId.avatar || './assets/placeholder.svg?height=32&width=32'}" alt="${post.userId.names}" class="post-avatar">
                <span class="post-user">${post.userId.names}</span>
                <span class="post-username">@${post.userId.username}</span>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <span class="post-action" onclick="likePost('${post._id}')">
                    <i data-lucide="heart"></i> ${post.likes.length}
                </span>
                <span class="post-action" onclick="commentPost('${post._id}')">
                    <i data-lucide="message-circle"></i> ${post.comments.length}
                </span>
                <span class="post-action" onclick="sharePost('${post._id}')">
                    <i data-lucide="share-2"></i> Share
                </span>
            </div>
            <small>Posted on ${new Date(post.createdAt).toLocaleString()}</small>
        `;
        return postElement;
    }

    // Placeholder functions for post actions
    function likePost(postId) {
        console.log(`Liked post ${postId}`);
        // Implement like post functionality here (e.g., send a request to the server)
    }

    function commentPost(postId) {
        console.log(`Commenting on post ${postId}`);
        // Implement comment functionality here
    }

    function sharePost(postId) {
        console.log(`Sharing post ${postId}`);
        // Implement sharing functionality here
    }

    // Initialize Lucide icons
    lucide.createIcons();

    // Fetch and render posts on page load
    fetchPosts().then(posts => {
        renderPosts(posts);
    });
});
