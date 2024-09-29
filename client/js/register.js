document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const namesInput = document.getElementById("names");
    const emailInput = document.getElementById("email");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const messageDiv = document.getElementById("message");
    const togglePasswordButton = document.querySelector(".toggle-password");
  
    // Toggle password visibility
    togglePasswordButton.addEventListener("click", () => {
      togglePasswordVisibility(passwordInput, togglePasswordButton);
    });
  
    // Live validations on input fields
    namesInput.addEventListener("input", () => {
      validateField(namesInput, "names-Error", (value) => value.trim() !== "", "Name is required");
    });
  
    emailInput.addEventListener("input", () => {
      validateField(emailInput, "email-Error", validateEmail, "Invalid email");
    });
  
    usernameInput.addEventListener("input", () => {
      validateField(usernameInput, "username-Error", (value) => value.trim() !== "", "Username is required");
    });
  
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value.trim();
      validateField(passwordInput, "password-Error", (value) => value.length >= 6, "Password should be at least 6 characters long");
      displayPasswordStrength(password);
    });
  
    // Handle form submission
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const names = namesInput.value.trim();
      const email = emailInput.value.trim();
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
  
      const isValid = validateSignupForm(names, email, username, password);
      if (!isValid) return;
  
      try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ names, email, username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          showMessage("Registration successful! You can now log in.", "success");
          window.location.href = "./login.html"; // Redirect to login page
        } else {
          showMessage(data.message || "Registration failed", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showMessage("An error occurred. Please try again.", "error");
      }
    });
  
    // Utility functions
    function togglePasswordVisibility(input, button) {
      const icon = button.querySelector('i');
      if (input.type === "password") {
        input.type = "text";
        icon.setAttribute("data-lucide", "eye-off");
      } else {
        input.type = "password";
        icon.setAttribute("data-lucide", "eye");
      }
      lucide.createIcons();
    }
  
    function validateField(input, errorId, validationFn, errorMessage) {
      const errorElem = document.getElementById(errorId);
      if (!validationFn(input.value.trim())) {
        errorElem.textContent = errorMessage;
      } else {
        errorElem.textContent = "";
      }
    }
  
    function validateSignupForm(names, email, username, password) {
      const isValidNames = names.trim() !== "";
      const isValidEmail = validateEmail(email);
      const isValidUsername = username.trim() !== "";
      const isValidPassword = password.length >= 6;
  
      validateField(namesInput, "names-Error", (value) => value.trim() !== "", "Name is required");
      
      validateField(emailInput, "email-Error", validateEmail, "Invalid email");
      validateField(usernameInput, "username-Error", (value) => value.trim() !== "", "Username is required");
      validateField(passwordInput, "password-Error", (value) => value.length >= 6, "Password should be at least 6 characters long");
  
      return isValidNames && isValidEmail && isValidUsername && isValidPassword;
    }
  
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    function displayPasswordStrength(password) {
      const strengthIndicator = document.getElementById("password-strength");
      const lengthCriteria = password.length >= 6;
      const numberCriteria = /\d/.test(password);
      const uppercaseCriteria = /[A-Z]/.test(password);
  
      if (lengthCriteria && numberCriteria && uppercaseCriteria) {
        strengthIndicator.textContent = "Strong password";
        strengthIndicator.style.color = "green";
      } else if (lengthCriteria) {
        strengthIndicator.textContent = "Weak password (add numbers and uppercase letters)";
        strengthIndicator.style.color = "orange";
      } else {
        strengthIndicator.textContent = "Password too short";
        strengthIndicator.style.color = "red";
      }
    }
  
    function showMessage(message, type) {
      messageDiv.textContent = message;
      messageDiv.className = type === "success" ? "message success" : "message error";
      setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.className = "";
      }, 3500);
    }
  });
  