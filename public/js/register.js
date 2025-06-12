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

        if (password.length<6){
            error.errorMessageDiv.textContent='Password must be at least 6 charachters long';
            error.errorMessageDiv.textContent='block';
            return;
        }
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // On successful registration, redirect to the homepage
                alert(data.message || 'Registration Successful');
                window.location.href = '/'; 
            } else {
                errorMessageDiv.textContent = data.message || 'An unknown error occurred.';
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            errorMessageDiv.textContent = 'Could not connect to the server. Please try again later.';
            errorMessageDiv.style.display = 'block';
        }
    });
});