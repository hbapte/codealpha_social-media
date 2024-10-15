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
    
    const avatarElement = document.getElementById('avatar-preview');
    const namesElement = document.getElementById('names');
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const bioElement = document.getElementById('bio');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const avatarUpload = document.getElementById('avatar-upload');

    // Fetch user profile data from the API
    async function fetchUserProfile() {
        const token = localStorage.getItem('token'); // Retrieve Bearer token
        try {
            const response = await fetch('http://localhost:8080/api/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            populateForm(data.user);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    // Populate form with user data
    function populateForm(user) {
        namesElement.value = user.names;
        emailElement.value = user.email;
        usernameElement.value = user.username;
        bioElement.value = user.bio || ''; // Handle empty bio
        avatarElement.src = user.avatar || './assets/placeholder.svg'; // Fallback for avatar
    }

    // Upload avatar to Cloudinary
    async function uploadAvatar(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'd5gvsqi7'); // Replace with your Cloudinary preset

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dcfnliruh/image/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            return data.secure_url; // Return the URL of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Image upload failed. Please try again.');
            throw error; // Re-throw the error to handle it later
        }
    }

    // Handle form submission
    saveProfileBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const formData = new FormData(document.getElementById('edit-profile-form'));
        const updatedUserData = Object.fromEntries(formData.entries());

        // If a new avatar is uploaded, handle the upload to Cloudinary
        if (avatarUpload.files.length > 0) {
            try {
                const uploadedAvatarUrl = await uploadAvatar(avatarUpload.files[0]);
                updatedUserData.avatar = uploadedAvatarUrl; // Add the new avatar URL to the data
            } catch (error) {
                // Handle error if upload fails
                console.error('Failed to upload avatar:', error);
                return; // Exit if the upload failed
            }
        }

        // Send updated data to the server
        const token = localStorage.getItem('token'); // Retrieve Bearer token
        try {
            const response = await fetch('http://localhost:8080/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            alert('Profile updated successfully!');
            // Optionally redirect to profile page or refresh data
            window.location.href = 'profile.html';
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to update profile. Please try again.');
        }
    });

    // Handle avatar upload change
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarElement.src = e.target.result; // Preview the selected image
            };
            reader.readAsDataURL(file);
        }
    });

    // Initialize Lucide icons
    lucide.createIcons();

    // Fetch user profile when the page loads
    fetchUserProfile();
});
