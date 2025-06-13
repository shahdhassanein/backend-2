// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');

    // Password toggle functionality
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            // Toggle the eye icon
            passwordToggle.classList.toggle('fa-eye');
            passwordToggle.classList.toggle('fa-eye-slash');
        });
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default browser form submission

            errorMessageDiv.style.display = 'none'; // Hide previous errors
            errorMessageDiv.textContent = ''; // Clear previous error text

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(loginForm.action, { // Use form's action attribute
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    redirect: 'follow' // CRITICAL: Tell fetch to follow redirects
                });

                // If the backend sent a redirect (e.g., after successful login to /Dashboard)
                if (response.redirected) {
                    window.location.href = response.url; // Manually navigate the browser
                    return; // Stop further JS execution
                }

                // If the response was not a redirect, it means there was likely an error
                // from the backend (e.g., 400 Bad Request, 401 Unauthorized)
                const data = await response.json(); // Parse the JSON error response

                // Display error message
                if (!response.ok) { // Check if HTTP status code is not 2xx
                    errorMessageDiv.textContent = data.message || 'Login failed. Please try again.';
                    errorMessageDiv.style.display = 'block';
                } else {
                    // This block should ideally not be reached if redirect worked.
                    console.log('Login successful, but no redirect received:', data);
                    errorMessageDiv.textContent = data.message || 'Login successful!';
                    errorMessageDiv.style.display = 'block';
                    // Optional: auto-redirect after a short delay if no redirect from backend
                    setTimeout(() => {
                        window.location.href = '/Dashboard';
                    }, 1500); // Redirect after 1.5 seconds
                }

            } catch (error) {
                console.error('Frontend login error:', error);
                errorMessageDiv.textContent = 'Could not connect to the server. Please check your network or server status.';
                errorMessageDiv.style.display = 'block';
            }
        });
    }
});