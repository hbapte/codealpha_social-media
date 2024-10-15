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

    const settingsForm = document.getElementById('settings-form');
    const deactivateBtn = document.getElementById('deactivate-btn');
    const deleteBtn = document.getElementById('delete-btn');

    // Simulated user settings
    const userSettings = {
        profileVisibility: 'public',
        showEmail: true,
        emailNotifications: true,
        pushNotifications: false,
        language: 'en',
        timezone: 'UTC'
    };

    // Populate form with user settings
    function populateForm() {
        document.getElementById('profile-visibility').value = userSettings.profileVisibility;
        document.getElementById('show-email').checked = userSettings.showEmail;
        document.getElementById('email-notifications').checked = userSettings.emailNotifications;
        document.getElementById('push-notifications').checked = userSettings.pushNotifications;
        document.getElementById('language').value = userSettings.language;
        document.getElementById('timezone').value = userSettings.timezone;
    }

    // Handle form submission
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        const updatedSettings = {
            profileVisibility: formData.get('profile-visibility'),
            showEmail: formData.get('show-email') === 'on',
            emailNotifications: formData.get('email-notifications') === 'on',
            pushNotifications: formData.get('push-notifications') === 'on',
            language: formData.get('language'),
            timezone: formData.get('timezone')
        };
        
        // In a real app, you would send this data to your server
        console.log('Updated settings:', updatedSettings);
        
        // Simulate a successful update
        alert('Settings updated successfully!');
    });

    // Handle deactivate account
    deactivateBtn.addEventListener('click', () => {
        const confirm = window.confirm('Are you sure you want to deactivate your account? This action can be undone by logging in again.');
        if (confirm) {
            // In a real app, you would send a request to your server to deactivate the account
            console.log('Account deactivated');
            alert('Your account has been deactivated. You can reactivate it by logging in again.');
        }
    });

    // Handle delete account
    deleteBtn.addEventListener('click', () => {
        const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone!');
        if (confirm) {
            // In a real app, you would send a request to your server to delete the account
            console.log('Account deleted');
            alert('Your account has been deleted. We\'re sorry to see you go!');
        }
    });

    // Initialize page
    populateForm();
});