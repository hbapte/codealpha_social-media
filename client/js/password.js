document.addEventListener('DOMContentLoaded', () => {
    const changePasswordForm = document.getElementById('change-password-form');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordStrengthIndicator = document.getElementById('password-strength');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                targetInput.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
        });
    });

    // Check password strength
    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;
        const strength = checkPasswordStrength(password);
        updatePasswordStrengthIndicator(strength);
    });

    // Validate password match
    confirmPasswordInput.addEventListener('input', () => {
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Passwords don't match");
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    });

    // Handle form submission
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password don't match");
            return;
        }

        if (checkPasswordStrength(newPassword) === 'weak') {
            alert('Please choose a stronger password');
            return;
        }

        // In a real app, you would send this data to your server
        console.log('Password change request:', { currentPassword, newPassword });

        // Simulate a successful password change
        alert('Password changed successfully!');
        changePasswordForm.reset();
    });

    // Check password strength
    function checkPasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'weak';
        }

        let strength = 0;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumbers) strength++;
        if (hasSpecialChars) strength++;

        if (strength < 3) {
            return 'weak';
        } else if (strength === 3) {
            return 'medium';
        } else {
            return 'strong';
        }
    }

    // Update password strength indicator
    function updatePasswordStrengthIndicator(strength) {
        passwordStrengthIndicator.textContent = `Password strength: ${strength}`;
        passwordStrengthIndicator.className = 'password-strength ' + strength;
    }

    // Initialize Lucide icons
    lucide.createIcons();
});