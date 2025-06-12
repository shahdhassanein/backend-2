document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    // Password visibility toggle
    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';

        // Use the correct IDs that match your HTML form
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;

        if (!name || !email || !phone || !password) {
            errorMessageDiv.textContent = 'Please fill out all fields.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Registration successful
                console.log('Registration successful:', data);
                // Redirect to home page after successful registration
                window.location.href = '/';
            } else {
                errorMessageDiv.textContent = data.message || 'Registration failed.';
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration fetch error:', error);
            errorMessageDiv.textContent = 'Could not connect to the server. Please try again later.';
            errorMessageDiv.style.display = 'block';
        }
    });
});