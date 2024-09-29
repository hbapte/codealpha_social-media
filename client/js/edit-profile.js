document.addEventListener('DOMContentLoaded', () => {
    // Simulated user data (in a real app, this would come from an API)
    const userData = {
        names: "John Doe",
        email: "john.doe@example.com",
        username: "johndoe123",
        bio: "Web developer and coffee enthusiast. Passionate about creating beautiful and functional user interfaces.",
        avatar: "./assets/placeholder.svg?height=128&width=128",
        role: "Web Developer"
    };

    // Populate form with user data
    function populateForm(user) {
        document.getElementById('names').value = user.names;
        document.getElementById('email').value = user.email;
        document.getElementById('username').value = user.username;
        document.getElementById('bio').value = user.bio;
        document.getElementById('role').value = user.role;
        document.getElementById('avatar-preview').src = user.avatar;
    }

    // Handle form submission
    document.getElementById('save-profile-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const formData = new FormData(document.getElementById('edit-profile-form'));
        const updatedUserData = Object.fromEntries(formData.entries());
        
        // In a real app, you would send this data to your server
        console.log('Updated user data:', updatedUserData);
        
        // Simulate a successful update
        alert('Profile updated successfully!');
    });

    // Handle avatar upload
    document.getElementById('avatar-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('avatar-preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Initialize Lucide icons
    lucide.createIcons();

    // Populate the form when the page loads
    populateForm(userData);
});