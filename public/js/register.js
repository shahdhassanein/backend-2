document.getElementById('register-form').addEventListener('submit', async (e) => {
    // مهمة جدًا علشان ما يعملش refresh
 e.preventDefault();
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