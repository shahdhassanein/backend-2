// File: /public/js/login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    // Password visibility toggle
    if(passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        errorMessageDiv.style.display = 'none'; // Hide previous errors

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Check user role and redirect accordingly
                if (data.user && data.user.role === 'admin') {
                    // Redirect to admin dashboard
                    window.location.href = '/admin';
                } else {
                    // Redirect to regular user homepage
                    window.location.href = '/';
                }
            } else {
                errorMessageDiv.textContent = data.error || 'An unknown error occurred.';
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            errorMessageDiv.textContent = 'Could not connect to the server. Please try again later.';
            errorMessageDiv.style.display = 'block';
        }
    });
});