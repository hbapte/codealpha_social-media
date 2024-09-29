document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById('post');
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    // Simulated post data
    const post = {
        id: 1,
        user: {
            id: 2,
            name: 'Jane Smith',
            username: 'janesmith',
            avatar: '/placeholder.svg?height=48&width=48'
        },
        content: 'Just finished a great workout! 💪 #fitness #healthylifestyle',
        likes: 15,
        comments: [
            {
                id: 1,
                user: {
                    id: 3,
                    name: 'Bob Johnson',
                    username: 'bobjohnson',
                    avatar: '/placeholder.svg?height=32&width=32'
                },
                content: 'Great job! Keep it up! 👍',
                timestamp: new Date(Date.now() - 1800000).toISOString()
            },
            {
                id: 2,
                user: {
                    id: 4,
                    name: 'Alice Williams',
                    username: 'alicewilliams',
                    avatar: '/placeholder.svg?height=32&width=32'
                },
                content: 'What\'s your favorite workout routine?',
                timestamp: new Date(Date.now() - 900000).toISOString()
            }
        ],
        timestamp: new Date(Date.now() - 3600000).toISOString()
    };

    // Render post
    function renderPost() {
        postContainer.innerHTML = `
            <div class="post-header">
                <img src="${post.user.avatar}" alt="${post.user.name}" class="post-avatar">
                <div class="post-user-info">
                    <span class="post-user">${post.user.name}</span>
                    <span class="post-username">@${post.user.username}</span>
                    <span class="post-timestamp">${formatTimestamp(post.timestamp)}</span>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <span class="post-action" onclick="likePost(${post.id})">
                    <i data-lucide="heart"></i> ${post.likes} Likes
                </span>
                <span class="post-action">
                    <i data-lucide="message-circle"></i> ${post.comments.length} Comments
                </span>
                <span class="post-action" onclick="sharePost(${post.id})">
                    <i data-lucide="share-2"></i> Share
                </span>
            </div>
        `;
        lucide.createIcons();
    }

    // Render comments
    function renderComments() {
        commentsList.innerHTML = '';
        post.comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <img src="${comment.user.avatar}" alt="${comment.user.name}" class="comment-avatar">
                    <span class="comment-user">${comment.user.name}</span>
                    <span class="comment-username">@${comment.user.username}</span>
                    <span class="comment-timestamp">${formatTimestamp(comment.timestamp)}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            `;
            commentsList.appendChild(commentElement);
        });
    }

    // Handle comment submission
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = document.getElementById('comment-content').value.trim();
        if (content) {
            const newComment = {
                id: post.comments.length + 1,
                user: {
                    id: 1,
                    name: 'Current User',
                    username: 'currentuser',
                    avatar: '/placeholder.svg?height=32&width=32'
                },
                content: content,
                timestamp: new Date().toISOString()
            };
            post.comments.push(newComment);
            renderComments();
            commentForm.reset();
        }
    });

    // Format timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    // Initialize page
    renderPost();
    renderComments();
});

// Placeholder functions for post actions
function likePost(postId) {
    console.log(`Liked post ${postId}`);
    // In a real app, you would send a request to your server to update the like count
    // and then update the UI accordingly
}

function sharePost(postId) {
    console.log(`Sharing post ${postId}`);
    // In a real app, you would implement sharing functionality
    // This could open a modal with sharing options or copy a link to the clipboard
}