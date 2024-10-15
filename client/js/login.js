document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageDiv = document.getElementById("message");
  const togglePasswordButton = document.querySelector(".toggle-password");

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); 
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  // Toggle password visibility
  togglePasswordButton.addEventListener("click", () => {
    togglePasswordVisibility(passwordInput, togglePasswordButton);
  });

  // Email validation on input
  emailInput.addEventListener("input", () => {
    validateField(emailInput, "email-Error", validateEmail, "Invalid email");
  });

  // Password validation on input
  passwordInput.addEventListener("input", () => {
    validateField(passwordInput, "password-Error", (value) => value.length >= 6, "Password should be at least 6 characters long");
  });

  // Handle form submission
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const isValid = validateLoginForm(email, password);
    if (!isValid) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Login successful!", "success");
        setCookie("token", data.token, 2);      
        window.location.href = "./index.html";
      } else {
        showMessage(data.message || "Login failed", "error");
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

  function validateLoginForm(email, password) {
    const isValidEmail = validateEmail(email);
    const isValidPassword = password.length >= 6;
    validateField(emailInput, "email-Error", validateEmail, "Invalid email");
    validateField(passwordInput, "password-Error", (value) => value.length >= 6, "Password should be at least 6 characters long");

    return isValidEmail && isValidPassword;
  }

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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
