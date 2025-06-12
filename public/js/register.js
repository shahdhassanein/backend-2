// File: /public/js/register.js

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    // Password visibility toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        errorMessageDiv.style.display = 'none';

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        try {
            // ****** EDITED LINE HERE ******
            // Changed the endpoint from '/api/users/register' to '/api/auth/register'
            const response = await fetch('/api/auth/register', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // On successful registration, redirect to the homepage
                window.location.href = '/'; 
            } else {
                // Use data.message if available, as that's what your backend sends for errors
                errorMessageDiv.textContent = data.error || 'An unknown error occurred.';
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration fetch error:', error); // Added for debugging
            errorMessageDiv.textContent = 'Could not connect to the server. Please try again later.';
            errorMessageDiv.style.display = 'block';
        }
    });
});